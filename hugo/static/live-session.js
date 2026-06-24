(function () {
  const SOURCE = { repo: "hrmiitm/tds-may-26-live-session", branch: "main", title: "Live Sessions" };
  const ALLOWED = /\.(md|markdown|txt|pdf|html?)$/i;
  const q = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const label = (path) => path.split("/").pop().replace(/\.(md|markdown|txt|pdf|html?)$/i, "").replace(/[-_]+/g, " ");
  const href = (path) => `https://github.com/${SOURCE.repo}/blob/${SOURCE.branch}/${path}`;

  const group = (paths) => paths.reduce((out, path) => {
    const parts = path.split("/"), folder = parts.length > 1 ? parts[0] : "Files";
    (out[folder] ||= []).push(path);
    return out;
  }, {});

  const render = (groups) => Object.entries(groups).sort().map(([folder, files]) => `
      <details class="live-folder">
        <summary>${esc(folder)}</summary>
        <ul>${files.sort().map((file) => `<li><a href="${href(file)}" target="_blank" rel="noopener">${esc(label(file))}</a></li>`).join("")}</ul>
      </details>`).join("");

  async function init() {
    const nav = q(".book-menu-content nav,.sidebar-nav,.sidebar nav");
    if (!nav || q("#live-sessions")) return;
    const box = document.createElement("details");
    box.id = "live-sessions";
    box.innerHTML = `<summary class="live-title"><span>${SOURCE.title}</span></summary><p>Loading...</p>`;
    (q("#tds-theme-toggle") || nav.lastElementChild)?.before(box);
    const api = `https://api.github.com/repos/${SOURCE.repo}/git/trees/${SOURCE.branch}?recursive=1`;
    const files = (await fetch(api).then((r) => r.json())).tree.filter((x) => x.type === "blob").map((x) => x.path).filter((p) => ALLOWED.test(p));
    box.innerHTML = `<summary class="live-title"><span>${SOURCE.title}</span></summary>${render(group(files))}`;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
