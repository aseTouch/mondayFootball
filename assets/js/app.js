/* شروط وقوانين الجروب — viewer */
(function () {
  "use strict";

  // Edit titles here. Image files live in images/web (display), images/full (download), images/thumbs (sidebar).
  var SLIDES = [
    { file: "rules-1-of-6", title: "قواعد عامة للجروب",      w: 1200, h: 1835 },
    { file: "rules-2-of-6", title: "التسجيل في اللعب",       w: 1200, h: 1500 },
    { file: "rules-3-of-6", title: "الغرامات",               w: 1200, h: 2296 },
    { file: "rules-4-of-6", title: "نظام تقسيم الفرق",       w: 1200, h: 1837 },
    { file: "rules-5-of-6", title: "السلوك جوه الملعب",      w: 1200, h: 2147 },
    { file: "rules-6-of-6", title: "التنظيم الإداري للجروب", w: 1200, h: 1907 }
  ];
  var N = SLIDES.length, cur = 0;
  var $ = function (id) { return document.getElementById(id); };
  var web = function (s) { return "images/web/" + s.file + ".webp"; };
  var full = function (s) { return "images/full/" + s.file + ".png"; };
  var thumb = function (s) { return "images/thumbs/" + s.file + ".webp"; };

  // ---------- build sidebar + progress ----------
  var toc = $("tocList"), prog = $("progress");
  $("tocCount").textContent = N + " أقسام";
  SLIDES.forEach(function (s, i) {
    var li = document.createElement("li");
    li.innerHTML =
      '<button class="toc-item" type="button" data-go="' + i + '">' +
      '<img src="' + thumb(s) + '" width="52" height="52" alt="" loading="lazy">' +
      '<span class="t"><small>القسم ' + (i + 1) + '</small><strong>' + s.title + '</strong></span></button>';
    toc.appendChild(li);

    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("data-go", i); b.setAttribute("aria-label", s.title);
    prog.appendChild(b);
  });
  var tocItems = toc.querySelectorAll(".toc-item"), bars = prog.querySelectorAll("button");

  // ---------- render ----------
  var img = $("vImg"), inner = $("stageInner");
  function go(i, opts) {
    cur = (i + N) % N;
    var s = SLIDES[cur];
    inner.classList.add("loading");
    var pre = new Image();
    pre.onload = pre.onerror = function () {
      img.src = web(s); img.width = s.w; img.height = s.h; img.alt = s.title + " — شروط وقوانين الجروب";
      inner.classList.remove("loading");
    };
    pre.src = web(s);

    $("vTitle").textContent = s.title;
    $("vStep").textContent = "القسم " + (cur + 1) + " من " + N;
    $("mCount").textContent = (cur + 1) + " / " + N;
    $("vDownload").href = full(s);
    $("vDownload").setAttribute("download", s.file + ".png");

    tocItems.forEach(function (t, k) { t.setAttribute("aria-current", k === cur ? "true" : "false"); });
    bars.forEach(function (b, k) { b.className = k === cur ? "on" : (k < cur ? "done" : ""); });
    var active = tocItems[cur];
    if (active && window.matchMedia("(max-width:980px)").matches) {
      active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }

    if (history.replaceState) history.replaceState(null, "", "#s" + (cur + 1));
    if (lb.classList.contains("open")) showLb();
    // preload neighbours
    [cur + 1, cur - 1].forEach(function (k) { var p = new Image(); p.src = web(SLIDES[(k + N) % N]); });

    if (opts && opts.scroll) {
      var top = document.querySelector(".viewer").getBoundingClientRect().top + window.pageYOffset - 12;
      if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: "smooth" });
    }
  }

  // ---------- events ----------
  document.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-go]"))) go(+t.getAttribute("data-go"), { scroll: true });
    else if (e.target.closest("[data-next]")) go(cur + 1, { scroll: true });
    else if (e.target.closest("[data-prev]")) go(cur - 1, { scroll: true });
    else if (e.target.closest("[data-share-page]")) sharePage();
  });
  $("vShare").addEventListener("click", function () { shareSlide(cur); });
  $("vExpand").addEventListener("click", openLb);
  inner.addEventListener("click", openLb);
  inner.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(); } });

  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input,textarea")) return;
    if (e.key === "ArrowLeft") go(cur + 1);    // RTL: left = next
    if (e.key === "ArrowRight") go(cur - 1);
    if (e.key === "Escape" && lb.classList.contains("open")) closeLb();
  });

  // swipe on image (RTL)
  [inner, $("lbStage")].forEach(function (el) {
    var sx = null, sy = null;
    el.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx > 0 ? 1 : -1));
    });
  });

  // ---------- lightbox ----------
  var lb = $("lb"), lbImg = $("lbImg"), lastFocus = null;
  function showLb() {
    var s = SLIDES[cur];
    lbImg.src = full(s); lbImg.alt = s.title;
    $("lbTitle").textContent = (cur + 1) + " من " + N + " · " + s.title;
    $("lbStage").scrollTop = 0;
  }
  function openLb() { lastFocus = document.activeElement; showLb(); lb.classList.add("open"); document.body.style.overflow = "hidden"; lb.querySelector("[data-lb-close]").focus(); }
  function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  lb.querySelector("[data-lb-close]").addEventListener("click", closeLb);

  // ---------- share ----------
  var toastEl = $("toast"), tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove("show"); }, 2200); }
  function url(h) { return location.href.split("#")[0] + (h || ""); }
  function copy(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast("تم نسخ الرابط"); }, function () { toast(t); });
    else toast(t);
  }
  function sharePage() {
    if (navigator.share) navigator.share({ title: document.title, url: url() }).catch(function () {});
    else copy(url());
  }
  function shareSlide(i) {
    var s = SLIDES[i], link = url("#s" + (i + 1));
    var fallback = function () { if (navigator.share) navigator.share({ title: s.title, url: link }).catch(function () {}); else copy(link); };
    if (!(navigator.canShare && window.fetch && window.File)) return fallback();
    fetch(full(s)).then(function (r) { return r.blob(); }).then(function (b) {
      var f = new File([b], s.file + ".png", { type: "image/png" });
      if (!navigator.canShare({ files: [f] })) throw new Error("nofiles");
      return navigator.share({ files: [f], title: s.title });
    }).catch(function (e) { if (!e || e.name !== "AbortError") fallback(); });
  }

  // ---------- init ----------
  var m = /^#s(\d+)$/.exec(location.hash);
  go(m ? Math.min(Math.max(+m[1] - 1, 0), N - 1) : 0);
})();
