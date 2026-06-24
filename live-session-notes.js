/**
 * live-session-notes.js - Docsify live-session slide decks with local ink.
 */
(function () {
  "use strict";

  var REVEAL_CSS = "https://cdn.jsdelivr.net/npm/reveal.js@4.6.1/dist/reveal.css";
  var REVEAL_THEME = "https://cdn.jsdelivr.net/npm/reveal.js@4.6.1/dist/theme/white.css";
  var REVEAL_JS = "https://cdn.jsdelivr.net/npm/reveal.js@4.6.1/dist/reveal.js";
  var HTML2CANVAS_JS = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
  var PPTXGEN_JS = "https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js";
  var STORAGE_PREFIX = "tds-live-session-notes:";
  var DEFAULT_COLOR = "#dc3545";
  var VERSION = 1;

  var scriptLoads = {};
  var registeredDecks = {};
  var registeredDeckCount = 0;

  var ICONS = {
    annotate: '<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>',
    eyeOff: '<path d="m3 3 18 18"></path><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"></path><path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c6.5 0 10 8 10 8a16.4 16.4 0 0 1-3 4.2"></path><path d="M6.7 6.7C3.6 8.8 2 12 2 12s3.5 6 10 6a10.8 10.8 0 0 0 4.1-.8"></path>',
    undo: '<path d="M9 14 4 9l5-5"></path><path d="M4 9h10a6 6 0 0 1 0 12h-2"></path>',
    trash: '<path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path>',
    importFile: '<path d="M14 3v4a2 2 0 0 0 2 2h4"></path><path d="M5 20V5a2 2 0 0 1 2-2h7l6 6v11Z"></path><path d="M12 18v-7"></path><path d="m9 14 3-3 3 3"></path>',
    exportFile: '<path d="M14 3v4a2 2 0 0 0 2 2h4"></path><path d="M5 20V5a2 2 0 0 1 2-2h7l6 6v11Z"></path><path d="M12 11v7"></path><path d="m9 15 3 3 3-3"></path>',
    pdf: '<path d="M14 3v4a2 2 0 0 0 2 2h4"></path><path d="M5 20V5a2 2 0 0 1 2-2h7l6 6v11Z"></path><path d="M8 13h2a1.5 1.5 0 0 1 0 3H8v-5"></path><path d="M13 11v5h1.5a2.5 2.5 0 0 0 0-5Z"></path><path d="M18 16v-5h3"></path><path d="M18 13h2"></path>',
    ppt: '<path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4Z"></path><path d="M8 8h4a2 2 0 0 1 0 4H8Z"></path><path d="M8 12v3"></path>',
    play: '<path d="m8 5 11 7-11 7Z"></path>',
    chevronLeft: '<path d="m15 18-6-6 6-6"></path>',
    chevronRight: '<path d="m9 18 6-6-6-6"></path>',
    x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
  };

  function svg(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + "</svg>";
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function slugify(value) {
    return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "live-session-notes";
  }

  function parseAttributes(attrText) {
    var holder = document.createElement("div");
    holder.innerHTML = "<div" + attrText + "></div>";
    var node = holder.firstElementChild;
    var attrs = {};
    if (!node) return attrs;
    Array.prototype.slice.call(node.attributes).forEach(function (attr) {
      attrs[attr.name] = attr.value;
    });
    return attrs;
  }

  function registerDeckBlocks(markdown) {
    return String(markdown || "").replace(/<div([^>]*class=["'][^"']*live-session-note[^"']*["'][^>]*)>\s*<textarea[^>]*data-live-session-slides[^>]*>([\s\S]*?)<\/textarea>\s*<\/div>/gi, function (_, attrText, rawSlides) {
      var attrs = parseAttributes(attrText);
      var deckId = attrs["data-deck-id"] || ("live-session-deck-" + (++registeredDeckCount));
      registeredDecks[deckId] = { attrs: attrs, raw: rawSlides };
      return '<div class="live-session-note" data-lsn-registry-id="' + escapeHtml(deckId) + '"></div>';
    });
  }

  function ensureCssLink(id, href) {
    if (document.getElementById(id)) return;
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(id, src, test) {
    if (test && test()) return Promise.resolve();
    if (scriptLoads[id]) return scriptLoads[id];
    scriptLoads[id] = new Promise(function (resolve, reject) {
      var existing = document.getElementById(id);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      var script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.onload = resolve;
      script.onerror = function () { reject(new Error("Could not load " + src)); };
      document.head.appendChild(script);
    });
    return scriptLoads[id];
  }

  function loadReveal() {
    ensureCssLink("lsn-reveal-css", REVEAL_CSS);
    ensureCssLink("lsn-reveal-theme", REVEAL_THEME);
    return loadScript("lsn-reveal-js", REVEAL_JS, function () { return !!window.Reveal; });
  }

  function renderMarkdown(markdown) {
    if (window.marked && typeof window.marked.parse === "function") {
      return window.marked.parse(markdown || "");
    }
    return escapeHtml(markdown || "").replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
  }

  function extractSlideTitle(markdown, fallback) {
    var match = String(markdown || "").match(/^#{1,3}\s+(.+)$/m);
    return match ? clean(match[1].replace(/[#*_`]/g, "")) : fallback;
  }

  function parseSlides(raw) {
    var source = String(raw || "").replace(/\r\n/g, "\n").trim();
    if (!source) return [];
    return source.split(/\n---+\n/g).map(function (part, index) {
      var notes = "";
      var markdown = part.replace(/\nnotes?:\s*([\s\S]+)$/i, function (_, noteText) {
        notes = clean(noteText);
        return "";
      }).trim();
      return {
        index: index,
        title: extractSlideTitle(markdown, "Slide " + (index + 1)),
        markdown: markdown,
        notes: notes,
      };
    }).filter(function (slide) { return slide.markdown; });
  }

  function emptyAnnotations(deckId, title) {
    return {
      version: VERSION,
      deckId: deckId,
      title: title || "",
      updatedAt: new Date().toISOString(),
      slides: {},
    };
  }

  function storageKey(deckId) {
    return STORAGE_PREFIX + deckId;
  }

  function loadAnnotations(deckId, title) {
    try {
      var saved = localStorage.getItem(storageKey(deckId));
      if (!saved) return emptyAnnotations(deckId, title);
      var parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object" || !parsed.slides) return emptyAnnotations(deckId, title);
      parsed.version = parsed.version || VERSION;
      parsed.deckId = deckId;
      parsed.title = parsed.title || title || "";
      parsed.slides = parsed.slides || {};
      return parsed;
    } catch (error) {
      return emptyAnnotations(deckId, title);
    }
  }

  function saveAnnotations(state) {
    try {
      state.annotations.updatedAt = new Date().toISOString();
      localStorage.setItem(storageKey(state.deckId), JSON.stringify(state.annotations));
      syncStatus(state, "Saved locally");
    } catch (error) {
      syncStatus(state, "Browser storage is unavailable", "error");
    }
  }

  function currentSlideIndex(state) {
    if (!state.deck || typeof state.deck.getCurrentSlide !== "function") return 0;
    var slide = state.deck.getCurrentSlide();
    var index = slide ? parseInt(slide.getAttribute("data-lsn-index"), 10) : 0;
    return isNaN(index) ? 0 : index;
  }

  function slideKey(index) {
    return "slide-" + index;
  }

  function currentSlideKey(state) {
    return slideKey(currentSlideIndex(state));
  }

  function getCurrentStrokes(state) {
    var key = currentSlideKey(state);
    if (!state.annotations.slides[key]) state.annotations.slides[key] = [];
    return state.annotations.slides[key];
  }

  function countAllStrokes(state) {
    return Object.keys(state.annotations.slides || {}).reduce(function (sum, key) {
      return sum + (state.annotations.slides[key] || []).length;
    }, 0);
  }

  function setStatus(el, message, type) {
    var status = el.querySelector(".lsn-status");
    if (!status) return;
    status.textContent = message || "";
    status.dataset.type = type || "";
  }

  function updateCursor(state) {
    if (!state.annotating || !state.showAnnotations) {
      state.canvas.style.cursor = "";
      return;
    }
    var size = state.size || 5;
    var color = state.color || DEFAULT_COLOR;
    if (state.tool === "eraser") {
      var radius = Math.max(6, size * 2);
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (radius * 2) + '" height="' + (radius * 2) + '" viewBox="0 0 ' + (radius * 2) + ' ' + (radius * 2) + '">' +
        '<circle cx="' + radius + '" cy="' + radius + '" r="' + (radius - 1.5) + '" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>' +
        '<circle cx="' + radius + '" cy="' + radius + '" r="' + radius + '" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="1"/>' +
        '</svg>';
      state.canvas.style.cursor = 'url("data:image/svg+xml;base64,' + btoa(svg) + '") ' + radius + ' ' + radius + ', crosshair';
    } else {
      var radius = Math.max(3, size / 2);
      var opacity = state.tool === "highlighter" ? 0.45 : 0.95;
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (radius * 2 + 6) + '" height="' + (radius * 2 + 6) + '" viewBox="0 0 ' + (radius * 2 + 6) + ' ' + (radius * 2 + 6) + '">' +
        '<circle cx="' + (radius + 3) + '" cy="' + (radius + 3) + '" r="' + radius + '" fill="' + color + '" opacity="' + opacity + '" stroke="rgba(255,255,255,0.9)" stroke-width="1.5"/>' +
        '</svg>';
      var offset = radius + 3;
      state.canvas.style.cursor = 'url("data:image/svg+xml;base64,' + btoa(svg) + '") ' + offset + ' ' + offset + ', crosshair';
    }
  }

  function syncStatus(state, message, type) {
    setStatus(state.el, message, type);
    var slideNo = currentSlideIndex(state) + 1;
    var total = state.slides.length;
    var currentCount = getCurrentStrokes(state).length;
    var meta = state.el.querySelector(".lsn-slide-meta");
    if (meta) {
      meta.textContent = "Slide " + slideNo + " / " + total + " - " + currentCount + " annotations here";
    }
    state.el.querySelectorAll("[data-mode='annotations']").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-value") === (state.showAnnotations ? "show" : "hide"));
    });
    var annotate = state.el.querySelector("[data-action='annotate']");
    if (annotate) annotate.setAttribute("aria-pressed", state.annotating ? "true" : "false");
    state.el.querySelectorAll("[data-tool]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-tool") === state.tool);
    });
    state.el.querySelectorAll("[data-color]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-color") === state.color);
    });
    state.el.classList.toggle("is-annotating", state.annotating);
    state.el.classList.toggle("is-ink-hidden", !state.showAnnotations);
    updateCursor(state);
  }

  function buildSlidesHtml(slides) {
    return slides.map(function (slide) {
      return '<section data-lsn-index="' + slide.index + '">' +
        '<div class="lsn-slide-content">' + renderMarkdown(slide.markdown) + "</div>" +
        (slide.notes ? '<aside class="notes">' + escapeHtml(slide.notes) + "</aside>" : "") +
        "</section>";
    }).join("");
  }

  function buildWorkspace(sourceEl, meta, slides, deckId) {
    var el = document.createElement("section");
    el.className = "lsn-workspace";
    el.setAttribute("data-deck-id", deckId);
    el.innerHTML =
      '<header class="lsn-toolbar">' +
      '<div class="lsn-title-block">' +
      '<span class="lsn-kicker">' + escapeHtml(meta.week || "Live session notes") + "</span>" +
      '<h2>' + escapeHtml(meta.title) + "</h2>" +
      '<div class="lsn-links">' +
      (meta.video ? '<a href="' + escapeHtml(meta.video) + '" target="_blank" rel="noopener noreferrer">Video</a>' : "") +
      (meta.faq ? '<a href="' + escapeHtml(meta.faq) + '">FAQ</a>' : "") +
      "</div>" +
      "</div>" +
      '<div class="lsn-actions">' +
      '<button type="button" class="lsn-btn lsn-icon-btn" data-action="prev" title="Previous slide">' + svg("chevronLeft") + "<span>Prev</span></button>" +
      '<button type="button" class="lsn-btn lsn-icon-btn" data-action="next" title="Next slide"><span>Next</span>' + svg("chevronRight") + "</button>" +
      '<button type="button" class="lsn-btn lsn-primary" data-action="present">' + svg("play") + "<span>Present</span></button>" +
      '<button type="button" class="lsn-btn lsn-exit-present-btn" data-action="exit-present" title="Exit Presentation">' + svg("x") + "<span>Exit</span></button>" +
      '<button type="button" class="lsn-btn" data-action="annotate" aria-pressed="false">' + svg("annotate") + "<span>Annotate</span></button>" +
      '<div class="lsn-segment" aria-label="Annotation visibility">' +
      '<button type="button" data-mode="annotations" data-value="show">' + svg("eye") + "<span>With</span></button>" +
      '<button type="button" data-mode="annotations" data-value="hide">' + svg("eyeOff") + "<span>Without</span></button>" +
      "</div>" +
      '<div class="lsn-segment" aria-label="Drawing tool">' +
      '<button type="button" data-tool="pen">Pen</button>' +
      '<button type="button" data-tool="highlighter">Highlighter</button>' +
      '<button type="button" data-tool="eraser">Eraser</button>' +
      "</div>" +
      '<div class="lsn-swatches" aria-label="Ink color">' +
      '<button type="button" data-color="#dc3545" style="--swatch:#dc3545" title="Red"></button>' +
      '<button type="button" data-color="#f59e0b" style="--swatch:#f59e0b" title="Amber"></button>' +
      '<button type="button" data-color="#16a34a" style="--swatch:#16a34a" title="Green"></button>' +
      '<button type="button" data-color="#2563eb" style="--swatch:#2563eb" title="Blue"></button>' +
      '<button type="button" data-color="#111827" style="--swatch:#111827" title="Black"></button>' +
      "</div>" +
      '<label class="lsn-size">Size <input type="range" min="2" max="18" value="5" step="1"></label>' +
      '<button type="button" class="lsn-btn" data-action="undo">' + svg("undo") + "<span>Undo</span></button>" +
      '<button type="button" class="lsn-btn" data-action="clear">' + svg("trash") + "<span>Clear</span></button>" +
      '<button type="button" class="lsn-btn" data-action="import-json">' + svg("importFile") + "<span>Import</span></button>" +
      '<button type="button" class="lsn-btn" data-action="export-json">' + svg("exportFile") + "<span>Export</span></button>" +
      '<button type="button" class="lsn-btn" data-action="export-pdf">' + svg("pdf") + "<span>PDF</span></button>" +
      '<button type="button" class="lsn-btn" data-action="export-pptx">' + svg("ppt") + "<span>PPTX</span></button>" +
      "</div>" +
      "</header>" +
      '<div class="lsn-stage" tabindex="0">' +
      '<div class="reveal"><div class="slides">' + buildSlidesHtml(slides) + "</div></div>" +
      '<canvas class="lsn-ink-canvas" aria-hidden="true"></canvas>' +
      '<button type="button" class="lsn-nav-arrow lsn-nav-prev" data-action="prev" aria-label="Previous slide">' + svg("chevronLeft") + "</button>" +
      '<button type="button" class="lsn-nav-arrow lsn-nav-next" data-action="next" aria-label="Next slide">' + svg("chevronRight") + "</button>" +
      '<div class="lsn-slide-counter" aria-live="polite"><span class="lsn-counter-current">1</span><span class="lsn-counter-sep">/</span><span class="lsn-counter-total">' + slides.length + "</span></div>" +
      '<div class="lsn-progress-bar-wrap"><div class="lsn-progress-bar" style="width: 0%"></div></div>' +
      "</div>" +
      '<footer class="lsn-footer"><span class="lsn-slide-meta"></span><span class="lsn-status" role="status"></span></footer>' +
      '<input type="file" class="lsn-file-input" accept="application/json,.json" hidden>';
    sourceEl.replaceWith(el);
    return el;
  }

  function resizeCanvas(state) {
    var canvas = state.canvas;
    var stage = state.stage;
    var rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var nextWidth = Math.round(rect.width * ratio);
    var nextHeight = Math.round(rect.height * ratio);
    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    }
    state.canvasRect = { width: rect.width, height: rect.height };
    redraw(state);
  }

  function strokeToPath(points, width, height) {
    return points.map(function (point, index) {
      var x = Math.max(0, Math.min(width, point.x * width));
      var y = Math.max(0, Math.min(height, point.y * height));
      return (index === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2);
    }).join(" ");
  }

  function drawStroke(state, stroke) {
    var points = stroke.points || [];
    if (points.length < 2) return;
    var ctx = state.canvas.getContext("2d");
    var rect = state.canvasRect || state.stage.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    ctx.save();
    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (stroke.tool === "eraser") {
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = (stroke.size || 5) * 4;
    } else {
      ctx.strokeStyle = stroke.color || DEFAULT_COLOR;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = stroke.tool === "highlighter" ? 0.32 : 1;
      ctx.lineWidth = stroke.tool === "highlighter" ? (stroke.size || 5) * 3 : stroke.size || 5;
    }
    ctx.beginPath();
    points.forEach(function (point, index) {
      var x = point.x * rect.width;
      var y = point.y * rect.height;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();
  }

  function redraw(state) {
    var ctx = state.canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    if (!state.showAnnotations) return;
    getCurrentStrokes(state).forEach(function (stroke) { drawStroke(state, stroke); });
    if (state.currentStroke) drawStroke(state, state.currentStroke);
  }

  function pointerPoint(state, event) {
    var rect = state.canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
    };
  }

  function bindCanvas(state) {
    state.canvas.addEventListener("pointerdown", function (event) {
      if (!state.annotating || (event.pointerType === "mouse" && event.button !== 0)) return;
      event.preventDefault();
      state.showAnnotations = true;
      state.currentStroke = {
        tool: state.tool,
        color: state.color,
        size: state.size,
        points: [pointerPoint(state, event)],
      };
      state.canvas.setPointerCapture(event.pointerId);
      syncStatus(state, "Annotating");
      redraw(state);
    });

    state.canvas.addEventListener("pointermove", function (event) {
      if (!state.currentStroke) return;
      event.preventDefault();
      var point = pointerPoint(state, event);
      var points = state.currentStroke.points;
      var last = points[points.length - 1];
      if (!last || Math.abs(point.x - last.x) + Math.abs(point.y - last.y) > 0.002) {
        points.push(point);
        redraw(state);
      }
    });

    function finishStroke(event) {
      if (!state.currentStroke) return;
      event.preventDefault();
      if (state.currentStroke.points.length > 1) {
        getCurrentStrokes(state).push(state.currentStroke);
        saveAnnotations(state);
      }
      state.currentStroke = null;
      redraw(state);
      syncStatus(state, "Saved locally");
    }

    state.canvas.addEventListener("pointerup", finishStroke);
    state.canvas.addEventListener("pointercancel", finishStroke);
  }

  function setAnnotationVisibility(state, visible) {
    state.showAnnotations = visible;
    if (!visible) state.annotating = false;
    redraw(state);
    syncStatus(state, visible ? "Showing annotations" : "Showing clean slides");
  }

  function toggleAnnotating(state) {
    state.annotating = !state.annotating;
    if (state.annotating) state.showAnnotations = true;
    redraw(state);
    syncStatus(state, state.annotating ? "Annotation mode on" : "Annotation mode off");
  }

  function undoStroke(state) {
    var strokes = getCurrentStrokes(state);
    if (!strokes.length) {
      syncStatus(state, "No annotation to undo");
      return;
    }
    strokes.pop();
    saveAnnotations(state);
    redraw(state);
  }

  function clearSlide(state) {
    var strokes = getCurrentStrokes(state);
    if (!strokes.length) {
      syncStatus(state, "This slide has no annotations");
      return;
    }
    if (!window.confirm("Clear annotations on this slide?")) return;
    state.annotations.slides[currentSlideKey(state)] = [];
    saveAnnotations(state);
    redraw(state);
  }

  function downloadBlob(filename, type, content) {
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  }

  function filenameFor(state, extension) {
    return slugify(state.meta.title || state.deckId) + "." + extension;
  }

  function exportAnnotations(state) {
    var payload = JSON.stringify({
      version: VERSION,
      deckId: state.deckId,
      title: state.meta.title,
      exportedAt: new Date().toISOString(),
      slideTitles: state.slides.map(function (slide) { return slide.title; }),
      slides: state.annotations.slides || {},
    }, null, 2);
    downloadBlob(filenameFor(state, "annotations.json"), "application/json", payload);
    syncStatus(state, "Annotation file exported");
  }

  function importAnnotations(state) {
    var input = state.el.querySelector(".lsn-file-input");
    input.value = "";
    input.onchange = function () {
      var file = input.files && input.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var parsed = JSON.parse(String(reader.result || "{}"));
          if (!parsed.slides || typeof parsed.slides !== "object") throw new Error("Missing slides");
          if (parsed.deckId && parsed.deckId !== state.deckId) {
            var ok = window.confirm("This annotation file is for a different deck. Import it here anyway?");
            if (!ok) return;
          }
          state.annotations = emptyAnnotations(state.deckId, state.meta.title);
          state.annotations.slides = parsed.slides;
          saveAnnotations(state);
          redraw(state);
          syncStatus(state, "Annotations imported");
        } catch (error) {
          syncStatus(state, "Could not import this file", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function annotationSvg(state, slideIndex) {
    if (!state.showAnnotations) return "";
    var strokes = (state.annotations.slides || {})[slideKey(slideIndex)] || [];
    if (!strokes.length) return "";
    var paths = strokes.map(function (stroke) {
      var points = stroke.points || [];
      if (points.length < 2) return "";
      var width = stroke.tool === "highlighter" ? (stroke.size || 5) * 3 : stroke.size || 5;
      var opacity = stroke.tool === "highlighter" ? "0.32" : "1";
      return '<path d="' + strokeToPath(points, 1280, 720) + '" fill="none" stroke="' +
        escapeHtml(stroke.color || DEFAULT_COLOR) + '" stroke-width="' + width + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + opacity + '"></path>';
    }).join("");
    return '<svg class="lsn-export-ink" viewBox="0 0 1280 720" aria-hidden="true">' + paths + "</svg>";
  }

  function exportSlideHtml(state, slide, printMode) {
    return '<section class="lsn-export-slide' + (printMode ? " is-print" : "") + '">' +
      '<div class="lsn-export-content">' + renderMarkdown(slide.markdown) + "</div>" +
      annotationSvg(state, slide.index) +
      '<footer class="lsn-export-footer">' +
      '<span>' + escapeHtml(state.meta.week || "Live session") + "</span>" +
      '<span>' + (slide.index + 1) + " / " + state.slides.length + "</span>" +
      "</footer>" +
      "</section>";
  }

  var EXPORT_CSS =
    ".lsn-export-slide{position:relative;width:1280px;height:720px;box-sizing:border-box;padding:58px 70px 46px;overflow:hidden;background:#fff;color:#182033;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}" +
    ".lsn-export-content{position:relative;z-index:1;height:100%;font-size:32px;line-height:1.28}" +
    ".lsn-export-content h1{margin:.05em 0 .45em;color:#111827;font-size:62px;line-height:1.02;letter-spacing:0}" +
    ".lsn-export-content h2{margin:.05em 0 .45em;color:#111827;font-size:48px;line-height:1.06;letter-spacing:0}" +
    ".lsn-export-content h3{margin:.1em 0 .35em;color:#374151;font-size:34px;line-height:1.12;letter-spacing:0}" +
    ".lsn-export-content p{margin:.4em 0}.lsn-export-content ul,.lsn-export-content ol{margin:.35em 0 .35em 1.1em;padding:0}.lsn-export-content li{margin:.22em 0}" +
    ".lsn-export-content code{padding:.08em .25em;border-radius:5px;background:#f1f5f9;color:#be123c;font-family:'SFMono-Regular',Consolas,monospace;font-size:.78em}" +
    ".lsn-export-content pre{margin:.5em 0;padding:18px;border:1px solid #d9e2ec;border-radius:8px;background:#0f172a;color:#e5e7eb;white-space:pre-wrap}" +
    ".lsn-export-content pre code{padding:0;background:transparent;color:inherit;font-size:23px;line-height:1.35}" +
    ".lsn-export-content blockquote{margin:.45em 0;padding:.1em .8em;border-left:8px solid #dc3545;color:#374151;background:#fff5f5}" +
    ".lsn-export-content table{border-collapse:collapse;width:100%;font-size:.7em}.lsn-export-content th,.lsn-export-content td{border:1px solid #d9e2ec;padding:8px 10px;text-align:left}.lsn-export-content th{background:#f8fafc}" +
    ".lsn-export-ink{position:absolute;inset:0;z-index:3;width:100%;height:100%;pointer-events:none}.lsn-export-footer{position:absolute;left:70px;right:70px;bottom:24px;z-index:2;display:flex;justify-content:space-between;color:#64748b;font-size:17px;font-weight:700}";

  function exportPdf(state) {
    var popup = window.open("", "_blank");
    if (!popup) {
      syncStatus(state, "Popup blocked. Allow popups to export PDF.", "error");
      return;
    }
    var slides = state.slides.map(function (slide) { return exportSlideHtml(state, slide, true); }).join("");
    popup.document.write("<!doctype html><html><head><meta charset=\"utf-8\"><title>" +
      escapeHtml(state.meta.title) +
      "</title><style>" + EXPORT_CSS +
      "@page{size:13.333in 7.5in;margin:0}html,body{margin:0;background:#fff}.lsn-export-slide{width:13.333in;height:7.5in;page-break-after:always;break-after:page}.lsn-export-slide:last-child{page-break-after:auto;break-after:auto}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>" +
      slides +
      "<script>setTimeout(function(){window.focus();window.print();},450);</script></body></html>");
    popup.document.close();
    syncStatus(state, "PDF print view opened");
  }

  function loadPptxExporters() {
    return Promise.all([
      loadScript("lsn-html2canvas-js", HTML2CANVAS_JS, function () { return !!window.html2canvas; }),
      loadScript("lsn-pptxgen-js", PPTXGEN_JS, function () { return !!(window.pptxgen || window.PptxGenJS || window.pptxgenjs); }),
    ]);
  }

  async function exportPptx(state) {
    syncStatus(state, "Preparing PPTX...");
    try {
      await loadPptxExporters();
      var PptxCtor = window.pptxgen || window.PptxGenJS || window.pptxgenjs;
      if (!PptxCtor || !window.html2canvas) throw new Error("PPTX libraries unavailable");
      var renderRoot = document.createElement("div");
      renderRoot.className = "lsn-pptx-render-root";
      renderRoot.innerHTML = state.slides.map(function (slide) { return exportSlideHtml(state, slide, false); }).join("");
      document.body.appendChild(renderRoot);

      var pptx = new PptxCtor();
      pptx.layout = "LAYOUT_WIDE";
      pptx.author = "Tools in Data Science";
      pptx.subject = state.meta.week || "Live session notes";
      pptx.title = state.meta.title;
      pptx.company = "Tools in Data Science";
      var nodes = Array.prototype.slice.call(renderRoot.querySelectorAll(".lsn-export-slide"));
      for (var i = 0; i < nodes.length; i += 1) {
        var canvas = await window.html2canvas(nodes[i], {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          logging: false,
        });
        var slide = pptx.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addImage({ data: canvas.toDataURL("image/png"), x: 0, y: 0, w: 13.333, h: 7.5 });
        if (state.slides[i].notes && typeof slide.addNotes === "function") {
          slide.addNotes(state.slides[i].notes);
        }
      }
      renderRoot.remove();
      await pptx.writeFile({ fileName: filenameFor(state, "pptx") });
      syncStatus(state, "PPTX exported");
    } catch (error) {
      var oldRoot = document.querySelector(".lsn-pptx-render-root");
      if (oldRoot) oldRoot.remove();
      syncStatus(state, "Could not export PPTX", "error");
    }
  }

  function enterPresentation(state) {
    state.el.classList.add("is-presenting");
    document.body.classList.add("lsn-fullscreen-active");
    var request = state.el.requestFullscreen || state.el.webkitRequestFullscreen || state.el.msRequestFullscreen;
    if (request) {
      try {
        request.call(state.el).catch(function () { });
      } catch (error) { }
    }
    setTimeout(function () {
      if (state.deck && state.deck.layout) state.deck.layout();
      resizeCanvas(state);
      state.stage.focus();
    }, 150);
    syncStatus(state, "Presentation mode");
  }

  function exitPresentation(state) {
    state.el.classList.remove("is-presenting");
    document.body.classList.remove("lsn-fullscreen-active");
    var toolbar = state.el.querySelector(".lsn-toolbar");
    if (toolbar) toolbar.classList.remove("lsn-toolbar-hidden");
    setTimeout(function () {
      if (state.deck && state.deck.layout) state.deck.layout();
      resizeCanvas(state);
    }, 150);
  }

  function initAutohide(state) {
    var hideTimeout;
    var toolbar = state.el.querySelector(".lsn-toolbar");
    if (!toolbar) return;

    var isHovered = false;

    function hideToolbar() {
      if (state.el.classList.contains("is-presenting") && !isHovered && !state.currentStroke) {
        toolbar.classList.add("lsn-toolbar-hidden");
      }
    }

    function showToolbar(event) {
      if (!state.el.classList.contains("is-presenting")) {
        toolbar.classList.remove("lsn-toolbar-hidden");
        return;
      }

      if (state.currentStroke) {
        // Do not show toolbar while actively drawing
        return;
      }

      // If in presenting mode, only show if mouse is near the top (e.g. clientY < 80)
      if (event && event.clientY >= 80) {
        // If mouse moved away from top and toolbar is visible, queue hiding it
        if (!toolbar.classList.contains("lsn-toolbar-hidden") && !isHovered) {
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(hideToolbar, 1000);
        }
        return;
      }

      // Mouse is near the top
      toolbar.classList.remove("lsn-toolbar-hidden");
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(hideToolbar, 2500);
    }

    state.el.addEventListener("mousemove", showToolbar);
    state.el.addEventListener("pointermove", showToolbar);

    toolbar.addEventListener("mouseenter", function () {
      isHovered = true;
      clearTimeout(hideTimeout);
      toolbar.classList.remove("lsn-toolbar-hidden");
    });

    toolbar.addEventListener("mouseleave", function () {
      isHovered = false;
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(hideToolbar, 1500);
    });

    state.showToolbar = showToolbar;
  }

  function updateSlideCounter(state) {
    var index = currentSlideIndex(state);
    var counter = state.el.querySelector(".lsn-counter-current");
    if (counter) counter.textContent = index + 1;
    var progressBar = state.el.querySelector(".lsn-progress-bar");
    if (progressBar && state.slides.length > 0) {
      var pct = ((index + 1) / state.slides.length) * 100;
      progressBar.style.width = pct + "%";
    }
  }

  function bindControls(state) {
    var actions = state.el.querySelector(".lsn-actions");

    // Floating nav arrows (inside .lsn-stage, always accessible in present mode)
    state.el.addEventListener("click", function (event) {
      var navBtn = event.target.closest(".lsn-nav-arrow");
      if (!navBtn) return;
      var action = navBtn.getAttribute("data-action");
      if (action === "prev" && state.deck) { state.deck.prev(); updateSlideCounter(state); }
      if (action === "next" && state.deck) { state.deck.next(); updateSlideCounter(state); }
    });

    actions.addEventListener("click", function (event) {
      var actionButton = event.target.closest("[data-action]");
      var toolButton = event.target.closest("[data-tool]");
      var colorButton = event.target.closest("[data-color]");
      var modeButton = event.target.closest("[data-mode='annotations']");

      if (toolButton) {
        state.tool = toolButton.getAttribute("data-tool");
        syncStatus(state, state.tool === "highlighter" ? "Highlighter selected" : "Pen selected");
        return;
      }
      if (colorButton) {
        state.color = colorButton.getAttribute("data-color");
        syncStatus(state, "Ink color updated");
        return;
      }
      if (modeButton) {
        setAnnotationVisibility(state, modeButton.getAttribute("data-value") === "show");
        return;
      }
      if (!actionButton || actionButton.closest(".lsn-nav-arrow")) return;
      var action = actionButton.getAttribute("data-action");
      if (action === "prev" && state.deck) { state.deck.prev(); updateSlideCounter(state); }
      if (action === "next" && state.deck) { state.deck.next(); updateSlideCounter(state); }
      if (action === "present") enterPresentation(state);
      if (action === "exit-present") {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(function () {});
        } else {
          exitPresentation(state);
        }
      }
      if (action === "annotate") toggleAnnotating(state);
      if (action === "undo") undoStroke(state);
      if (action === "clear") clearSlide(state);
      if (action === "import-json") importAnnotations(state);
      if (action === "export-json") exportAnnotations(state);
      if (action === "export-pdf") exportPdf(state);
      if (action === "export-pptx") exportPptx(state);
    });

    var sizeInput = state.el.querySelector(".lsn-size input");
    sizeInput.addEventListener("input", function () {
      state.size = parseInt(sizeInput.value, 10) || 5;
      syncStatus(state, "Ink size " + state.size);
    });

    document.addEventListener("fullscreenchange", function () {
      if (!document.fullscreenElement) exitPresentation(state);
    });

    document.addEventListener("keydown", function (event) {
      if (!state.el.classList.contains("is-presenting")) return;
      if (event.key === "Escape") exitPresentation(state);
      if (event.key.toLowerCase() === "a") toggleAnnotating(state);
      if (event.key.toLowerCase() === "v") setAnnotationVisibility(state, !state.showAnnotations);
    });
  }

  function initReveal(state) {
    return loadReveal().then(function () {
      var revealEl = state.el.querySelector(".reveal");
      var compactDeck = window.matchMedia && window.matchMedia("(max-width: 700px)").matches;
      var deck = new window.Reveal(revealEl, {
        embedded: true,
        keyboardCondition: "focused",
        width: compactDeck ? 760 : 1024,
        height: compactDeck ? 428 : 576,
        margin: 0.045,
        controls: true,
        progress: true,
        slideNumber: "c/t",
        hash: false,
        history: false,
        transition: "slide",
        backgroundTransition: "fade",
      });
      state.deck = deck;
      return Promise.resolve(deck.initialize()).then(function () {
        deck.on("slidechanged", function () {
          state.currentStroke = null;
          resizeCanvas(state);
          updateSlideCounter(state);
          syncStatus(state, "Ready");
        });
        deck.on("fragmentshown", function () { redraw(state); });
        deck.on("fragmenthidden", function () { redraw(state); });
        if (window.ResizeObserver) {
          state.resizeObserver = new ResizeObserver(function () {
            if (state.deck && state.deck.layout) state.deck.layout();
            resizeCanvas(state);
          });
          state.resizeObserver.observe(state.stage);
        } else {
          window.addEventListener("resize", function () {
            if (state.deck && state.deck.layout) state.deck.layout();
            resizeCanvas(state);
          });
        }
        resizeCanvas(state);
        syncStatus(state, countAllStrokes(state) ? "Annotations restored" : "Ready");
      });
    }).catch(function () {
      setStatus(state.el, "Could not load Reveal.js", "error");
    });
  }

  function initDeck(sourceEl) {
    if (sourceEl.getAttribute("data-lsn-ready") === "true") return;
    sourceEl.setAttribute("data-lsn-ready", "true");
    var registryId = sourceEl.getAttribute("data-lsn-registry-id");
    var registered = registryId ? registeredDecks[registryId] : null;
    function attr(name) {
      return (registered && registered.attrs && registered.attrs[name]) || sourceEl.getAttribute(name) || "";
    }
    function decodeBase64(str) {
      try {
        return decodeURIComponent(escape(atob(str)));
      } catch (e) {
        return atob(str);
      }
    }
    var textarea = sourceEl.querySelector("textarea[data-live-session-slides], script[data-live-session-slides]");
    var raw = "";
    if (textarea) {
      var encoded = textarea.getAttribute("data-slides-encoded");
      if (encoded) {
        raw = decodeBase64(encoded);
      } else {
        raw = registered ? registered.raw : (textarea.value || textarea.textContent || "");
      }
    }
    if (raw) {
      raw = raw.replace(/^\s*<!--\s*/, "").replace(/\s*-->\s*$/, "");
    }
    var meta = {
      title: attr("data-title") || extractSlideTitle(raw, document.title),
      week: attr("data-week"),
      session: attr("data-session"),
      video: attr("data-video"),
      faq: attr("data-faq"),
    };
    var slides = parseSlides(raw);
    if (!slides.length) {
      sourceEl.innerHTML = '<p class="lsn-empty">No slides found for this live session.</p>';
      return;
    }
    var deckId = attr("data-deck-id") || slugify([meta.week, meta.session, meta.title].filter(Boolean).join(" "));
    var el = buildWorkspace(sourceEl, meta, slides, deckId);
    var state = {
      el: el,
      meta: meta,
      slides: slides,
      deckId: deckId,
      annotations: loadAnnotations(deckId, meta.title),
      showAnnotations: true,
      annotating: false,
      tool: "pen",
      color: DEFAULT_COLOR,
      size: 5,
      stage: el.querySelector(".lsn-stage"),
      canvas: el.querySelector(".lsn-ink-canvas"),
      currentStroke: null,
      deck: null,
    };
    bindControls(state);
    bindCanvas(state);
    initAutohide(state);
    syncStatus(state, "Loading deck...");
    initReveal(state);
  }

  function enhanceDecks() {
    ensureStyles();
    document.querySelectorAll(".live-session-note").forEach(initDeck);
  }

  function ensureStyles() {
    if (document.getElementById("lsn-css")) return;
    var style = document.createElement("style");
    style.id = "lsn-css";
    style.textContent =
      ":root{--lsn-accent:hsl(250,89%,65%);--lsn-accent-hover:hsl(250,89%,58%);--lsn-accent-glow:rgba(99,102,241,0.25);--lsn-ink:#0f172a;--lsn-muted:#64748b;--lsn-line:rgba(226,232,240,0.8);--lsn-soft:#f8fafc;--lsn-panel:rgba(255,255,255,0.85);--lsn-shadow:0 20px 40px -15px rgba(15,23,42,0.08),0 0 0 1px rgba(99,102,241,0.05);--lsn-radius:12px}" +
      "@media(prefers-color-scheme:dark){:root{--lsn-ink:#f8fafc;--lsn-muted:#94a3b8;--lsn-line:rgba(255,255,255,0.08);--lsn-soft:#0b0f19;--lsn-panel:rgba(15,23,42,0.85);--lsn-shadow:0 25px 60px -15px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.05)}} " +
      ".lsn-workspace{width:100%;margin:2rem 0 3rem;color:var(--lsn-ink);position:relative;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}" +
      ".lsn-toolbar{display:grid;grid-template-columns:minmax(16rem,1fr) minmax(0,2.5fr);gap:1.25rem;align-items:center;margin-bottom:1rem;padding:1rem 1.25rem;border:1px solid var(--lsn-line);border-radius:var(--lsn-radius);background:var(--lsn-panel);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:var(--lsn-shadow);transition:transform 0.3s cubic-bezier(0.4,0,0.2,1),opacity 0.3s ease}" +
      ".lsn-toolbar-hidden{transform:translateY(-120%) !important;opacity:0 !important;pointer-events:none !important}" +
      ".lsn-title-block{min-width:0}.lsn-kicker{display:inline-block;color:var(--lsn-accent);background:rgba(99,102,241,0.1);padding:0.15rem 0.5rem;border-radius:4px;font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.35rem}.lsn-title-block h2{margin:0 0 0.4rem!important;color:var(--lsn-ink)!important;font-size:1.35rem!important;font-weight:700!important;line-height:1.2!important;letter-spacing:-0.02em!important}.lsn-links{display:flex;gap:0.75rem;flex-wrap:wrap}.lsn-links a{font-size:0.75rem;font-weight:600;color:var(--lsn-muted);text-decoration:none;transition:color 0.2s ease;display:inline-flex;align-items:center;gap:0.2rem}.lsn-links a:hover{color:var(--lsn-accent)}" +
      ".lsn-actions{display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:flex-end;align-items:center}.lsn-btn,.lsn-segment button{display:inline-flex;min-height:2.25rem;align-items:center;justify-content:center;gap:0.4rem;padding:0.45rem 0.8rem;border:1px solid var(--lsn-line);border-radius:8px;color:var(--lsn-ink);background:var(--lsn-panel);font:inherit;font-size:0.75rem;font-weight:600;line-height:1;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,0.05);transition:all 0.2s cubic-bezier(0.4,0,0.2,1)}.lsn-btn:hover,.lsn-segment button:hover{border-color:var(--lsn-accent);color:var(--lsn-accent);background:var(--lsn-soft);transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,0.1)}.lsn-btn:active,.lsn-segment button:active{transform:translateY(0);scale:0.97}.lsn-btn svg,.lsn-segment svg{width:0.95rem;height:0.95rem;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2}.lsn-primary{border-color:var(--lsn-accent);color:#fff !important;background:var(--lsn-accent)}.lsn-primary:hover{color:#fff !important;background:var(--lsn-accent-hover);border-color:var(--lsn-accent-hover);box-shadow:0 4px 14px var(--lsn-accent-glow)}.lsn-segment{display:inline-flex;gap:0.2rem;padding:0.2rem;border:1px solid var(--lsn-line);border-radius:10px;background:var(--lsn-soft)}.lsn-segment button{min-height:1.85rem;border:0;background:transparent;padding:0.2rem 0.65rem;border-radius:6px;box-shadow:none}.lsn-segment button.is-active,.lsn-btn[aria-pressed='true']{color:#fff !important;background:var(--lsn-accent) !important;box-shadow:0 2px 8px var(--lsn-accent-glow)}" +
      ".lsn-swatches{display:flex;gap:0.4rem;align-items:center}.lsn-swatches button{width:1.35rem;height:1.35rem;padding:0;border:2px solid rgba(0,0,0,0.1);border-radius:50%;background:var(--swatch);cursor:pointer;transition:all 0.2s cubic-bezier(0.4,0,0.2,1);box-shadow:inset 0 1px 3px rgba(0,0,0,0.1)}@media(prefers-color-scheme:dark){.lsn-swatches button{border-color:rgba(255,255,255,0.25)}}.lsn-swatches button:hover{transform:scale(1.15)}.lsn-swatches button.is-active{border-color:var(--lsn-ink);transform:scale(1.2);outline:2px solid var(--lsn-accent);outline-offset:1.5px;box-shadow:0 0 10px var(--swatch)}.lsn-size{display:inline-flex;gap:0.5rem;align-items:center;color:var(--lsn-muted);font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em}.lsn-size input{width:5rem;height:4px;border-radius:999px;accent-color:var(--lsn-accent);cursor:pointer}" +
      ".lsn-stage{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border:1px solid var(--lsn-line);border-radius:12px;background:#0f172a;box-shadow:var(--lsn-shadow)}.lsn-stage:focus{outline:2px solid var(--lsn-accent);outline-offset:2px}.lsn-stage .reveal{position:absolute;inset:0;color:#1e293b;background:#fff}.lsn-stage .reveal .slides{text-align:left}.lsn-stage .reveal .slides section{box-sizing:border-box;padding:48px 64px}.lsn-stage .reveal h1,.lsn-stage .reveal h2,.lsn-stage .reveal h3{letter-spacing:-0.02em;font-weight:700}.lsn-stage .reveal h1{font-size:2em;line-height:1.05;color:#0f172a}.lsn-stage .reveal h2{font-size:1.5em;line-height:1.1;color:#1e293b}.lsn-stage .reveal h3{font-size:1.15em;line-height:1.2;color:#475569}.lsn-stage .reveal p,.lsn-stage .reveal li{font-size:0.78em;line-height:1.45;color:#334155}.lsn-stage .reveal pre{width:100%;font-size:0.45em;border-radius:8px;background:#0b0f19;color:#e2e8f0;border:1px solid rgba(255,255,255,0.05);box-shadow:inset 0 2px 6px rgba(0,0,0,0.5);padding:12px 16px !important}.lsn-stage .reveal code{font-family:'SFMono-Regular',Consolas,monospace}.lsn-stage .reveal blockquote{width:auto;margin:0.75em 0;padding:0.25em 1em;border-left:5px solid var(--lsn-accent);background:rgba(99,102,241,0.05);color:#334155;box-shadow:none;border-radius:0 6px 6px 0}.lsn-stage .reveal table{font-size:0.6em}.lsn-stage .reveal th,.lsn-stage .reveal td{border:1px solid #e2e8f0;padding:0.4em 0.6em}" +
      ".lsn-ink-canvas{position:absolute;inset:0;z-index:32;width:100%;height:100%;pointer-events:none;touch-action:none}.lsn-workspace.is-annotating .lsn-ink-canvas{pointer-events:auto}.lsn-workspace.is-ink-hidden .lsn-ink-canvas{opacity:0}.lsn-footer{display:flex;justify-content:space-between;gap:1rem;margin-top:0.75rem;color:var(--lsn-muted);font-size:0.75rem;font-weight:600}.lsn-status[data-type='error']{color:#ef4444}" +
      ".lsn-workspace.is-presenting,.lsn-workspace:fullscreen{position:fixed;inset:0;z-index:99999;width:100vw;height:100vh;background:#030712;margin:0;padding:0;overflow:hidden}" +
      ".lsn-workspace.is-presenting .lsn-toolbar,.lsn-workspace:fullscreen .lsn-toolbar{position:absolute;top:1.5rem;left:50%;transform:translateX(-50%);z-index:10000;width:auto;max-width:95%;display:flex;justify-content:center;align-items:center;gap:1rem;background:rgba(10,15,30,0.7) !important;backdrop-filter:blur(24px) saturate(180%) !important;-webkit-backdrop-filter:blur(24px) saturate(180%) !important;border:1px solid rgba(255,255,255,0.12) !important;border-radius:9999px !important;box-shadow:0 25px 60px rgba(0,0,0,0.65),inset 0 1px 0 rgba(255,255,255,0.1) !important;padding:0.45rem 1.5rem !important;transition:transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275),opacity 0.3s ease !important}" +
      ".lsn-workspace.is-presenting .lsn-toolbar.lsn-toolbar-hidden,.lsn-workspace:fullscreen .lsn-toolbar.lsn-toolbar-hidden{transform:translate(-50%,-150%) !important;opacity:0 !important}" +
      ".lsn-workspace.is-presenting .lsn-title-block h2,.lsn-workspace:fullscreen .lsn-title-block h2{color:#f8fafc!important;font-size:0.95rem!important;margin:0!important;font-weight:600;letter-spacing:-0.01em}" +
      ".lsn-workspace.is-presenting .lsn-title-block .lsn-kicker,.lsn-workspace:fullscreen .lsn-title-block .lsn-kicker{display:none}" +
      ".lsn-workspace.is-presenting .lsn-title-block .lsn-links,.lsn-workspace:fullscreen .lsn-title-block .lsn-links{display:none}" +
      ".lsn-workspace.is-presenting [data-action='present'],.lsn-workspace:fullscreen [data-action='present']{display:none!important}" +
      ".lsn-workspace.is-presenting [data-action='import-json'],.lsn-workspace:fullscreen [data-action='import-json']{display:none!important}" +
      ".lsn-workspace.is-presenting [data-action='export-json'],.lsn-workspace:fullscreen [data-action='export-json']{display:none!important}" +
      ".lsn-workspace.is-presenting [data-action='export-pdf'],.lsn-workspace:fullscreen [data-action='export-pdf']{display:none!important}" +
      ".lsn-workspace.is-presenting [data-action='export-pptx'],.lsn-workspace:fullscreen [data-action='export-pptx']{display:none!important}" +
      ".lsn-workspace.is-presenting .lsn-exit-present-btn,.lsn-workspace:fullscreen .lsn-exit-present-btn{border-color:rgba(239,68,68,0.4) !important;color:#fca5a5 !important;background:rgba(239,68,68,0.25) !important;border-radius:9999px !important;padding:0.4rem 1rem !important}" +
      ".lsn-workspace.is-presenting .lsn-exit-present-btn:hover,.lsn-workspace:fullscreen .lsn-exit-present-btn:hover{background:rgba(239,68,68,0.5) !important;border-color:rgba(239,68,68,0.7) !important;color:#fff !important;box-shadow:0 4px 12px rgba(239,68,68,0.3) !important}" +
      ".lsn-workspace.is-presenting .lsn-stage,.lsn-workspace:fullscreen .lsn-stage{width:100vw;height:100vh;max-width:100vw;max-height:100vh;border:0;border-radius:0;box-shadow:none;background:#030712;display:flex;align-items:center;justify-content:center}" +
      ".lsn-workspace.is-presenting .lsn-stage .reveal,.lsn-workspace:fullscreen .lsn-stage .reveal{width:100vw!important;height:100vh!important;background:radial-gradient(circle at 50% 50%,#0f172a 0%,#030712 100%);color:#fff}" +
      ".lsn-workspace.is-presenting .reveal .slides section,.lsn-workspace:fullscreen .reveal .slides section{color:#f1f5f9;background:#0b0f19 !important;border:1px solid rgba(99,102,241,0.15);border-radius:16px;padding:60px 80px;box-shadow:0 25px 60px -15px rgba(0,0,0,0.85),0 0 40px rgba(99,102,241,0.05)}" +
      ".lsn-workspace.is-presenting .reveal h1,.lsn-workspace:fullscreen .reveal h1{background:linear-gradient(135deg,#ffffff 30%,#cbd5e1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:#fff}" +
      ".lsn-workspace.is-presenting .reveal h2,.lsn-workspace:fullscreen .reveal h2{background:linear-gradient(135deg,#f8fafc 40%,#94a3b8 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:#fff}" +
      ".lsn-workspace.is-presenting .reveal h3,.lsn-workspace:fullscreen .reveal h3{color:#94a3b8}" +
      ".lsn-workspace.is-presenting .reveal p,.lsn-workspace.is-presenting .reveal li,.lsn-workspace:fullscreen .reveal p,.lsn-workspace:fullscreen .reveal li{color:#cbd5e1}" +
      ".lsn-workspace.is-presenting .reveal pre,.lsn-workspace:fullscreen .reveal pre{background:#05070c;border:1px solid rgba(255,255,255,0.06)}" +
      ".lsn-workspace.is-presenting .lsn-footer,.lsn-workspace:fullscreen .lsn-footer{position:absolute;bottom:1.25rem;left:2rem;right:2rem;z-index:9999;color:rgba(255,255,255,0.35);margin:0;pointer-events:none}" +
      ".lsn-pptx-render-root{position:fixed;left:-20000px;top:0;width:1280px;background:#fff;z-index:-1}" +
      ".lsn-nav-arrow{display:none;position:absolute;top:50%;transform:translateY(-50%);z-index:9990;width:3.5rem;height:3.5rem;border:1px solid rgba(255,255,255,0.1);border-radius:50%;background:rgba(15,23,42,0.45);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:rgba(255,255,255,0.85);cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);padding:0;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,0.25)}" +
      ".lsn-nav-arrow svg{width:1.6rem;height:1.6rem;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}" +
      ".lsn-nav-arrow:hover{background:var(--lsn-accent);border-color:rgba(255,255,255,0.25);color:#fff;transform:translateY(-50%) scale(1.1);box-shadow:0 0 25px var(--lsn-accent-glow)}" +
      ".lsn-nav-arrow:active{transform:translateY(-50%) scale(0.95)}" +
      ".lsn-nav-prev{left:1.5rem}.lsn-nav-next{right:1.5rem}" +
      ".lsn-slide-counter{display:none;position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);z-index:9990;background:rgba(15,23,42,0.6);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:rgba(255,255,255,0.9);font-size:0.85rem;font-weight:600;letter-spacing:0.1em;padding:0.4rem 1rem;border-radius:9999px;border:1px solid rgba(255,255,255,0.1);pointer-events:none;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,0.15)}" +
      ".lsn-counter-sep{margin:0 .3em;opacity:.5}" +
      ".lsn-workspace.is-presenting .lsn-nav-arrow,.lsn-workspace:fullscreen .lsn-nav-arrow{display:flex}" +
      ".lsn-workspace.is-presenting .lsn-slide-counter,.lsn-workspace:fullscreen .lsn-slide-counter{display:block}" +
      ".lsn-workspace.is-presenting.is-annotating .lsn-nav-arrow,.lsn-workspace:fullscreen.is-annotating .lsn-nav-arrow{opacity:0.65;pointer-events:auto}" +
      ".lsn-workspace.is-presenting.is-annotating .lsn-nav-arrow:hover,.lsn-workspace:fullscreen.is-annotating .lsn-nav-arrow:hover{opacity:1}" +
      ".lsn-progress-bar-wrap{position:absolute;bottom:0;left:0;right:0;height:4px;background:rgba(255,255,255,0.08);z-index:9995;pointer-events:none}" +
      ".lsn-progress-bar{height:100%;background:linear-gradient(90deg,var(--lsn-accent),#a855f7);width:0%;transition:width 0.3s cubic-bezier(0.4,0,0.2,1)}" +
      EXPORT_CSS +
      "@media(max-width:840px){.lsn-toolbar{grid-template-columns:1fr}.lsn-actions{justify-content:flex-start}.lsn-btn span,.lsn-segment span{display:none}.lsn-stage .reveal .slides section{padding:30px 34px}.lsn-stage .reveal h1{font-size:1.35em}.lsn-stage .reveal h2{font-size:1.12em}.lsn-stage .reveal p,.lsn-stage .reveal li{font-size:.58em}.lsn-footer{flex-direction:column;gap:.2rem}}";
    document.head.appendChild(style);
  }

  function plugin(hook) {
    hook.beforeEach(registerDeckBlocks);
    hook.doneEach(enhanceDecks);
  }

  if (window.$docsify && Object.keys(window.$docsify).length > 0) {
    window.$docsify.plugins = [plugin].concat(window.$docsify.plugins || []);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceDecks);
  } else {
    enhanceDecks();
  }
})();
