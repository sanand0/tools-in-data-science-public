(function () {
  const CSS = `.ai-wrap{position:relative;display:inline-block;margin:0 2px}.ai-inline{background:transparent;border:none;padding:0;color:var(--theme-color,#8b5cf6);text-decoration:underline;cursor:pointer;font:inherit;display:inline}.ai-menu{position:absolute;z-index:99999;top:100%;left:0;display:none;background:var(--base-background,#fff);border:1px solid var(--sidebar-border-color,var(--mono-200,#e2e8f0));border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.15);padding:4px;flex-direction:column;min-width:140px}.ai-menu.open{display:flex}.ai-menu button{background:transparent;border:none;padding:6px 12px;font-size:12px;text-align:left;cursor:pointer;color:var(--base-color,#0f172a);border-radius:4px;display:flex;align-items:center}.ai-menu button:hover{background:var(--sidebar-background,var(--mono-100,#f1f5f9))}`;
  const PROVIDERS = [{ name: "Google AI", url: "https://www.google.com/search?udm=50&q=" }, { name: "ChatGPT", url: "https://chatgpt.com/?q=" }, { name: "Claude", url: "https://claude.ai/new?q=" }, { name: "Gemini", url: "https://gemini.google.com/app?q=" }, { name: "Perplexity", url: "https://www.perplexity.ai/?q=" }];
  const buildPrompt = (q, p = (window.$docsify ? location.hash.replace(/^#\/?/, "") : location.pathname).split(/[?#]/)[0].replace(/^\/|\/$/g, "") || "README") =>
    `<student-query>${q}</student-query>\n\n<context>\n- URL: ${location.href}\n- Raw URL: https://raw.githubusercontent.com/sanand0/tools-in-data-science-public/main/${p.endsWith(".md") ? p : p + ".md"}\n</context>\n\n<instructions>\nPlease explain clearly in a student-friendly tone.</instructions>`;
  const handleInline = (el) => {
    let q = el.getAttribute("question") || el.textContent, l = el.getAttribute("label") || el.textContent;
    let wrap = document.createElement("span"); wrap.className = "ai-wrap";
    wrap.innerHTML = `<button class="ai-inline">${l}</button><div class="ai-menu"><button class="ai-copy">📋 Copy prompt</button>${PROVIDERS.map((p, i) => `<button data-i="${i}">↗️ ${p.name}</button>`).join("")}</div>`;
    let menu = wrap.querySelector(".ai-menu");
    wrap.querySelector(".ai-inline").onclick = (e) => {
      e.stopPropagation(); document.querySelectorAll(".ai-menu").forEach(m => m !== menu && m.classList.remove("open"));
      menu.classList.toggle("open");
    };
    menu.onclick = (e) => {
      let b = e.target.closest("button"); if (!b) return;
      b.classList.contains("ai-copy") ? navigator.clipboard.writeText(buildPrompt(q)).then(() => { b.textContent = "✅ Copied!"; setTimeout(() => b.textContent = "📋 Copy prompt", 1500); })
        : window.open(PROVIDERS[b.dataset.i].url + encodeURIComponent(buildPrompt(q)), "_blank", "noopener,noreferrer");
    };
    el.replaceWith(wrap);
  };
  const init = () => {
    if (!document.getElementById("ai-css")) document.head.appendChild(Object.assign(document.createElement("style"), { id: "ai-css", textContent: CSS }));
    document.querySelectorAll("askai, ask-ai, .ai-ph").forEach(handleInline);
  };
  document.addEventListener("click", () => document.querySelectorAll(".ai-menu").forEach(m => m.classList.remove("open")));
  if (window.$docsify) {
    window.$docsify.plugins = [
      (hook) => {
        hook.afterEach(html => html.replace(/<askai\b([^>]*?)(?:>(.*?)<\/askai>|\s*\/>)/gi, (m, a, c) => `<span class="ai-ph" ${a}>${c || ""}</span>`));
        hook.doneEach(init);
      }
    ].concat(window.$docsify.plugins || []);
  } else {
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
  }
})();
