(function () {
  const LIVE_SESSION_SOURCE = { github: "https://github.com/hrmiitm/tds-may-26-live-session", branch: "main" };
  const LIVE_SESSION_FILTER = { folders: [/.*/], extensions: ["md", "markdown", "txt", "pdf", "html", "htm"] };
  const q = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const repo = LIVE_SESSION_SOURCE.github.match(/github\.com\/([^/]+\/[^/#?]+)/)?.[1], raw = `https://raw.githubusercontent.com/${repo}/`;
  const ext = (p) => (p.split(".").pop() || "").toLowerCase(), folder = (p) => p.split("/")[0];
  const allowed = (p) => LIVE_SESSION_FILTER.extensions.includes(ext(p)) && LIVE_SESSION_FILTER.folders.some((x) => x instanceof RegExp ? x.test(folder(p)) : x === folder(p));
  const css = `body.live-session-mode .book-toc{display:none}#live-sessions{margin:1rem 0;padding:.8rem 0;border-top:1px solid var(--gray-200);border-bottom:1px solid var(--gray-200)}#live-sessions summary{cursor:pointer;list-style:none}#live-sessions summary::-webkit-details-marker{display:none}.live-title{display:flex;justify-content:space-between;font-weight:700}.live-folder{margin:.45rem 0}.live-folder>summary{padding:.25rem .35rem;border-radius:.35rem;font-weight:600}.live-folder>summary:hover,.live-folder a:hover{background:var(--gray-100);text-decoration:none}.live-folder ul{margin:.25rem 0 .5rem .5rem;padding-left:.7rem;border-left:1px solid var(--gray-300);list-style:none}.live-folder a{display:block;padding:.22rem .3rem;border-radius:.3rem;font-size:.9em;overflow:hidden;text-overflow:ellipsis}.live-view{width:100%;height:82vh;border:1px solid var(--gray-300);border-radius:.45rem;background:white}.live-bar{display:flex;gap:.5rem;justify-content:flex-end;margin:.7rem 0}.live-bar button{border:1px solid var(--gray-300);border-radius:.35rem;background:transparent;color:var(--color-link);padding:.28rem .55rem;font:inherit;cursor:pointer}`;
  const render = (html, btn = "") => { document.body.classList.add("live-session-mode"); q(".markdown-section,.book-article,article,#app").innerHTML = `${html}<div class="live-bar">${btn}</div>`; scrollTo(0, 0); };
  const frame = (src) => `<iframe id="live-frame" class="live-view" src="${src}" allow="fullscreen" allowfullscreen></iframe>`;

  let inMemoryPaths = null;
  const CACHE_KEY = "live_session_paths", CACHE_TIME_KEY = "live_session_paths_time", CACHE_TTL = 300000;

  const flatten = (files, prefix = "") => files.reduce((acc, f) => {
    const p = prefix ? `${prefix}/${f.name}` : f.name;
    return acc.concat(f.type === "directory" ? flatten(f.files || [], p) : p);
  }, []);

  async function getPaths(branch) {
    if (inMemoryPaths) return inMemoryPaths;
    const cached = localStorage.getItem(CACHE_KEY), cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cachedTime && (Date.now() - Number(cachedTime) < CACHE_TTL)) return (inMemoryPaths = JSON.parse(cached));
    let paths = [];
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`);
      if (res.ok) paths = (await res.json()).tree?.filter(i => i.type === "blob").map(i => i.path) || [];
    } catch (e) {}
    if (!paths.length) {
      try {
        const res = await fetch(`https://data.jsdelivr.com/v1/packages/gh/${repo}@${branch}`);
        if (res.ok) paths = flatten((await res.json()).files || []);
      } catch (e) {}
    }
    if (!paths.length && cached) paths = JSON.parse(cached);
    if (paths.length) {
      inMemoryPaths = paths;
      localStorage.setItem(CACHE_KEY, JSON.stringify(paths));
      localStorage.setItem(CACHE_TIME_KEY, Date.now());
    }
    return paths;
  }

  async function view(branch, path) {
    const url = `${raw}${branch}/${path}`, x = ext(path);
    if (["md", "markdown", "txt"].includes(x)) {
      const text = await fetch(url).then((r) => r.text()), md = window.marked || await import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js");
      render(x === "txt" ? `<pre>${esc(text)}</pre>` : ((md.marked || md).parse || md)(text));
    } else if (x === "pdf") {
      const data = await fetch(url).then((r) => r.arrayBuffer()), src = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      render(frame(src), `<button id="live-full">Fullscreen</button>`);
    } else if (["html", "htm"].includes(x)) {
      const text = await fetch(url).then((r) => r.text()), base = url.replace(/[^/]+$/, ""), html = text.replace(/<head([^>]*)>/i, `<head$1><base href="${base}">`).replace(/<\/body>/i, '<script>addEventListener("load",()=>{try{Reveal.configure({showNotes:true})}catch(e){}})</script></body>');
      render(frame(URL.createObjectURL(new Blob([html], { type: "text/html" }))), `<button id="live-full">Fullscreen</button>`);
    }
    q("#live-full") && (q("#live-full").onclick = () => q("#live-frame").requestFullscreen());
  }

  const makeTree = (paths) => {
    const root = {};
    for (const p of paths) {
      let curr = root;
      p.split("/").slice(1).forEach((part, i, arr) => curr = curr[part] = (i === arr.length - 1 ? p : curr[part] || {}));
    }
    return root;
  };

  const renderTree = (node) => `<ul>${Object.keys(node).sort((a, b) => (typeof node[b] === "object") - (typeof node[a] === "object") || a.localeCompare(b)).map(k => typeof node[k] === "object" ? `<li><details class="live-folder"><summary>${esc(k)}</summary>${renderTree(node[k])}</details></li>` : `<li><a href="#" data-live="${esc(node[k])}" title="${esc(node[k])}">${esc(k)}</a></li>`).join("")}</ul>`;

  async function init() {
    const nav = q(".book-menu-content nav,.sidebar-nav,.sidebar nav"); if (!nav || q("#live-sessions")) return;
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
    const box = document.createElement("details"); box.id = "live-sessions"; box.innerHTML = '<summary class="live-title"><span>Live Sessions</span><span>+</span></summary><p>Loading...</p>';
    (q("#tds-theme-toggle") || nav.lastElementChild)?.before(box);
    const branch = LIVE_SESSION_SOURCE.branch || "main", paths = await getPaths(branch), groups = {};
    paths.filter(allowed).forEach((p) => (groups[folder(p)] ||= []).push(p));
    box.innerHTML = '<summary class="live-title"><span>Live Sessions</span><span>+</span></summary>' + Object.entries(groups).sort().map(([d, fs]) => `<details class="live-folder"><summary>${esc(d)}</summary>${renderTree(makeTree(fs))}</details>`).join("");
    box.onclick = (e) => { const p = e.target.dataset.live; if (p) { e.preventDefault(); view(branch, p); } };
  }

  document.addEventListener("DOMContentLoaded", init); setInterval(() => q("#live-sessions") || init(), 1000);
})();
