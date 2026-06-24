(async function () {
  const RAW_URL = "https://raw.githubusercontent.com/hrmiitm/tds-may-26-live-session/main/notifications.md";
  const KEY = "notif-last-read";
  const css = `
    #notif-btn{position:fixed;bottom:20px;right:20px;z-index:9999;cursor:pointer;background:var(--gray-100);border:1px solid var(--gray-200);border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px #0002;color:var(--body-font-color)}
    #notif-btn:hover{background:var(--gray-200)}#notif-badge{position:absolute;top:2px;right:2px;background:var(--color-accent-danger,#ff3b30);border-radius:50%;width:8px;height:8px}#notif-box{position:fixed;bottom:76px;right:20px;width:350px;height:480px;z-index:9999;background:var(--body-background,#fff);color:var(--body-font-color,#000);border:1px solid var(--gray-200);border-radius:12px;box-shadow:0 12px 36px #0003;display:flex;flex-direction:column;resize:both;overflow:auto;min-width:280px;min-height:280px;max-width:90vw;max-height:90vh}
    #notif-box[hidden],#notif-badge[hidden]{display:none}#notif-hdr{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--gray-200);background:var(--gray-100);font-weight:600;font-size:.95em}#notif-hdr div{display:flex;gap:8px;align-items:center}#notif-body{flex:1;overflow:auto;padding:16px;font-size:.9em;line-height:1.45}.notif-item{padding:12px;margin-bottom:12px;border-left:3px solid var(--color-link);border-radius:6px;background:var(--gray-100)}.notif-item>:first-child{margin-top:0}.notif-item>:last-child{margin-bottom:0}.notif-btn-link{background:none;border:0;cursor:pointer;font-size:.8em;color:var(--color-link);padding:2px 6px;border-radius:4px;font-weight:500}.notif-btn-link:hover{text-decoration:underline;background:var(--gray-200)}
    @keyframes ring{0%,100%{transform:rotate(0)}15%{transform:rotate(12deg)}30%{transform:rotate(-10deg)}45%{transform:rotate(8deg)}60%{transform:rotate(-6deg)}75%{transform:rotate(4deg)}90%{transform:rotate(-2deg)}}.ringing svg{animation:ring 1.8s ease infinite;transform-origin:top center}
  `;
  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
  document.body.insertAdjacentHTML("beforeend", `<button id="notif-btn" aria-label="Notifications"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg><span id="notif-badge" hidden></span></button><section id="notif-box" hidden><div id="notif-hdr"><span>Updates</span><div><button id="notif-read-all" class="notif-btn-link">Mark all read</button><button id="notif-close" class="notif-btn-link" style="font-size:16px;color:inherit" aria-label="Close">&times;</button></div></div><div id="notif-body">Loading...</div></section>`);
  const $ = id => document.getElementById(id);
  const btn = $("notif-btn"), badge = $("notif-badge"), box = $("notif-box"), body = $("notif-body");
  const hash = text => [...text].reduce((h, ch) => (Math.imul(31, h) + ch.charCodeAt(0)) | 0, 0).toString(36);
  let current = "";
  const markRead = () => { if (current) localStorage.setItem(KEY, current); badge.hidden = true; btn.classList.remove("ringing"); };
  $("notif-read-all").onclick = markRead;
  $("notif-close").onclick = () => { box.hidden = true; };
  btn.onclick = () => { box.hidden = !box.hidden; };
  try {
    const markdown = (await fetch(RAW_URL, { cache: "no-store" }).then(r => r.ok ? r.text() : Promise.reject())).trim();
    current = hash(markdown);
    const marked = window.marked || (await import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js")).marked;
    body.innerHTML = markdown ? markdown.split(/^---\s*$/m).map(s => s.trim()).filter(Boolean).map(s => `<article class="notif-item">${marked.parse(s)}</article>`).join("") : "No notifications available.";
    if (markdown && current !== localStorage.getItem(KEY)) { badge.hidden = false; btn.classList.add("ringing"); }
  } catch {
    body.textContent = "Failed to load notifications.";
  }
})();
