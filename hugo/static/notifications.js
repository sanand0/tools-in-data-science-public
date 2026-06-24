(async function () {
  const RAW_URL = "https://raw.githubusercontent.com/hrmiitm/tds-may-26-live-session/main/notifications.md";
  const KEY = "notif-last-read";
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
