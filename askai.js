(function () {
  const CSS = `:root{--ai-p:var(--theme-color,#8b5cf6);--ai-ph:color-mix(in srgb,var(--ai-p) 80%,#000);--ai-bg:#fff;--ai-c:#f1f5f9;--ai-txt:#0f172a;--ai-m:#64748b;--ai-b:#e2e8f0;--ai-sh:0 10px 30px rgba(0,0,0,0.1)}@media(prefers-color-scheme:dark){:root{--ai-bg:#0f172a;--ai-c:#1e293b;--ai-txt:#f1f5f9;--ai-b:rgba(255,255,255,0.1);--ai-sh:0 10px 30px rgba(0,0,0,0.5)}}.ai-l{position:fixed;z-index:99;right:20px;bottom:20px;display:flex;align-items:center;gap:8px;padding:10px 16px;border:none;border-radius:24px;color:#fff;background:var(--ai-p);box-shadow:var(--ai-sh);cursor:pointer;font-weight:700}.ai-l:hover{background:var(--ai-ph)}.ai-p{position:fixed;z-index:100;right:20px;bottom:75px;display:none;width:340px;height:480px;flex-direction:column;border:1px solid var(--ai-b);border-radius:12px;background:var(--ai-bg);box-shadow:var(--ai-sh);font-family:system-ui,sans-serif;color:var(--ai-txt)}.ai-p.open{display:flex}.ai-h{display:flex;align-items:center;justify-content:space-between;padding:12px;border-bottom:1px solid var(--ai-b);background:var(--ai-c)}.ai-h h3{margin:0;font-size:16px}.ai-close{border:none;background:transparent;color:var(--ai-m);cursor:pointer;font-size:18px}.ai-body{flex:1;padding:12px;overflow-y:auto;display:flex;flex-direction:column;gap:10px}.ai-scope{display:flex;gap:4px;padding:4px;border-radius:6px;background:var(--ai-c)}.ai-scope button{flex:1;border:none;background:transparent;padding:6px;font-size:12px;cursor:pointer;border-radius:4px;color:var(--ai-m)}.ai-scope button.active{background:var(--ai-bg);color:var(--ai-txt);font-weight:700}.ai-presets{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px}.ai-presets button{flex:none;border:1px solid var(--ai-b);background:var(--ai-c);padding:4px 8px;border-radius:12px;font-size:11px;cursor:pointer;color:var(--ai-txt)}.ai-body textarea{width:100%;height:100px;padding:8px;border:1px solid var(--ai-b);border-radius:6px;background:var(--ai-bg);color:var(--ai-txt);resize:none;box-sizing:border-box}.ai-provider{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px}.ai-provider select{flex:1;padding:4px;border:1px solid var(--ai-b);border-radius:4px;background:var(--ai-c);color:var(--ai-txt)}.ai-actions{display:flex;gap:8px}.ai-actions button{flex:1;padding:8px;border-radius:6px;border:none;cursor:pointer;font-weight:700;font-size:12px}.ai-btn-copy{background:var(--ai-c);color:var(--ai-txt)}.ai-btn-sub{background:var(--ai-p);color:#fff}.ai-status{font-size:11px;color:var(--ai-p);min-height:15px;text-align:center}.ai-inline{display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border:1px solid var(--ai-b);border-radius:12px;background:var(--ai-c);color:var(--ai-p);font-size:12px;cursor:pointer;margin:0 4px;font-weight:600}.ai-inline:hover{background:var(--ai-b)}`;
  const PROVIDERS = [
    { id: "google-ai", name: "Google AI", url: "https://www.google.com/search?udm=50&q=" },
    { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/?q=" },
    { id: "claude", name: "Claude", url: "https://claude.ai/new?q=" },
    { id: "gemini", name: "Gemini", url: "https://gemini.google.com/app?q=" },
    { id: "perplexity", name: "Perplexity", url: "https://www.perplexity.ai/?q=" }
  ];
  const PRESETS = [
    { label: "Explain simply", question: "Explain this topic clearly with a helpful example. Keep it brief and beginner-friendly." },
    { label: "Quiz me", question: "Give me 15 multiple-choice questions (MCQs) with answers on this topic, including interview-style questions." },
    { label: "CheatSheet", question: "Give me a concise cheat sheet for this topic." },
    { label: "Review notes", question: "Turn this into concise revision notes and three recall questions." }
  ];
  let curSel = "", curScope = "page", panel, textarea, select, status, btnSel, btnPage;
  const getSel = () => window.getSelection().toString().trim().slice(0, 2600);
  document.addEventListener("mouseup", () => curSel = getSel() || curSel);
  const getRawUrl = () => {
    let p = window.$docsify ? (location.hash || "#/").replace(/^#\/?/, "").split("?")[0].split("#")[0] : location.pathname.replace(/^\/|\/$/g, "");
    if (!p || p === "/") p = "README";
    return `https://raw.githubusercontent.com/sanand0/tools-in-data-science-public/main/${p.endsWith(".md") ? p : p + ".md"}`;
  };
  const buildPrompt = (q, sel) => `<student-query>${q}</student-query>\n\n<context>\n- URL: ${location.href}\n- Raw URL: ${getRawUrl()}${sel ? `\n- Selected Passage: ${sel}` : ""}\n</context>\n\n<instructions>\nPlease explain clearly in a student-friendly tone, using your own reasoning and broader knowledge.</instructions>`;
  const copyText = (txt) => navigator.clipboard ? navigator.clipboard.writeText(txt) : new Promise((res, rej) => {
    let t = document.createElement("textarea"); t.value = txt; t.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(t); t.focus(); t.select(); document.execCommand("copy") ? res() : rej(); t.remove();
  });
  const showMsg = (msg, err) => {
    status.textContent = msg; status.style.color = err ? "red" : "var(--ai-p)";
    setTimeout(() => status.textContent = "", 2000);
  };
  const setScope = (s) => {
    curScope = s;
    btnPage && btnPage.classList.toggle("active", s === "page");
    btnSel && btnSel.classList.toggle("active", s === "selection");
  };
  const onOpen = () => {
    panel.classList.add("open"); curSel = getSel() || curSel; btnSel.disabled = !curSel;
    setScope(curSel ? "selection" : "page"); textarea.focus();
  };
  const sync = () => { panel && panel.classList.remove("open"); curSel = ""; setScope("page"); };
  const createUI = () => {
    if (document.querySelector(".ai-l")) return;
    const style = document.createElement("style"); style.textContent = CSS; document.head.appendChild(style);
    const launcher = document.createElement("button"); launcher.className = "ai-l"; launcher.innerHTML = "✨ Ask AI";
    launcher.onclick = onOpen;
    panel = document.createElement("div"); panel.className = "ai-p";
    panel.innerHTML = `
      <div class="ai-h"><h3>✨ Ask AI</h3><button class="ai-close">×</button></div>
      <div class="ai-body">
        <div class="ai-scope"><button class="active" data-scope="page">Page</button><button data-scope="selection">Selection</button></div>
        <div class="ai-presets"></div><textarea placeholder="Ask a question..."></textarea><div class="ai-status"></div>
        <div class="ai-provider"><label>Open with</label><select></select></div>
        <div class="ai-actions"><button class="ai-btn-copy">Copy</button><button class="ai-btn-sub">Open</button></div>
      </div>`;
    document.body.appendChild(launcher); document.body.appendChild(panel);
    textarea = panel.querySelector("textarea"); select = panel.querySelector("select"); status = panel.querySelector(".ai-status");
    btnPage = panel.querySelector('[data-scope="page"]'); btnSel = panel.querySelector('[data-scope="selection"]');
    PROVIDERS.forEach(p => select.add(new Option(p.name, p.id)));
    select.value = localStorage.getItem("tds-ai-prov") || PROVIDERS[0].id;
    select.onchange = () => localStorage.setItem("tds-ai-prov", select.value);
    const presetsDiv = panel.querySelector(".ai-presets");
    PRESETS.forEach(p => {
      const b = document.createElement("button"); b.textContent = p.label;
      b.onclick = () => { textarea.value = p.question; showMsg("Preset added"); };
      presetsDiv.appendChild(b);
    });
    panel.querySelector(".ai-close").onclick = () => panel.classList.remove("open");
    btnPage.onclick = () => setScope("page");
    btnSel.onclick = () => curSel ? setScope("selection") : showMsg("No text selected", true);
    const getActivePrompt = () => {
      let q = textarea.value.trim(); if (!q) { showMsg("Please enter a question", true); return null; }
      return buildPrompt(q, curScope === "selection" ? curSel : "");
    };
    panel.querySelector(".ai-btn-copy").onclick = () => {
      let p = getActivePrompt(); if (p) copyText(p).then(() => showMsg("Copied!")).catch(() => showMsg("Copy failed", true));
    };
    panel.querySelector(".ai-btn-sub").onclick = () => {
      let p = getActivePrompt(); if (p) {
        let prov = PROVIDERS.find(x => x.id === select.value) || PROVIDERS[0];
        window.open(prov.url + encodeURIComponent(p), "_blank", "noopener,noreferrer");
        copyText(p).catch(() => {}); showMsg("Opening...");
      }
    };
  };
  const handleInline = (el) => {
    if (el.hasAttribute("preset")) {
      let span = document.createElement("span"); span.style.cssText = "display:inline-flex;flex-wrap:wrap;gap:6px;vertical-align:middle";
      PRESETS.forEach(p => {
        let b = document.createElement("button"); b.className = "ai-inline"; b.innerHTML = `✨ ${p.label}`;
        b.onclick = () => { createUI(); textarea.value = p.question; onOpen(); setScope("page"); };
        span.appendChild(b);
      });
      el.replaceWith(span);
    } else {
      let q = el.getAttribute("question") || el.textContent, l = el.getAttribute("label") || el.textContent;
      let btn = document.createElement("button"); btn.className = "ai-inline"; btn.innerHTML = `✨ ${l}`;
      btn.onclick = () => { createUI(); textarea.value = q; onOpen(); setScope("page"); };
      el.replaceWith(btn);
    }
  };
  const init = () => { createUI(); document.querySelectorAll("askai, ask-ai").forEach(handleInline); };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel) panel.classList.remove("open");
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && panel && panel.classList.contains("open")) panel.querySelector(".ai-btn-sub").click();
  });
  if (window.$docsify) {
    window.$docsify.plugins = [
      (hook) => {
        hook.afterEach(html => html.replace(/<askai\b([^>]*)(?:\s*\/?>|>\s*<\/askai>)/gi, (m, a) => `<span class="ai-ph" ${a}></span>`));
        hook.doneEach(() => { init(); sync(); document.querySelectorAll(".ai-ph").forEach(handleInline); });
      }
    ].concat(window.$docsify.plugins || []);
  } else {
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
  }
})();
