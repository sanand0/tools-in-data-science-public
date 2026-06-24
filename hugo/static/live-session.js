(function () {
  const LIVE_SESSION_SOURCE = { github: "https://github.com/hrmiitm/tds-may-26-live-session", branch: "main" };
  const LIVE_SESSION_FILTER = { folders: [/.*/], extensions: ["md", "markdown", "txt", "pdf", "html", "htm"] };
  const q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const repo = LIVE_SESSION_SOURCE.github.match(/github\.com\/([^/]+\/[^/#?]+)/)?.[1], raw = `https://raw.githubusercontent.com/${repo}/`;
  const ext = (p) => (p.split(".").pop() || "").toLowerCase(), folder = (p) => p.split("/")[0], file = (p) => p.split("/").pop();
  const allowed = (p) => LIVE_SESSION_FILTER.extensions.includes(ext(p)) && LIVE_SESSION_FILTER.folders.some((x) => x instanceof RegExp ? x.test(folder(p)) : x === folder(p));
  const css = `body.live-session-mode .book-toc{display:none}#live-sessions{margin:1rem 0;padding:.8rem 0;border-top:1px solid var(--gray-200);border-bottom:1px solid var(--gray-200)}#live-sessions summary{cursor:pointer;list-style:none}#live-sessions summary::-webkit-details-marker{display:none}.live-title{display:flex;justify-content:space-between;font-weight:700}.live-folder{margin:.45rem 0}.live-folder>summary{padding:.25rem .35rem;border-radius:.35rem;font-weight:600}.live-folder>summary:hover,.live-folder a:hover{background:var(--gray-100);text-decoration:none}.live-folder ul{margin:.25rem 0 .5rem .5rem;padding-left:.7rem;border-left:1px solid var(--gray-300);list-style:none}.live-folder a{display:block;padding:.22rem .3rem;border-radius:.3rem;font-size:.9em;overflow:hidden;text-overflow:ellipsis}.live-view{width:100%;height:82vh;border:1px solid var(--gray-300);border-radius:.45rem;background:white}.live-bar{display:flex;gap:.5rem;justify-content:flex-end;margin:.7rem 0}.live-bar button{border:1px solid var(--gray-300);border-radius:.35rem;background:transparent;color:var(--color-link);padding:.28rem .55rem;font:inherit;cursor:pointer}`;
  const article = () => q(".markdown-section,.book-article,article,#app");
  const render = (html, buttons = "") => { document.body.classList.add("live-session-mode"); article().innerHTML = `${html}<div class="live-bar">${buttons}</div>`; scrollTo(0, 0); };
  const frame = (src) => `<iframe id="live-frame" class="live-view" src="${src}" allow="fullscreen" allowfullscreen></iframe>`;
  const load = (src) => new Promise((ok) => q(`script[src="${src}"]`) ? ok() : Object.assign(document.head.appendChild(document.createElement("script")), { src, onload: ok }));
  const download = (url, name) => { const a = Object.assign(document.createElement("a"), { href: url, download: name }); document.body.append(a); a.click(); a.remove(); };

  let inMemoryPaths = null;
  const CACHE_KEY = "live_session_paths";
  const CACHE_TIME_KEY = "live_session_paths_time";
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  const flattenJsdelivr = (files, prefix = "") => {
    let paths = [];
    for (const f of files) {
      const p = prefix ? `${prefix}/${f.name}` : f.name;
      if (f.type === "directory" && f.files) {
        paths.push(...flattenJsdelivr(f.files, p));
      } else if (f.type === "file") {
        paths.push(p);
      }
    }
    return paths;
  };

  async function getPaths(branch) {
    if (inMemoryPaths) return inMemoryPaths;

    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cachedTime && (Date.now() - Number(cachedTime) < CACHE_TTL)) {
      try {
        inMemoryPaths = JSON.parse(cached);
        return inMemoryPaths;
      } catch (e) {}
    }

    let paths = [];
    // Tier 1: Try GitHub API
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`);
      if (res.ok) {
        const data = await res.json();
        if (data.tree) {
          paths = data.tree.filter(i => i.type === "blob").map(i => i.path);
        }
      } else if (res.status === 403 || res.status === 429) {
        console.warn("GitHub API rate limited, falling back to jsDelivr...");
      }
    } catch (e) {
      console.warn("GitHub API error, trying jsDelivr...", e);
    }

    // Tier 2: Try jsDelivr API if GitHub failed or returned empty
    if (!paths || paths.length === 0) {
      try {
        const res = await fetch(`https://data.jsdelivr.com/v1/packages/gh/${repo}@${branch}`);
        if (res.ok) {
          const data = await res.json();
          paths = flattenJsdelivr(data.files || []);
        }
      } catch (e) {
        console.error("jsDelivr API failed...", e);
      }
    }

    // Use expired cache as absolute last resort if fetch completely failed
    if ((!paths || paths.length === 0) && cached) {
      try {
        paths = JSON.parse(cached);
      } catch (e) {}
    }

    if (paths && paths.length > 0) {
      inMemoryPaths = paths;
      localStorage.setItem(CACHE_KEY, JSON.stringify(paths));
      localStorage.setItem(CACHE_TIME_KEY, Date.now());
    }

    return paths || [];
  }

  async function deckPdf(name) {
    await load("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
    const d = q("#live-frame").contentDocument, pdf = new jspdf.jsPDF(), slides = qa(".reveal .slides section", d).filter((s) => s.innerText.trim());
    (slides.length ? slides : [d.body]).forEach((s, i) => { if (i) pdf.addPage(); pdf.setFontSize(18); pdf.text(`Slide ${i + 1}`, 14, 18); pdf.setFontSize(11); pdf.text(pdf.splitTextToSize(s.innerText.trim(), 180), 14, 32); });
    pdf.save(name.replace(/\.html?$/i, ".pdf"));
  }

  async function view(branch, path) {
    const url = `${raw}${branch}/${path}`, name = file(path), x = ext(path);
    if (["md", "markdown", "txt"].includes(x)) {
      const text = await fetch(url).then((r) => r.text()), md = window.marked || await import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js");
      render(x === "txt" ? `<pre>${esc(text)}</pre>` : ((md.marked || md).parse || md.parse || md)(text));
    } else if (x === "pdf") {
      const data = await fetch(url).then((r) => r.arrayBuffer()), src = URL.createObjectURL(new Blob([data], { type: "application/pdf" })), dl = URL.createObjectURL(new Blob([data], { type: "application/octet-stream" }));
      render(frame(src), `<button id="live-full">Fullscreen</button><button id="live-dl">PDF</button>`); q("#live-dl").onclick = () => download(dl, name);
    } else if (["html", "htm"].includes(x)) {
      const text = await fetch(url).then((r) => r.text()), base = url.replace(/[^/]+$/, ""), html = text.replace(/<head([^>]*)>/i, `<head$1><base href="${base}">`).replace(/<\/body>/i, '<script>addEventListener("load",()=>{try{Reveal.configure({showNotes:true})}catch(e){}})</script></body>');
      render(frame(URL.createObjectURL(new Blob([html], { type: "text/html" }))), `<button id="live-full">Fullscreen</button><button id="live-pdf">PDF</button>`); q("#live-pdf").onclick = async (e) => { e.target.textContent = "Exporting..."; await deckPdf(name); e.target.textContent = "PDF"; };
    }
    q("#live-full") && (q("#live-full").onclick = () => q("#live-frame").requestFullscreen());
  }

  const makeTree = (paths) => {
    const root = {};
    for (const path of paths) {
      const parts = path.split("/").slice(1);
      let current = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = path;
        } else {
          current[part] ||= {};
          current = current[part];
        }
      }
    }
    return root;
  };

  const renderTree = (node) => {
    const keys = Object.keys(node).sort((a, b) => {
      const aIsDir = typeof node[a] === "object";
      const bIsDir = typeof node[b] === "object";
      if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
      return a.localeCompare(b);
    });

    return `<ul>` + keys.map(key => {
      const val = node[key];
      if (typeof val === "object") {
        return `<li><details class="live-folder"><summary>${esc(key)}</summary>${renderTree(val)}</details></li>`;
      } else {
        return `<li><a href="#" data-live="${esc(val)}" title="${esc(val)}">${esc(key)}</a></li>`;
      }
    }).join("") + `</ul>`;
  };

  async function init() {
    const nav = q(".book-menu-content nav,.sidebar-nav,.sidebar nav"); if (!nav || q("#live-sessions")) return;
    document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
    const box = document.createElement("details"); box.id = "live-sessions"; box.innerHTML = '<summary class="live-title"><span>Live Sessions</span><span>+</span></summary><p>Loading...</p>';
    (q("#tds-theme-toggle") || nav.lastElementChild)?.before(box);

    const branch = LIVE_SESSION_SOURCE.branch || "main";
    const paths = await getPaths(branch);
    const groups = {};
    paths.filter(allowed).forEach((p) => (groups[folder(p)] ||= []).push(p));

    box.innerHTML = '<summary class="live-title"><span>Live Sessions</span><span>+</span></summary>' + Object.entries(groups).sort().map(([d, fs]) => {
      const tree = makeTree(fs);
      return `<details class="live-folder"><summary>${esc(d)}</summary>${renderTree(tree)}</details>`;
    }).join("");
    box.onclick = (e) => { const p = e.target.dataset.live; if (p) { e.preventDefault(); view(branch, p); } };
  }

  document.addEventListener("DOMContentLoaded", init); setInterval(() => q("#live-sessions") || init(), 1000);
})();
