/**
 * askai.js — Docsify/Hugo AI Study Assistant (widget + inline)
 */
(function () {
  "use strict";

  var BRANCH = "main";
  var RAW = "https://raw.githubusercontent.com/sanand0/tools-in-data-science-public/" + BRANCH;
  var STORAGE_KEY = "tds-ai-provider";
  var THEME_STORAGE_KEY = "tds-ai-theme";
  var MAX_QUESTION = 1200;
  var MAX_CONTEXT = 2600;

  var PROVIDERS = [
    { id: "google-ai", name: "Google AI Mode", url: "https://www.google.com/search?udm=50&q=" },
    { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/?q=" },
    { id: "claude", name: "Claude", url: "https://claude.ai/new?q=" },
    { id: "gemini", name: "Gemini", url: "https://gemini.google.com/app?q=" },
    { id: "perplexity", name: "Perplexity", url: "https://www.perplexity.ai/?q=" },
  ];

  var PRESETS = [
    { id: "explain", label: "Explain simply", question: "Explain this topic clearly with a helpful example. Keep it brief and beginner-friendly." },
    { id: "quiz", label: "Quiz me", question: "Give me 15 multiple-choice questions (MCQs) with answers on this topic, including interview-style questions." },
    { id: "cheatsheet", label: "CheatSheet", question: "Give me a concise cheat sheet for this topic." },
    { id: "review", label: "Review notes", question: "Turn this into concise revision notes and three recall questions." },
  ];

  var ICONS = {
    sparkle: '<path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z"></path><path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z"></path>',
    close: '<path d="m7 7 10 10M17 7 7 17"></path>',
    copy: '<rect x="8" y="8" width="10" height="10" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>',
    external: '<path d="M7 17 17 7M8 7h9v9"></path>',
    chevron: '<path d="m8 10 4 4 4-4"></path>',
  };

  function svg(name) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + "</svg>"; }
  function clean(s) { return s ? s.replace(/\s+/g, " ").trim() : ""; }
  function pageTitle() { var h = document.querySelector(".markdown-section h1, article h1, h1"); return h ? clean(h.textContent) : document.title; }
  function pageUrl() { return location.origin + location.pathname + (location.hash || "#/"); }

  function rawUrl() {
    var p = "";
    if (window.$docsify && Object.keys(window.$docsify).length > 0) {
      p = (location.hash || "#/").replace(/^#\/?/, "").split("?")[0].split("#")[0];
      if (!p || p === "/") p = "README";
    } else {
      p = location.pathname.replace(/^\/|\/$/g, "");
      if (!p) p = "README";
    }
    if (!p.endsWith(".md")) p += ".md";
    return RAW + "/" + p;
  }

  function providerById(id) { return PROVIDERS.find(function (p) { return p.id === id; }) || PROVIDERS[0]; }
  function storageGet(k, fb) { try { return localStorage.getItem(k) || fb; } catch (e) { return fb; } }
  function storageSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

  function writeClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); });
    }
    return fallbackCopy(text);
  }
  function fallbackCopy(text) {
    var t = document.createElement("textarea"); t.value = text;
    t.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(t); t.focus(); t.select();
    var ok = document.execCommand("copy"); t.remove();
    return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
  }

  function buildPrompt(opts) {
    var ctx = [
      "- Current Page URL: " + pageUrl(),
      "- Source Markdown Raw URL: " + rawUrl()
    ];
    if (opts.selectedText) {
      ctx.push("- Selected Passage: " + opts.selectedText);
    }
    if (opts.sectionContext) {
      ctx.push("- Document Section: " + opts.sectionContext);
    }

    var lines = [
      "<student-query>",
      opts.question,
      "</student-query>",
      "",
      "<context>",
      ctx.join("\n"),
      "</context>",
      "",
      "<instructions>",
      "Please:",
      "- Explain clearly in a student-friendly tone.",
      "- Use your own reasoning and broader knowledge.",
      "- Stay focused and use a brief example if it helps.",
      "</instructions>"
    ];

    if (opts.wholeContent) {
      lines.push("", "<whole-text-content>", opts.wholeContent, "</whole-text-content>");
    }

    return lines.join("\n");
  }

  // ── Selection capture (safeguards selected text on click launcher) ───────
  var capturedSelection = "";
  function updateSelection() {
    var sel = window.getSelection();
    var text = sel ? clean(sel.toString()) : "";
    if (text) {
      var c = document.querySelector(".markdown-section") || document.querySelector(".content") || document.querySelector("article");
      if (c && sel.anchorNode && sel.focusNode && c.contains(sel.anchorNode) && c.contains(sel.focusNode)) {
        capturedSelection = text.slice(0, MAX_CONTEXT);
      }
    }
  }
  document.addEventListener("selectionchange", function () {
    var active = document.activeElement;
    if (active && (active.id === "ai-question" || active.closest(".ai-panel") || active.closest(".ai-inline-menu"))) return;
    updateSelection();
  });
  document.addEventListener("mouseup", function (e) {
    if (e.target.closest(".ai-launcher") || e.target.closest(".ai-panel") || e.target.closest(".ai-inline-wrap")) return;
    var sel = window.getSelection();
    var text = sel ? clean(sel.toString()) : "";
    capturedSelection = text ? text.slice(0, MAX_CONTEXT) : "";
  });

  var rawMarkdownContent = "";

  function fetchRawMarkdown() {
    rawMarkdownContent = "";
    var url = rawUrl();
    if (!url) return;
    fetch(url)
      .then(function (res) {
        if (res.ok) return res.text();
        throw new Error("fail");
      })
      .then(function (text) {
        rawMarkdownContent = text;
      })
      .catch(function () {});
  }

  function getCleanDOMText() {
    var c = document.querySelector(".markdown-section") || document.querySelector(".content") || document.querySelector("article") || document.body;
    if (!c) return "";
    var clone = c.cloneNode(true);
    var removeSelectors = "script, style, nav, footer, header, svg, iframe, noscript, .ai-launcher, .ai-panel, .ai-inline-wrap, .book-menu, .book-toc, .sidebar";
    clone.querySelectorAll(removeSelectors).forEach(function (el) {
      el.remove();
    });
    return clone.textContent.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function wholePageContent() {
    if (rawMarkdownContent) {
      return rawMarkdownContent.slice(0, 3000);
    }
    return getCleanDOMText().slice(0, 3000);
  }

  // ── CSS Style (with premium Green/Violet themes & custom font sizes) ───
  var CSS = ":root{--ai-primary:#8b5cf6;--ai-primary-hover:#7c3aed;--ai-primary-border:#8b5cf6;--ai-primary-text:#fff;--ai-panel-bg:#fff;--ai-panel-header:#f8fafc;--ai-panel-control:#f1f5f9;--ai-panel-input:#fff;--ai-panel-active:#fff;--ai-panel-border:#e2e8f0;--ai-chip-text:#7c3aed;--ai-chip-bg:rgba(139,92,246,.08);--ai-chip-border:rgba(139,92,246,.2);--ai-shadow:0 20px 50px rgba(15,23,42,.12);--ai-ink:#0f172a;--ai-muted:#64748b;--ai-line:#e2e8f0}@media(prefers-color-scheme:dark){:root{--ai-panel-bg:#0f172a;--ai-panel-header:#1e293b;--ai-panel-control:#1e293b;--ai-panel-input:#0f172a;--ai-panel-active:#334155;--ai-panel-border:rgba(148,163,184,.15);--ai-primary:#c084fc;--ai-primary-hover:#d8b4fe;--ai-chip-text:#c084fc;--ai-chip-bg:rgba(192,132,252,.12);--ai-chip-border:rgba(192,132,252,.3);--ai-shadow:0 25px 60px rgba(0,0,0,.45);--ai-ink:#f1f5f9;--ai-muted:#94a3b8;--ai-line:rgba(148,163,184,.15)}}.ai-launcher{position:fixed;z-index:28;right:1.25rem;bottom:1.25rem;display:grid;grid-template-columns:auto auto;column-gap:.55rem;align-items:center;min-height:3.15rem;padding:.65rem 1rem;border:1px solid var(--ai-primary-border);border-radius:999px;color:var(--ai-primary-text);background:var(--ai-primary);box-shadow:0 14px 38px rgb(21 28 36 / 24%);cursor:pointer;font:inherit;font-size:.92rem;font-weight:800;transition:background 160ms,box-shadow 160ms,transform 160ms}.ai-launcher:hover{background:var(--ai-primary-hover);box-shadow:0 18px 44px rgb(21 28 36 / 30%);transform:translateY(-2px)}.ai-launcher svg{grid-row:1/3;width:1.2rem;height:1.2rem;fill:none;stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.8}.ai-launcher>span:not(.ai-launcher-hint){line-height:1.05;text-align:left}.ai-launcher-hint{color:rgb(255 255 255 / 74%);font-size:.72rem;font-weight:600;line-height:1.05;text-align:left}.ai-panel{position:fixed;z-index:75;right:1.25rem;bottom:5.15rem;display:none;width:24.5rem;height:35rem;max-width:calc(100vw - 2rem);max-height:calc(100dvh - 7rem);flex-direction:column;overflow:hidden;border:1px solid var(--ai-panel-border);border-radius:1rem;color:var(--ai-ink);background:var(--ai-panel-bg);box-shadow:var(--ai-shadow)}body.ai-panel-open .ai-panel{display:flex}.ai-panel-header{display:flex;flex:0 0 auto;align-items:center;justify-content:space-between;gap:.8rem;padding:.8rem .9rem;border-bottom:1px solid var(--ai-line);background:var(--ai-panel-header)}.ai-panel-heading{display:flex;align-items:center;gap:.65rem}.ai-panel-mark{display:grid;width:2.1rem;height:2.1rem;border-radius:.65rem;color:var(--ai-primary-text);background:var(--ai-primary);place-content:center}.ai-panel-mark svg,.ai-panel-close svg,.ai-panel-actions svg{width:1rem;height:1rem;fill:none;stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.8}.ai-panel-kicker{display:block;margin-bottom:.05rem;color:var(--ai-muted);font-size:.62rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase}.ai-panel-heading h2{margin:0;color:var(--ai-ink);font-size:1.22rem;letter-spacing:-.025em}.ai-panel-close{display:grid;width:2rem;height:2rem;padding:0;border:0;border-radius:50%;color:var(--ai-muted);background:var(--ai-panel-control);place-content:center;cursor:pointer}.ai-panel-body{flex:1;padding:.85rem .9rem .9rem;overflow-y:auto;overscroll-behavior:contain;background:var(--ai-panel-bg)}.ai-panel-context{display:flex;align-items:baseline;gap:.4rem}.ai-panel-context-label{flex:0 0 auto;color:var(--ai-muted);font-size:.75rem;font-weight:750}.ai-panel-context strong{display:block;min-width:0;overflow:hidden;color:var(--ai-ink);font-size:.82rem;text-overflow:ellipsis;white-space:nowrap}.ai-scope{display:flex;gap:.25rem;margin:.65rem 0;padding:.2rem;border:0;border-radius:.65rem;background:var(--ai-panel-control)}.ai-scope legend{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.ai-scope button{flex:1;padding:.42rem .55rem;border:0;border-radius:.48rem;color:var(--ai-muted);background:transparent;font-size:.78rem;font-weight:750;cursor:pointer}.ai-scope button.is-active{color:var(--ai-ink);background:var(--ai-panel-active);box-shadow:0 2px 8px rgb(24 33 43 / 8%)}.ai-scope button:disabled{opacity:.42;cursor:not-allowed}.ai-presets{display:flex;gap:.35rem;margin:0 0 .7rem;padding-bottom:.18rem;overflow-x:auto;scrollbar-width:thin}.ai-presets button{flex:0 0 auto;padding:.4rem .58rem;border:1px solid var(--ai-chip-border);border-radius:999px;color:var(--ai-chip-text);background:var(--ai-chip-bg);font:inherit;font-size:.75rem;font-weight:750;cursor:pointer}.ai-presets button:hover{border-color:var(--ai-primary)}.ai-panel-label{display:block;margin-bottom:0.4rem;color:var(--ai-ink);font-size:.85rem;font-weight:800}.ai-panel textarea{display:block;width:100%;min-height:6rem;padding:.7rem .78rem;resize:vertical;border:1px solid var(--ai-line);border-radius:.7rem;color:var(--ai-ink);background:var(--ai-panel-input);font:inherit;font-size:.88rem;line-height:1.5;box-sizing:border-box}.ai-panel textarea::placeholder{color:var(--ai-muted)}.ai-panel textarea:focus{outline:none;border-color:var(--ai-primary)}.ai-compose-meta{display:flex;min-height:1.4rem;align-items:flex-start;justify-content:space-between;gap:.7rem;padding-top:.3rem;color:var(--ai-muted);font-size:.7rem}.ai-compose-meta [data-type='error']{color:var(--ai-primary)}.ai-compose-meta [data-type='success']{color:#16a34a}@media(prefers-color-scheme:dark){.ai-compose-meta [data-type='success']{color:#78d69f}}.ai-char-count{flex:0 0 auto;font-family:monospace}.ai-provider-row{display:grid;grid-template-columns:auto 1fr;gap:.6rem;align-items:center;margin-top:.55rem}.ai-provider-row label{color:var(--ai-muted);font-size:.75rem;font-weight:750}.ai-provider-row select{width:100%;min-height:2.25rem;padding:.4rem 1.8rem .4rem .65rem;border:1px solid var(--ai-line);border-radius:.6rem;color:var(--ai-ink);background:var(--ai-panel-control);font:inherit;font-size:.82rem;font-weight:700}.ai-panel-actions{display:grid;grid-template-columns:minmax(0,.75fr) minmax(0,1.25fr);gap:.5rem;margin-top:.65rem}.ai-panel-actions button{display:inline-flex;min-height:2.45rem;align-items:center;justify-content:center;gap:.4rem;padding:.55rem .7rem;border-radius:.6rem;font:inherit;font-size:.8rem;font-weight:800;cursor:pointer}.ai-panel-copy{border:1px solid var(--ai-line);color:var(--ai-muted);background:var(--ai-panel-control)}.ai-panel-submit{border:1px solid var(--ai-primary-border);color:var(--ai-primary-text);background:var(--ai-primary)}.ai-panel-submit:hover{background:var(--ai-primary-hover)}.ai-panel-privacy{margin:.55rem 0 0;color:var(--ai-muted);font-size:.68rem;line-height:1.45}.ai-inline-wrap{position:relative;z-index:1;display:inline-block;max-width:100%;margin:.12rem .08rem;vertical-align:baseline}.ai-inline-wrap.is-open{z-index:45}.ai-inline-wrap.is-standalone{margin-block:.28rem}.ai-inline-trigger{display:inline-flex;max-width:100%;align-items:center;gap:.34rem;padding:.3rem .52rem;border:1px solid var(--ai-chip-border);border-radius:999px;color:var(--ai-chip-text);background:var(--ai-chip-bg);box-shadow:0 1px 2px rgb(20 28 37 / 5%);font:inherit;font-size:.72rem;font-weight:750;text-align:left;cursor:pointer;transition:border-color 150ms,background 150ms,box-shadow 150ms,transform 150ms}.ai-inline-trigger>span{min-width:0;overflow-wrap:anywhere}.ai-inline-trigger:hover,.ai-inline-wrap.is-open .ai-inline-trigger{border-color:var(--ai-primary);background:color-mix(in srgb,var(--ai-chip-bg) 90%,var(--ai-panel-bg));box-shadow:0 5px 16px rgb(20 28 37 / 9%);transform:translateY(-1px)}.ai-inline-trigger svg{flex:0 0 auto;width:.85rem;height:.85rem;fill:none;stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.8}.ai-inline-chevron{transition:transform 150ms}.ai-inline-wrap.is-open .ai-inline-chevron{transform:rotate(180deg)}.ai-inline-menu{position:absolute;top:calc(100% + .48rem);left:0;display:none;width:12.5rem;padding:.35rem;border:1px solid var(--ai-panel-border);border-radius:.65rem;color:var(--ai-ink);background:var(--ai-panel-bg);box-shadow:var(--ai-shadow);font-family:inherit;line-height:1.35;text-align:left;flex-direction:column}.ai-inline-menu:not([hidden]){display:flex}.ai-inline-wrap.align-end .ai-inline-menu{right:0;left:auto}.ai-inline-wrap.open-up .ai-inline-menu{top:auto;bottom:calc(100% + .48rem)}.ai-inline-item{display:flex;align-items:center;justify-content:space-between;gap:.5rem;width:100%;padding:.45rem .6rem;border:0;background:transparent;color:var(--ai-ink);font-size:.72rem;font-weight:600;text-align:left;cursor:pointer;border-radius:.4rem;transition:background 120ms,color 120ms}.ai-inline-item:hover{background:var(--ai-panel-control);color:var(--ai-primary)}.ai-inline-item svg{width:.85rem;height:.85rem;fill:none;stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.8}.ai-inline-divider{height:1px;background:var(--ai-line);margin:.3rem 0}.ai-inline-status{padding:.2rem .4rem 0;font-size:.58rem;color:var(--ai-muted);text-align:center}.ai-inline-status[data-type='success']{color:#16a34a}.ai-inline-status[data-type='error']{color:var(--ai-primary)}.ai-panel-resize-handle{position:absolute;left:0;top:0;width:16px;height:16px;cursor:nwse-resize;z-index:100;border-top-left-radius:1rem}.ai-panel-resize-handle::before{content:'';position:absolute;left:4px;top:4px;width:6px;height:6px;border-left:2px solid var(--ai-muted);border-top:2px solid var(--ai-muted)}@media(max-width:600px){.ai-launcher{right:.85rem;bottom:.85rem;min-height:2.8rem;padding:.55rem .78rem}.ai-launcher-hint{display:none}.ai-launcher svg{grid-row:auto}.ai-panel{right:0;bottom:0;width:100%;max-height:min(76dvh,38rem);border-right:0;border-bottom:0;border-left:0;border-radius:1rem 1rem 0 0}.ai-panel::before{display:block;width:2.5rem;height:4px;margin:.42rem auto -.1rem;border-radius:999px;background:var(--ai-line);content:''}.ai-panel-body{padding-inline:1rem}.ai-inline-wrap{max-width:calc(100vw - 2rem)}.ai-panel-resize-handle{display:none}}@media(prefers-reduced-motion:reduce){.ai-launcher,.ai-inline-trigger,.ai-inline-chevron{transition:none}}:root[data-ai-theme='purple'],body[data-ai-theme='purple']{--ai-primary:#8b5cf6;--ai-primary-hover:#7c3aed;--ai-primary-border:#8b5cf6;--ai-chip-text:#7c3aed;--ai-chip-bg:rgba(139,92,246,.08);--ai-chip-border:rgba(139,92,246,.2)}@media(prefers-color-scheme:dark){:root[data-ai-theme='purple'],body[data-ai-theme='purple']{--ai-primary:#c084fc;--ai-primary-hover:#d8b4fe;--ai-chip-text:#c084fc;--ai-chip-bg:rgba(192,132,252,.12);--ai-chip-border:rgba(192,132,252,.3)}}:root[data-ai-theme='green'],body[data-ai-theme='green']{--ai-primary:#16a34a;--ai-primary-hover:#15803d;--ai-primary-border:#16a34a;--ai-chip-text:#15803d;--ai-chip-bg:rgba(22,163,74,.08);--ai-chip-border:rgba(22,163,74,.2)}@media(prefers-color-scheme:dark){:root[data-ai-theme='green'],body[data-ai-theme='green']{--ai-primary:#22c55e;--ai-primary-hover:#4ade80;--ai-chip-text:#22c55e;--ai-chip-bg:rgba(34,197,94,.12);--ai-chip-border:rgba(34,197,94,.3)}}:root[data-ai-theme='blue'],body[data-ai-theme='blue']{--ai-primary:#2563eb;--ai-primary-hover:#1d4ed8;--ai-primary-border:#2563eb;--ai-chip-text:#1d4ed8;--ai-chip-bg:rgba(37,99,235,.08);--ai-chip-border:rgba(37,99,235,.2)}@media(prefers-color-scheme:dark){:root[data-ai-theme='blue'],body[data-ai-theme='blue']{--ai-primary:#60a5fa;--ai-primary-hover:#93c5fd;--ai-chip-text:#60a5fa;--ai-chip-bg:rgba(96,165,250,.12);--ai-chip-border:rgba(96,165,250,.3)}}:root[data-ai-theme='red'],body[data-ai-theme='red']{--ai-primary:#e11d48;--ai-primary-hover:#be123c;--ai-primary-border:#e11d48;--ai-chip-text:#be123c;--ai-chip-bg:rgba(225,29,72,.08);--ai-chip-border:rgba(225,29,72,.2)}@media(prefers-color-scheme:dark){:root[data-ai-theme='red'],body[data-ai-theme='red']{--ai-primary:#fb7185;--ai-primary-hover:#fca5a5;--ai-chip-text:#fb7185;--ai-chip-bg:rgba(251,113,133,.12);--ai-chip-border:rgba(251,113,133,.3)}}:root[data-ai-theme='orange'],body[data-ai-theme='orange']{--ai-primary:#f97316;--ai-primary-hover:#ea580c;--ai-primary-border:#f97316;--ai-chip-text:#ea580c;--ai-chip-bg:rgba(249,115,22,.08);--ai-chip-border:rgba(249,115,22,.2)}@media(prefers-color-scheme:dark){:root[data-ai-theme='orange'],body[data-ai-theme='orange']{--ai-primary:#fdba74;--ai-primary-hover:#fed7aa;--ai-chip-text:#fdba74;--ai-chip-bg:rgba(253,186,116,.12);--ai-chip-border:rgba(253,186,116,.3)}}.ai-theme-selector{display:flex;gap:.45rem;align-items:center;margin-left:auto;margin-right:.4rem}.ai-theme-dot{width:.78rem;height:.78rem;border-radius:50%;border:1px solid rgba(0,0,0,.1);cursor:pointer;padding:0;transition:transform 120ms,outline 120ms;box-sizing:border-box}.ai-theme-dot:hover{transform:scale(1.2)}.ai-theme-dot.is-active{outline:2px solid var(--ai-ink);outline-offset:1px}.ai-theme-dot[data-theme='purple']{background:#8b5cf6}.ai-theme-dot[data-theme='green']{background:#16a34a}.ai-theme-dot[data-theme='blue']{background:#2563eb}.ai-theme-dot[data-theme='red']{background:#e11d48}.ai-theme-dot[data-theme='orange']{background:#f97316}";

  var THEME_STORAGE_KEY = "tds-ai-theme";

  function applyTheme(themeName) {
    themeName = themeName || "purple";
    document.documentElement.setAttribute("data-ai-theme", themeName);
    document.body.setAttribute("data-ai-theme", themeName);
    storageSet(THEME_STORAGE_KEY, themeName);
    var dots = document.querySelectorAll(".ai-theme-dot");
    dots.forEach(function (dot) {
      dot.classList.toggle("is-active", dot.dataset.theme === themeName);
    });
  }

  // ── Widget panel construction ───────────────────────────────────────────
  var widgetState = { lastFocus: null, scope: "page", selection: "" };

  function createWidget() {
    var launcher = document.createElement("button");
    launcher.className = "ai-launcher"; launcher.type = "button";
    launcher.setAttribute("aria-label", "Ask AI about this page");
    launcher.innerHTML = svg("sparkle") + '<span>Ask AI</span><span class="ai-launcher-hint">about this page</span>';

    // Prevent focus loss on selection highlight when clicking the launcher
    launcher.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });

    var panel = document.createElement("aside");
    panel.className = "ai-panel"; panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false"); panel.setAttribute("aria-hidden", "true");
    panel.innerHTML =
      '<div class="ai-panel-resize-handle"></div>' +
      '<header class="ai-panel-header">' +
      '<div class="ai-panel-heading"><span class="ai-panel-mark">' + svg("sparkle") + '</span>' +
      '<div><span class="ai-panel-kicker">Study assistant</span><h2>Ask AI</h2></div>' +
      '</div>' +
      '<div class="ai-theme-selector">' +
      '<button type="button" class="ai-theme-dot" data-theme="purple" title="Purple theme"></button>' +
      '<button type="button" class="ai-theme-dot" data-theme="green" title="Green theme"></button>' +
      '<button type="button" class="ai-theme-dot" data-theme="blue" title="Blue theme"></button>' +
      '<button type="button" class="ai-theme-dot" data-theme="red" title="Red theme"></button>' +
      '<button type="button" class="ai-theme-dot" data-theme="orange" title="Orange theme"></button>' +
      '</div>' +
      '<button class="ai-panel-close" type="button" aria-label="Close">' + svg("close") + '</button>' +
      '</header>' +
      '<div class="ai-panel-body">' +
      '<div class="ai-panel-context"><span class="ai-panel-context-label">Using context from</span><strong class="ai-panel-page-title">Current page</strong></div>' +
      '<fieldset class="ai-scope"><legend>Context</legend>' +
      '<button class="is-active" type="button" data-scope="page">Page link</button>' +
      '<button type="button" data-scope="selection">Selected text</button>' +
      '</fieldset>' +
      '<label class="ai-include-content" style="display:flex;align-items:center;gap:.4rem;margin:.42rem 0 .7rem;font-size:.76rem;font-weight:700;color:var(--ai-muted);cursor:pointer;">' +
      '<input type="checkbox" id="ai-include-whole" style="margin:0;cursor:pointer;">' +
      '<span>Include full page text content</span>' +
      '</label>' +
      '<div class="ai-presets"></div>' +
      '<label class="ai-panel-label" for="ai-question">What would you like to understand?</label>' +
      '<textarea id="ai-question" rows="5" maxlength="' + MAX_QUESTION + '" placeholder="Ask about a concept, command, example..."></textarea>' +
      '<div class="ai-compose-meta"><span class="ai-status" role="status"></span><span class="ai-char-count">0 / ' + MAX_QUESTION + '</span></div>' +
      '<div class="ai-provider-row"><label for="ai-provider">Open with</label><select id="ai-provider"></select></div>' +
      '<div class="ai-panel-actions">' +
      '<button class="ai-panel-copy" type="button">' + svg("copy") + '<span>Copy prompt</span></button>' +
      '<button class="ai-panel-submit" type="button"><span>Open in AI</span>' + svg("external") + '</button>' +
      '</div>' +
      '<p class="ai-panel-privacy">Nothing is sent until you choose a provider. The generated study prompt is copied so you can inspect or edit it.</p>' +
      '</div>';

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    // Resizable Drag Handling
    var resizeHandle = panel.querySelector(".ai-panel-resize-handle");
    var isResizing = false;
    var startWidth, startHeight, startX, startY;

    resizeHandle.addEventListener("mousedown", function (e) {
      e.preventDefault();
      isResizing = true;
      startWidth = panel.offsetWidth;
      startHeight = panel.offsetHeight;
      startX = e.clientX;
      startY = e.clientY;
      document.body.style.cursor = "nwse-resize";
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", function (e) {
      if (!isResizing) return;
      var dx = startX - e.clientX;
      var dy = startY - e.clientY;
      var newWidth = Math.max(320, Math.min(startWidth + dx, window.innerWidth - 30));
      var newHeight = Math.max(380, Math.min(startHeight + dy, window.innerHeight - 100));
      panel.style.width = newWidth + "px";
      panel.style.height = newHeight + "px";
      panel.style.maxWidth = "none";
      panel.style.maxHeight = "none";
    });

    document.addEventListener("mouseup", function () {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    });

    panel.querySelectorAll(".ai-theme-dot").forEach(function (dot) {
      dot.addEventListener("click", function () {
        applyTheme(dot.dataset.theme);
      });
    });

    var select = panel.querySelector("#ai-provider");
    var saved = providerById(storageGet(STORAGE_KEY, "google-ai")).id;
    PROVIDERS.forEach(function (p) {
      var o = document.createElement("option"); o.value = p.id; o.textContent = p.name;
      if (p.id === saved) o.selected = true;
      select.appendChild(o);
    });

    function syncSubmitLabel() { panel.querySelector(".ai-panel-submit span").textContent = "Open in " + providerById(select.value).name; }
    select.addEventListener("change", function () { storageSet(STORAGE_KEY, select.value); syncSubmitLabel(); });
    syncSubmitLabel();

    var presetsEl = panel.querySelector(".ai-presets");
    PRESETS.forEach(function (p) {
      var btn = document.createElement("button"); btn.type = "button"; btn.textContent = p.label;
      btn.addEventListener("mousedown", function (e) { e.preventDefault(); }); // keep selection highlight
      btn.addEventListener("click", function () {
        var q = panel.querySelector("#ai-question"); q.value = p.question;
        updateCount(); setWidgetStatus("Prompt added. Edit it or open in AI."); q.focus();
      });
      presetsEl.appendChild(btn);
    });

    function updateCount() {
      var q = panel.querySelector("#ai-question");
      panel.querySelector(".ai-char-count").textContent = q.value.length + " / " + MAX_QUESTION;
    }
    panel.querySelector("#ai-question").addEventListener("input", updateCount);

    function setWidgetStatus(msg, type) {
      var s = panel.querySelector(".ai-status"); s.textContent = msg || ""; s.dataset.type = type || "";
    }

    function widgetPrompt() {
      var q = panel.querySelector("#ai-question").value.trim();
      var includeWhole = panel.querySelector("#ai-include-whole").checked;
      return buildPrompt({
        question: q,
        selectedText: widgetState.scope === "selection" ? capturedSelection : "",
        wholeContent: includeWhole ? wholePageContent() : "",
      });
    }

    function validateQ() {
      if (panel.querySelector("#ai-question").value.trim()) return true;
      setWidgetStatus("Write a question or choose a study prompt.", "error");
      panel.querySelector("#ai-question").focus(); return false;
    }

    function setScope(scope) {
      if (scope === "selection" && !capturedSelection) {
        setWidgetStatus("Select text in the page before using this.", "error"); return;
      }
      widgetState.scope = scope;
      panel.querySelectorAll(".ai-scope button").forEach(function (b) {
        b.classList.toggle("is-active", b.dataset.scope === scope);
      });
      panel.querySelector('[data-scope="selection"]').disabled = !capturedSelection;
      setWidgetStatus(scope === "selection" ? "Using your selected passage." : "Using the page link only.");
    }
    panel.querySelector(".ai-scope").addEventListener("click", function (e) {
      if (e.target.dataset.scope) setScope(e.target.dataset.scope);
    });
    panel.querySelectorAll(".ai-scope button").forEach(function (btn) {
      btn.addEventListener("mousedown", function (e) { e.preventDefault(); }); // keep selection highlight
    });

    function openPanel() {
      widgetState.lastFocus = document.activeElement;
      panel.querySelector('[data-scope="selection"]').disabled = !capturedSelection;
      panel.querySelector(".ai-panel-page-title").textContent = pageTitle();
      updateCount(); setScope(capturedSelection ? "selection" : "page");
      document.body.classList.add("ai-panel-open"); panel.setAttribute("aria-hidden", "false");
      panel.querySelector("#ai-question").focus();
    }
    function closePanel() {
      var wasOpen = document.body.classList.contains("ai-panel-open");
      document.body.classList.remove("ai-panel-open"); panel.setAttribute("aria-hidden", "true");
      setWidgetStatus("");
      if (wasOpen && widgetState.lastFocus && widgetState.lastFocus.isConnected) widgetState.lastFocus.focus();
      widgetState.lastFocus = null;
    }

    launcher.addEventListener("click", openPanel);
    panel.querySelector(".ai-panel-close").addEventListener("click", closePanel);

    var copyBtn = panel.querySelector(".ai-panel-copy");
    copyBtn.addEventListener("mousedown", function (e) { e.preventDefault(); });
    copyBtn.addEventListener("click", function () {
      if (!validateQ()) return;
      writeClipboard(widgetPrompt())
        .then(function () { setWidgetStatus("Study prompt copied.", "success"); })
        .catch(function () { setWidgetStatus("Clipboard access blocked.", "error"); });
    });

    var submitBtn = panel.querySelector(".ai-panel-submit");
    submitBtn.addEventListener("mousedown", function (e) { e.preventDefault(); });
    submitBtn.addEventListener("click", function () {
      if (!validateQ()) return;
      var prov = providerById(select.value), prompt = widgetPrompt();
      window.open(prov.url + encodeURIComponent(prompt), "_blank", "noopener,noreferrer");
      writeClipboard(prompt).catch(function () { });
      setWidgetStatus("Prompt copied. Opening " + prov.name + ".", "success");
    });

    document.addEventListener("keydown", function (e) {
      if (!document.body.classList.contains("ai-panel-open")) return;
      if (e.key === "Escape") closePanel();
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault(); panel.querySelector(".ai-panel-submit").click();
      }
    });

    return {
      syncContext: function () {
        closePanel(); panel.querySelector(".ai-panel-page-title").textContent = pageTitle();
        capturedSelection = ""; setScope("page");
        fetchRawMarkdown();
      }
    };
  }

  // ── Inline prompts construction ──────────────────────────────────────────
  var inlineCount = 0;
  var openInline = null;

  function nearestHeading(el) {
    var article = el.closest(".markdown-section") || el.closest(".content") || el.closest("article");
    var current = ""; if (!article) return current;
    article.querySelectorAll("h1,h2,h3").forEach(function (h) {
      if (h.compareDocumentPosition(el) & 4) current = clean(h.textContent);
    });
    return current;
  }

  function conceptContext(el) {
    var container = el.closest("p,li,blockquote,td");
    var parts = []; var candidate = container; var inspected = 0;
    while (candidate && parts.length < 2 && inspected < 5) {
      var clone = candidate.cloneNode(true);
      clone.querySelectorAll("askai,ask-ai").forEach(function (x) { x.remove(); });
      var t = clean(clone.textContent); if (t) parts.unshift(t);
      candidate = candidate.previousElementSibling; inspected++;
    }
    return clean([nearestHeading(el)].concat(parts).filter(Boolean).join(". "));
  }

  function closeInline(wrap, restoreFocus) {
    if (!wrap) return;
    var trigger = wrap.querySelector(".ai-inline-trigger"), menu = wrap.querySelector(".ai-inline-menu");
    menu.hidden = true; wrap.classList.remove("is-open", "align-end", "open-up");
    trigger.setAttribute("aria-expanded", "false");
    if (restoreFocus) trigger.focus();
    if (openInline === wrap) openInline = null;
  }

  function alignInline(wrap) {
    var menu = wrap.querySelector(".ai-inline-menu"), r = menu.getBoundingClientRect();
    wrap.classList.toggle("align-end", r.right > innerWidth - 16);
    wrap.classList.toggle("open-up", r.bottom > innerHeight - 16);
  }

  function openInlineMenu(wrap) {
    if (openInline && openInline !== wrap) closeInline(openInline, false);
    var trigger = wrap.querySelector(".ai-inline-trigger"), menu = wrap.querySelector(".ai-inline-menu");
    menu.hidden = false; wrap.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true"); openInline = wrap; alignInline(wrap);
  }

  function createInlinePrompt(el) {
    var question = el.getAttribute("question") || clean(el.textContent);
    var label = el.getAttribute("label") || clean(el.textContent);
    var id = "ai-inline-menu-" + (++inlineCount);
    var wrap = document.createElement("span");
    var parent = el.parentElement;
    var standalone = parent && parent.tagName === "P" && clean(parent.textContent) === clean(el.textContent);

    wrap.className = "ai-inline-wrap";
    if (standalone) wrap.classList.add("is-standalone");
    wrap.dataset.question = question; wrap.dataset.context = conceptContext(el);

    wrap.innerHTML =
      '<button type="button" class="ai-inline-trigger" aria-expanded="false" aria-controls="' + id + '">' +
      svg("sparkle") + '<span></span><svg class="ai-inline-chevron" viewBox="0 0 24 24" aria-hidden="true">' + ICONS.chevron + '</svg>' +
      '</button>' +
      '<span class="ai-inline-menu" id="' + id + '" role="group" aria-label="Ask AI" hidden>' +
      '<button type="button" class="ai-inline-item ai-inline-copy-btn">' +
      '<span>Copy prompt</span>' + svg("copy") +
      '</button>' +
      '<div class="ai-inline-divider"></div>' +
      PROVIDERS.map(function (p) {
        return '<button type="button" class="ai-inline-item" data-provider="' + p.id + '">' +
          '<span>Open in ' + p.name + '</span>' + svg("external") +
          '</button>';
      }).join("") +
      '<div class="ai-inline-status" role="status"></div>' +
      '</span>';

    wrap.querySelector(".ai-inline-trigger > span").textContent = label || "Ask AI";

    function inlinePrompt() { return buildPrompt({ question: wrap.dataset.question, sectionContext: wrap.dataset.context }); }
    function setStatus(msg, type) {
      var s = wrap.querySelector(".ai-inline-status"); s.textContent = msg; s.dataset.type = type || "";
      setTimeout(function () { s.textContent = ""; }, 1800);
    }

    wrap.querySelector(".ai-inline-trigger").addEventListener("click", function () {
      wrap.classList.contains("is-open") ? closeInline(wrap, false) : openInlineMenu(wrap);
    });
    wrap.querySelector(".ai-inline-copy-btn").addEventListener("click", function () {
      writeClipboard(inlinePrompt())
        .then(function () { setStatus("Copied!", "success"); })
        .catch(function () { setStatus("Blocked", "error"); });
    });
    wrap.querySelectorAll(".ai-inline-item[data-provider]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var prov = providerById(btn.dataset.provider), prompt = inlinePrompt();
        window.open(prov.url + encodeURIComponent(prompt), "_blank", "noopener,noreferrer");
        writeClipboard(prompt).catch(function () { });
        setStatus("Opening...", "success");
      });
    });

    return wrap;
  }

  function createPresetGroup() {
    var wrap = document.createElement("span");
    wrap.style.cssText = "display:inline-flex;flex-wrap:wrap;gap:6px;vertical-align:middle";
    var url = rawUrl();
    PRESETS.forEach(function (p) {
      var fakeEl = document.createElement("span"); fakeEl.textContent = p.label;
      fakeEl.setAttribute("question", p.question + "\n\nPage: " + url);
      fakeEl.setAttribute("label", p.label);
      wrap.appendChild(createInlinePrompt(fakeEl));
    });
    return wrap;
  }

  document.addEventListener("click", function (e) { if (openInline && !openInline.contains(e.target)) closeInline(openInline, false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && openInline) closeInline(openInline, true); });
  window.addEventListener("resize", function () { if (openInline) alignInline(openInline); });

  // ── Initialization Loader ────────────────────────────────────────────────
  var widget;

  function plugin(hook) {
    hook.beforeEach(function (markdown) {
      rawMarkdownContent = markdown;
      return markdown;
    });

    hook.ready(function () {
      if (!document.getElementById("ai-css")) {
        var s = document.createElement("style"); s.id = "ai-css"; s.textContent = CSS; document.head.appendChild(s);
      }
      widget = createWidget();
      applyTheme(storageGet(THEME_STORAGE_KEY, "purple"));
    });

    hook.afterEach(function (html) {
      return html.replace(/<askai\b([^>]*)(?:\s*\/?>|>\s*<\/askai>)/gi, function (m, attrs) { return '<span class="ai-ph" ' + attrs + '></span>'; });
    });

    hook.doneEach(function () {
      if (widget) widget.syncContext();
      closeInline(openInline, false); inlineCount = 0;
      var c = document.querySelector(".markdown-section") || document.querySelector(".content") || document.querySelector("article");
      if (!c) return;
      c.querySelectorAll(".ai-ph").forEach(function (el) {
        if (el.hasAttribute("preset")) { el.replaceWith(createPresetGroup()); }
        else { el.replaceWith(createInlinePrompt(el)); }
      });
    });
  }

  function initStandalone() {
    if (!document.getElementById("ai-css")) {
      var s = document.createElement("style"); s.id = "ai-css"; s.textContent = CSS; document.head.appendChild(s);
    }
    widget = createWidget();
    applyTheme(storageGet(THEME_STORAGE_KEY, "purple"));
    fetchRawMarkdown();

    var c = document.querySelector(".markdown-section") || document.querySelector(".content") || document.querySelector("article") || document.body;
    if (!c) return;

    c.querySelectorAll("askai, ask-ai").forEach(function (el) {
      var newEl = el.hasAttribute("preset") ? createPresetGroup() : createInlinePrompt(el);

      // Move all children to be siblings after newEl to prevent browser unclosed auto-nesting cutoff issues
      if (el.hasAttribute("preset")) {
        var fragment = document.createDocumentFragment();
        while (el.firstChild) { fragment.appendChild(el.firstChild); }
        el.replaceWith(newEl);
        newEl.parentNode.insertBefore(fragment, newEl.nextSibling);
      } else {
        var fragment = document.createDocumentFragment();
        var first = el.firstChild;
        if (first && first.nodeType === 3) {
          while (el.childNodes.length > 1) { fragment.appendChild(el.childNodes[1]); }
        } else {
          while (el.firstChild) { fragment.appendChild(el.firstChild); }
        }
        el.replaceWith(newEl);
        if (fragment.childNodes.length > 0) {
          newEl.parentNode.insertBefore(fragment, newEl.nextSibling);
        }
      }
    });
  }

  if (window.$docsify && Object.keys(window.$docsify).length > 0) {
    window.$docsify.plugins = [plugin].concat(window.$docsify.plugins || []);
  } else {
    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", initStandalone); }
    else { initStandalone(); }
  }
})();
