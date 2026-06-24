(function () {
  const SRC = { repo: "hrmiitm/tds-may-26-live-session", branch: "main" };
  const EXT = ["md", "markdown", "txt", "pdf", "html", "htm"], TTL = 300000, KEY = "live_session_paths";
  const q = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ext = (p) => (p.split(".").pop() || "").toLowerCase(), folder = (p) => p.split("/")[0];
  const raw = `https://raw.githubusercontent.com/${SRC.repo}/`, allowed = (p) => EXT.includes(ext(p));
  const flatten = (files, pre = "") => files.flatMap((f) => { const p = pre ? `${pre}/${f.name}` : f.name; return f.type === "directory" ? flatten(f.files || [], p) : p; });
  const render = (html, btn = "") => { document.body.classList.add("live-session-mode"); q(".markdown-section,.book-article,article,#app").innerHTML = `${html}<div class="live-bar">${btn}</div>`; scrollTo(0, 0); };
  const frame = (src) => `<iframe id="live-frame" class="live-view" src="${src}" allow="fullscreen" allowfullscreen></iframe>`;

  async function paths(branch) {
    const cached = JSON.parse(localStorage.getItem(KEY) || "null"), time = +localStorage.getItem(`${KEY}_time`);
    if (cached && Date.now() - time < TTL) return cached;
    let out = [];
    try { const r = await fetch(`https://api.github.com/repos/${SRC.repo}/git/trees/${branch}?recursive=1`); if (r.ok) out = (await r.json()).tree.filter((x) => x.type === "blob").map((x) => x.path); } catch (_e) {}
    if (!out.length) try { const r = await fetch(`https://data.jsdelivr.com/v1/packages/gh/${SRC.repo}@${branch}`); if (r.ok) out = flatten((await r.json()).files || []); } catch (_e) {}
    out = out.length ? out : cached || [];
    if (out.length) localStorage.setItem(KEY, JSON.stringify(out)), localStorage.setItem(`${KEY}_time`, Date.now());
    return out;
  }

  async function view(branch, path) {
    const url = `${raw}${branch}/${path}`, x = ext(path);
    if (["md", "markdown", "txt"].includes(x)) {
      const text = await fetch(url).then((r) => r.text()), md = window.marked || await import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js");
      render(x === "txt" ? `<pre>${esc(text)}</pre>` : ((md.marked || md).parse || md)(text));
    } else if (x === "pdf") {
      const data = await fetch(url).then((r) => r.arrayBuffer()); render(frame(URL.createObjectURL(new Blob([data], { type: "application/pdf" }))), '<button id="live-full">Fullscreen</button>');
    } else if (["html", "htm"].includes(x)) {
      const text = await fetch(url).then((r) => r.text()), base = url.replace(/[^/]+$/, "");
      const html = text.replace(/<head([^>]*)>/i, `<head$1><base href="${base}">`).replace(/<\/body>/i, '<script>addEventListener("load",()=>{try{Reveal.configure({showNotes:true})}catch(e){}})</script></body>');
      render(frame(URL.createObjectURL(new Blob([html], { type: "text/html" }))), '<button id="live-full">Fullscreen</button>');
    }
    q("#live-full") && (q("#live-full").onclick = () => q("#live-frame").requestFullscreen());
  }

  const tree = (items) => `<ul>${Object.entries(items).sort().map(([k, v]) => typeof v === "string" ? `<li><a href="#" data-live="${esc(v)}" title="${esc(v)}">${esc(k)}</a></li>` : `<li><details class="live-folder"><summary>${esc(k)}</summary>${tree(v)}</details></li>`).join("")}</ul>`;
  const add = (root, path) => path.split("/").slice(1).reduce((o, p, i, a) => o[p] = i === a.length - 1 ? path : o[p] || {}, root);
  async function init() {
    const nav = q(".book-menu-content nav,.sidebar-nav,.sidebar nav"); if (!nav || q("#live-sessions")) return;
    const box = document.createElement("details"); box.id = "live-sessions"; box.innerHTML = '<summary class="live-title"><span>Live Sessions</span><span>+</span></summary><p>Loading...</p>';
    (q("#tds-theme-toggle") || nav.lastElementChild)?.before(box);
    const groups = {}, branch = SRC.branch;
    (await paths(branch)).filter(allowed).forEach((p) => add(groups[folder(p)] ||= {}, p));
    box.innerHTML = '<summary class="live-title"><span>Live Sessions</span><span>+</span></summary>' + Object.entries(groups).sort().map(([k, v]) => `<details class="live-folder"><summary>${esc(k)}</summary>${tree(v)}</details>`).join("");
    box.onclick = (e) => { const p = e.target.dataset.live; if (p) e.preventDefault(), view(branch, p); };
  }
  document.addEventListener("DOMContentLoaded", init); setInterval(() => q("#live-sessions") || init(), 1000);
})();
