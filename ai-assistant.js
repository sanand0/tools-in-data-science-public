/**
 * ai-assistant.js — Docsify AI Assistant Plugin (single <askai> tag)
 *
 * Attributes:
 *   questions='[{"prompt":"...","label":"..."}]'  — buttons: label shown, prompt sent/copied
 *   common_question="true|false"                  — include built-in question buttons
 *   showopenin="true|false"                       — true: full toolbar bar with presets + dropdown
 *                                                   false (default): bare buttons, click → provider popup
 */
(function () {
  "use strict";

  var BRANCH = "askai";
  var RAW_BASE = "https://raw.githubusercontent.com/sanand0/tools-in-data-science-public/" + BRANCH;

  var PROVIDERS = [
    {
      id: "google-ai-mode",
      name: "Google AI Mode",
      icon: "\u{1F50D}\u2728",
      url: function (p) {
        return "https://www.google.com/search?q=" + encodeURIComponent(p);
      }
    },
    {
      id: "gemini",
      name: "Gemini",
      icon: "\u2728",
      url: function (p) {
        return "https://gemini.google.com/app?q=" + encodeURIComponent(p);
      }
    },
    {
      id: "chatgpt",
      name: "ChatGPT",
      icon: "\u{1F916}",
      url: function (p) {
        return "https://chatgpt.com/?q=" + encodeURIComponent(p);
      }
    },
    {
      id: "claude",
      name: "Claude",
      icon: "\u2726",
      url: function (p) {
        return "https://claude.ai/new?q=" + encodeURIComponent(p);
      }
    },
    {
      id: "perplexity",
      name: "Perplexity",
      icon: "\u{1F50D}",
      url: function (p) {
        return "https://www.perplexity.ai/?q=" + encodeURIComponent(p);
      }
    }
  ];

  var PRESETS = [
    {
      label: "Explain like I am a beginner",
      icon: "\u{1F476}",
      prompt: function (u) {
        return "Explain this page simply for a beginner.\n\nPage: " + u;
      }
    },
    {
      label: "Teach me with step-by-step examples/use cases",
      icon: "\u{1F4D6}",
      prompt: function (u) {
        return "Teach me this page with step-by-step examples/use cases.\n\nPage: " + u;
      }
    },
    {
      label: "MCQ Practice",
      icon: "\u{1F4DD}",
      prompt: function (u) {
        return "Generate 10 MCQs with answers for this page.\n\nPage: " + u;
      }
    },
    {
      label: "Generate a summary and cheat sheet",
      icon: "\u{1F4CB}",
      prompt: function (u) {
        return "Generate a summary and cheat sheet for this page.\n\nPage: " + u;
      }
    }
  ];

  var COMMON_QS = [
    { label: "Explain step by step", prompt: "Explain this topic step by step with examples" },
    { label: "Common mistakes", prompt: "What are the most common mistakes beginners make with this?" },
    { label: "Practice exercises", prompt: "Give me 5 practice exercises for this topic" },
    { label: "Real-world relevance", prompt: "How does this relate to real-world data science workflows?" },
    { label: "Quiz me", prompt: "Quiz me on this topic with 5 questions and answers" }
  ];

  // ── CSS ───────────────────────────────────────────────────────────────────
  var CSS = [
    /* Toolbar mode (showopenin=true) */
    ".ai-bar {",
    "  display: flex;",
    "  align-items: center;",
    "  flex-wrap: wrap;",
    "  gap: 7px;",
    "  padding: 9px 14px;",
    "  margin: 1rem 0 1.2rem;",
    "  background: linear-gradient(135deg, color-mix(in srgb, var(--theme-color,#dc3545) 8%, transparent), color-mix(in srgb, var(--theme-color,#dc3545) 3%, transparent));",
    "  border: 1px solid color-mix(in srgb, var(--theme-color,#dc3545) 20%, transparent);",
    "  border-radius: 12px;",
    "  font-size: 13px;",
    "}",
    ".ai-bar-label {",
    "  font-weight: 700;",
    "  font-size: 10.5px;",
    "  letter-spacing: .07em;",
    "  text-transform: uppercase;",
    "  color: var(--theme-color,#dc3545);",
    "  opacity: .8;",
    "  margin-right: 3px;",
    "}",
    ".ai-bar-sep {",
    "  width: 1px;",
    "  height: 20px;",
    "  background: color-mix(in srgb, var(--theme-color,#dc3545) 22%, transparent);",
    "  margin: 0 2px;",
    "  flex-shrink: 0;",
    "}",
    ".ai-bar-prov {",
    "  display: inline-flex;",
    "  align-items: center;",
    "  gap: 5px;",
    "  margin-left: auto;",
    "}",
    ".ai-bar-prov span {",
    "  font-size: 11px;",
    "  opacity: .6;",
    "}",
    ".ai-sel {",
    "  appearance: none;",
    "  -webkit-appearance: none;",
    "  padding: 3px 22px 3px 9px;",
    "  border: 1px solid color-mix(in srgb, var(--theme-color,#dc3545) 30%, transparent);",
    "  border-radius: 8px;",
    "  background: color-mix(in srgb, var(--theme-color,#dc3545) 5%, transparent) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\") no-repeat right 7px center;",
    "  font-size: 12.5px;",
    "  font-family: inherit;",
    "  cursor: pointer;",
    "  color: var(--base-color, inherit);",
    "  min-width: 108px;",
    "}",
    ".ai-sel:focus {",
    "  outline: none;",
    "  border-color: var(--theme-color,#dc3545);",
    "}",
    ".ai-chips {",
    "  width: 100%;",
    "  display: flex;",
    "  flex-wrap: wrap;",
    "  gap: 5px;",
    "  padding-top: 6px;",
    "  border-top: 1px solid color-mix(in srgb, var(--theme-color,#dc3545) 12%, transparent);",
    "  margin-top: 3px;",
    "}",
    /* Shared pill button (used in both modes) */
    ".ai-pill {",
    "  display: inline-flex;",
    "  align-items: center;",
    "  gap: 4px;",
    "  padding: 4px 12px;",
    "  border: 1px solid color-mix(in srgb, var(--theme-color,#dc3545) 28%, transparent);",
    "  border-radius: 20px;",
    "  background: color-mix(in srgb, var(--theme-color,#dc3545) 6%, transparent);",
    "  color: var(--base-color, inherit);",
    "  font-size: 12.5px;",
    "  font-family: inherit;",
    "  cursor: pointer;",
    "  white-space: nowrap;",
    "  transition: background .15s, border-color .15s, transform .1s;",
    "}",
    ".ai-pill:hover {",
    "  background: color-mix(in srgb, var(--theme-color,#dc3545) 15%, transparent);",
    "  border-color: var(--theme-color,#dc3545);",
    "  transform: translateY(-1px);",
    "}",
    /* Bare buttons mode (showopenin=false) — no outer box */
    ".ai-bare {",
    "  display: inline-flex;",
    "  flex-wrap: wrap;",
    "  gap: 5px;",
    "  vertical-align: middle;",
    "}",
    /* Provider popup (for bare-button mode) */
    ".ai-popup-overlay {",
    "  position: fixed;",
    "  top: 0;",
    "  left: 0;",
    "  width: 100%;",
    "  height: 100%;",
    "  z-index: 99998;",
    "  background: transparent;",
    "}",
    ".ai-popup {",
    "  position: fixed;",
    "  z-index: 99999;",
    "  background: var(--sidebar-background, var(--base-background-color, #fff));",
    "  border: 1px solid color-mix(in srgb, var(--theme-color,#dc3545) 22%, transparent);",
    "  border-radius: 10px;",
    "  box-shadow: 0 8px 32px rgba(0, 0, 0, .16);",
    "  padding: 6px;",
    "  min-width: 160px;",
    "}",
    ".ai-popup-title {",
    "  font-size: 11px;",
    "  font-weight: 600;",
    "  opacity: .55;",
    "  padding: 4px 10px 5px;",
    "  text-transform: uppercase;",
    "  letter-spacing: .05em;",
    "}",
    ".ai-popup-item {",
    "  display: flex;",
    "  align-items: center;",
    "  gap: 8px;",
    "  padding: 7px 12px;",
    "  border: none;",
    "  background: none;",
    "  width: 100%;",
    "  font-size: 13px;",
    "  font-family: inherit;",
    "  cursor: pointer;",
    "  border-radius: 7px;",
    "  color: var(--base-color, inherit);",
    "  transition: background .12s;",
    "}",
    ".ai-popup-item:hover {",
    "  background: color-mix(in srgb, var(--theme-color,#dc3545) 10%, transparent);",
    "}"
  ].join("\n");

  // ── Helpers ────────────────────────────────────────────────────────────────
  function injectCSS() {
    if (!document.getElementById("ai-css")) {
      var s = document.createElement("style");
      s.id = "ai-css";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }

  function rawUrl() {
    var h = (window.location.hash || "#/").replace(/^#\/?/, "").split("?")[0].split("#")[0];
    if (!h || h === "/") {
      h = "README";
    }
    h = h.replace(/\/$/, "");
    if (!h.endsWith(".md")) {
      h += ".md";
    }
    return RAW_BASE + "/" + h;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () { });
    } else {
      var t = document.createElement("textarea");
      t.value = text;
      t.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand("copy");
      } catch (e) { }
      document.body.removeChild(t);
    }
  }

  function openAI(promptText, providerId) {
    copyText(promptText);
    var prov = PROVIDERS.find(function (p) {
      return p.id === providerId;
    }) || PROVIDERS[0];
    window.open(prov.url(promptText), "_blank", "noopener");
  }

  /** Walk DOM backwards from el to find the nearest preceding heading text */
  function findNearestHeading(el) {
    var node = el;
    while (node) {
      var prev = node.previousElementSibling;
      while (prev) {
        if (/^H[1-6]$/.test(prev.tagName)) {
          return prev.textContent.trim();
        }
        var hs = prev.querySelectorAll("h1,h2,h3,h4,h5,h6");
        if (hs.length) {
          return hs[hs.length - 1].textContent.trim();
        }
        prev = prev.previousElementSibling;
      }
      node = node.parentElement;
    }
    return "";
  }

  function showProviderPopup(promptText, anchorEl) {
    // Remove any existing popup
    closePopup();
    var rect = anchorEl.getBoundingClientRect();

    var overlay = document.createElement("div");
    overlay.className = "ai-popup-overlay";
    overlay.addEventListener("click", closePopup);

    var popup = document.createElement("div");
    popup.className = "ai-popup";
    popup.style.top = (rect.bottom + 6) + "px";
    popup.style.left = rect.left + "px";

    var title = document.createElement("div");
    title.className = "ai-popup-title";
    title.textContent = "Open in\u2026";
    popup.appendChild(title);

    PROVIDERS.forEach(function (prov) {
      var btn = document.createElement("button");
      btn.className = "ai-popup-item";
      btn.textContent = prov.icon + "  " + prov.name;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        closePopup();
        openAI(promptText, prov.id);
      });
      popup.appendChild(btn);
    });

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    // Adjust if popup goes off screen
    requestAnimationFrame(function () {
      var pr = popup.getBoundingClientRect();
      if (pr.right > window.innerWidth - 12) {
        popup.style.left = (window.innerWidth - pr.width - 12) + "px";
      }
      if (pr.bottom > window.innerHeight - 12) {
        popup.style.top = (rect.top - pr.height - 6) + "px";
      }
    });
  }

  function closePopup() {
    document.querySelectorAll(".ai-popup-overlay,.ai-popup").forEach(function (el) {
      el.remove();
    });
  }

  function parseQuestions(el) {
    var str = el.getAttribute("questions") || "";
    var qs = [];
    if (str) {
      try {
        qs = JSON.parse(str);
      } catch (e) {
        try {
          qs = JSON.parse(str.replace(/'/g, '"'));
        } catch (e2) {
          console.error("[askai] bad questions:", e2);
        }
      }
    }
    return qs;
  }

  // ── Build: showopenin=true (toolbar bar) ──────────────────────────────────
  function buildToolbar(el) {
    var url = rawUrl();
    var showCommon = el.getAttribute("common_question") === "true";
    var customQs = parseQuestions(el);
    var allQs = (showCommon ? COMMON_QS : []).concat(customQs);
    var saved = sessionStorage.getItem("ai-prov") || PROVIDERS[0].id;

    var bar = document.createElement("div");
    bar.className = "ai-bar";

    // Label
    var lbl = document.createElement("span");
    lbl.className = "ai-bar-label";
    lbl.textContent = "Ask AI";
    bar.appendChild(lbl);

    // Presets
    PRESETS.forEach(function (p) {
      var btn = document.createElement("button");
      btn.className = "ai-pill";
      btn.title = p.label;
      btn.textContent = p.icon + " " + p.label;
      btn.addEventListener("click", function () {
        var s = bar.querySelector(".ai-sel");
        openAI(p.prompt(url), s ? s.value : saved);
      });
      bar.appendChild(btn);
    });

    // Sep + dropdown
    var sep = document.createElement("span");
    sep.className = "ai-bar-sep";
    bar.appendChild(sep);

    var pw = document.createElement("span");
    pw.className = "ai-bar-prov";

    var sl = document.createElement("span");
    sl.textContent = "Open in:";
    pw.appendChild(sl);

    var sel = document.createElement("select");
    sel.className = "ai-sel";
    PROVIDERS.forEach(function (p) {
      var o = document.createElement("option");
      o.value = p.id;
      o.textContent = p.icon + " " + p.name;
      if (p.id === saved) {
        o.selected = true;
      }
      sel.appendChild(o);
    });
    sel.addEventListener("change", function () {
      sessionStorage.setItem("ai-prov", sel.value);
    });
    pw.appendChild(sel);
    bar.appendChild(pw);

    // Extra question chips
    if (allQs.length) {
      var chips = document.createElement("div");
      chips.className = "ai-chips";
      allQs.forEach(function (q) {
        var btn = document.createElement("button");
        btn.className = "ai-pill";
        btn.textContent = q.label || q.prompt;
        btn.title = q.prompt;
        btn.addEventListener("click", function () {
          var s = bar.querySelector(".ai-sel");
          openAI(q.prompt + "\n\nContext: " + url, s ? s.value : saved);
        });
        chips.appendChild(btn);
      });
      bar.appendChild(chips);
    }

    return bar;
  }

  // ── Build: showopenin=false (bare buttons + popup) ────────────────────────
  function buildBare(el) {
    var url = rawUrl();
    var showCommon = el.getAttribute("common_question") === "true";
    var customQs = parseQuestions(el);
    var allQs = (showCommon ? COMMON_QS : []).concat(customQs);

    var wrap = document.createElement("span");
    wrap.className = "ai-bare";

    allQs.forEach(function (q) {
      var btn = document.createElement("button");
      btn.className = "ai-pill";
      btn.textContent = q.label || q.prompt;
      btn.title = q.prompt;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var section = findNearestHeading(wrap);
        var ctx = "\n\n<Context>\nThe context is:\nSection: `" + (section || "(page top)") + "`\nMain Doc URL: `" + url + "`\n\n Note: User is asking from the main doc. So before answering fetch main doc & understand.\n</Context>";
        showProviderPopup(q.prompt + ctx, btn);
      });
      wrap.appendChild(btn);
    });
    return wrap;
  }

  // ── Docsify Plugin ────────────────────────────────────────────────────────
  function plugin(hook) {
    hook.ready(function () {
      injectCSS();
    });

    hook.afterEach(function (html) {
      return html.replace(/<askai\b([^>]*)(?:\s*\/>|>\s*<\/askai>)/gi, function (_, attrs) {
        return '<span class="ai-placeholder" ' + attrs + '></span>';
      });
    });

    hook.doneEach(function () {
      var c = document.querySelector(".content") || document.querySelector("article") || document.querySelector("main");
      if (!c) {
        return;
      }
      c.querySelectorAll(".ai-placeholder").forEach(function (el) {
        var show = el.getAttribute("showopenin") === "true";
        el.replaceWith(show ? buildToolbar(el) : buildBare(el));
      });
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [plugin].concat(window.$docsify.plugins || []);
})();
