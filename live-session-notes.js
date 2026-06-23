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
      '<button type="button" class="lsn-btn" data-action="annotate" aria-pressed="false">' + svg("annotate") + "<span>Annotate</span></button>" +
      '<div class="lsn-segment" aria-label="Annotation visibility">' +
      '<button type="button" data-mode="annotations" data-value="show">' + svg("eye") + "<span>With</span></button>" +
      '<button type="button" data-mode="annotations" data-value="hide">' + svg("eyeOff") + "<span>Without</span></button>" +
      "</div>" +
      '<div class="lsn-segment" aria-label="Drawing tool">' +
      '<button type="button" data-tool="pen">Pen</button>' +
      '<button type="button" data-tool="highlighter">Highlighter</button>' +
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
    ctx.strokeStyle = stroke.color || DEFAULT_COLOR;
    ctx.globalAlpha = stroke.tool === "highlighter" ? 0.32 : 1;
    ctx.lineWidth = stroke.tool === "highlighter" ? (stroke.size || 5) * 3 : stroke.size || 5;
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
    setTimeout(function () {
      if (state.deck && state.deck.layout) state.deck.layout();
      resizeCanvas(state);
    }, 150);
  }

  function bindControls(state) {
    var actions = state.el.querySelector(".lsn-actions");
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
      if (!actionButton) return;
      var action = actionButton.getAttribute("data-action");
      if (action === "prev" && state.deck) state.deck.prev();
      if (action === "next" && state.deck) state.deck.next();
      if (action === "present") enterPresentation(state);
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
    var textarea = sourceEl.querySelector("textarea[data-live-session-slides]");
    var raw = registered ? registered.raw : (textarea ? (textarea.value || textarea.textContent) : "");
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
      ":root{--lsn-accent:#dc3545;--lsn-ink:#172033;--lsn-muted:#64748b;--lsn-line:#d9e2ec;--lsn-soft:#f8fafc;--lsn-panel:#fff;--lsn-shadow:0 16px 36px rgba(15,23,42,.12)}" +
      "@media(prefers-color-scheme:dark){:root{--lsn-ink:#f8fafc;--lsn-muted:#94a3b8;--lsn-line:rgba(148,163,184,.22);--lsn-soft:#111827;--lsn-panel:#0f172a;--lsn-shadow:0 20px 48px rgba(0,0,0,.35)}} " +
      ".lsn-workspace{width:100%;margin:1.5rem 0 2.5rem;color:var(--lsn-ink)}" +
      ".lsn-toolbar{display:grid;grid-template-columns:minmax(14rem,1fr) minmax(0,2.2fr);gap:1rem;align-items:start;margin-bottom:.75rem;padding:.85rem;border:1px solid var(--lsn-line);border-radius:8px;background:var(--lsn-panel);box-shadow:var(--lsn-shadow)}" +
      ".lsn-title-block{min-width:0}.lsn-kicker{display:block;color:var(--lsn-muted);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.lsn-title-block h2{margin:.12rem 0 .35rem!important;color:var(--lsn-ink)!important;font-size:1.25rem!important;line-height:1.18!important;letter-spacing:0!important}.lsn-links{display:flex;gap:.5rem;flex-wrap:wrap}.lsn-links a{font-size:.78rem;font-weight:800;color:var(--lsn-accent);text-decoration:none}" +
      ".lsn-actions{display:flex;flex-wrap:wrap;gap:.42rem;justify-content:flex-end;align-items:center}.lsn-btn,.lsn-segment button{display:inline-flex;min-height:2rem;align-items:center;justify-content:center;gap:.32rem;padding:.38rem .58rem;border:1px solid var(--lsn-line);border-radius:6px;color:var(--lsn-ink);background:var(--lsn-panel);font:inherit;font-size:.74rem;font-weight:800;line-height:1;cursor:pointer}.lsn-btn:hover,.lsn-segment button:hover{border-color:var(--lsn-accent);color:var(--lsn-accent)}.lsn-btn svg,.lsn-segment svg{width:.95rem;height:.95rem;fill:none;stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2}.lsn-primary{border-color:var(--lsn-accent);color:#fff;background:var(--lsn-accent)}.lsn-primary:hover{color:#fff;background:#b91c1c}.lsn-segment{display:inline-flex;gap:.16rem;padding:.16rem;border:1px solid var(--lsn-line);border-radius:7px;background:var(--lsn-soft)}.lsn-segment button{min-height:1.72rem;border:0;background:transparent}.lsn-segment button.is-active,.lsn-btn[aria-pressed='true']{color:#fff;background:var(--lsn-accent)}" +
      ".lsn-swatches{display:flex;gap:.28rem;align-items:center}.lsn-swatches button{width:1.5rem;height:1.5rem;padding:0;border:2px solid var(--lsn-line);border-radius:50%;background:var(--swatch);cursor:pointer}.lsn-swatches button.is-active{border-color:var(--lsn-ink);outline:2px solid color-mix(in srgb,var(--swatch) 35%,transparent);outline-offset:1px}.lsn-size{display:inline-flex;gap:.35rem;align-items:center;color:var(--lsn-muted);font-size:.72rem;font-weight:800}.lsn-size input{width:4.8rem;accent-color:var(--lsn-accent)}" +
      ".lsn-stage{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border:1px solid var(--lsn-line);border-radius:8px;background:#111827;box-shadow:var(--lsn-shadow)}.lsn-stage:focus{outline:2px solid var(--lsn-accent);outline-offset:2px}.lsn-stage .reveal{position:absolute;inset:0;color:#182033;background:#fff}.lsn-stage .reveal .slides{text-align:left}.lsn-stage .reveal .slides section{box-sizing:border-box;padding:42px 56px}.lsn-stage .reveal h1,.lsn-stage .reveal h2,.lsn-stage .reveal h3{letter-spacing:0}.lsn-stage .reveal h1{font-size:1.82em;line-height:1.04}.lsn-stage .reveal h2{font-size:1.48em;line-height:1.08}.lsn-stage .reveal h3{font-size:1.08em;line-height:1.14;color:#374151}.lsn-stage .reveal p,.lsn-stage .reveal li{font-size:.74em;line-height:1.32}.lsn-stage .reveal pre{width:100%;font-size:.42em;border-radius:8px;background:#0f172a;color:#e5e7eb}.lsn-stage .reveal code{font-family:'SFMono-Regular',Consolas,monospace}.lsn-stage .reveal blockquote{width:auto;margin:.5em 0;padding:.1em .8em;border-left:8px solid var(--lsn-accent);background:#fff5f5;color:#374151;box-shadow:none}.lsn-stage .reveal table{font-size:.55em}.lsn-stage .reveal th,.lsn-stage .reveal td{border:1px solid #d9e2ec;padding:.32em .45em}" +
      ".lsn-ink-canvas{position:absolute;inset:0;z-index:32;width:100%;height:100%;pointer-events:none;touch-action:none}.lsn-workspace.is-annotating .lsn-ink-canvas{pointer-events:auto;cursor:crosshair}.lsn-workspace.is-ink-hidden .lsn-ink-canvas{opacity:0}.lsn-footer{display:flex;justify-content:space-between;gap:1rem;margin-top:.55rem;color:var(--lsn-muted);font-size:.78rem;font-weight:700}.lsn-status[data-type='error']{color:var(--lsn-accent)}" +
      ".lsn-workspace.is-presenting,.lsn-workspace:fullscreen{position:fixed;inset:0;z-index:99999;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:.75rem;width:auto;margin:0;padding:.85rem;background:#0b0f19}.lsn-workspace.is-presenting .lsn-toolbar,.lsn-workspace:fullscreen .lsn-toolbar{margin:0;background:#111827;color:#f8fafc;border-color:rgba(255,255,255,.16);box-shadow:none}.lsn-workspace.is-presenting .lsn-title-block h2,.lsn-workspace:fullscreen .lsn-title-block h2{color:#f8fafc!important}.lsn-workspace.is-presenting .lsn-stage,.lsn-workspace:fullscreen .lsn-stage{align-self:center;justify-self:center;width:min(100%,calc((100vh - 8rem) * 16 / 9));max-height:calc(100vh - 8rem)}.lsn-workspace.is-presenting .lsn-footer,.lsn-workspace:fullscreen .lsn-footer{color:#cbd5e1;margin:0}" +
      ".lsn-pptx-render-root{position:fixed;left:-20000px;top:0;width:1280px;background:#fff;z-index:-1}" +
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
