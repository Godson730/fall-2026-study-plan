(function () {
  "use strict";

  var P = window.PLAN;
  var COURSES = P.COURSES, WEEKS = P.WEEKS, EXAM = P.EXAM, SETUP = P.SETUP, EXAM_TASKS = P.EXAM_TASKS, BOOKS = P.BOOKS;
  var LS_STATE = "studyplan-state-v1";
  var LS_UI = "studyplan-ui-v1";
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  /* ---------- saved progress ---------- */

  function norm(s) {
    s = s && typeof s === "object" ? s : {};
    var done = {}, dates = {};
    if (s.done && typeof s.done === "object") {
      Object.keys(s.done).forEach(function (k) {
        if (s.done[k] === true && /^[a-z0-9-]{1,40}$/.test(k)) done[k] = true;
      });
    }
    if (s.dates && typeof s.dates === "object") {
      Object.keys(s.dates).forEach(function (k) {
        if (/^c\d{4}-(mid|final)$/.test(k) && DATE_RE.test(s.dates[k])) dates[k] = s.dates[k];
      });
    }
    return { v: 1, updated: Number(s.updated) || 0, done: done, dates: dates };
  }

  var state;
  try { state = norm(JSON.parse(localStorage.getItem(LS_STATE))); } catch (e) { state = norm({}); }
  var prefs;
  try { prefs = JSON.parse(localStorage.getItem(LS_UI)) || {}; } catch (e) { prefs = {}; }

  function save() {
    state.updated = Date.now();
    try { localStorage.setItem(LS_STATE, JSON.stringify(state)); }
    catch (e) { toast("Your ticks couldn’t be saved. Check that this browser allows site storage."); }
  }
  function savePrefs() {
    try { localStorage.setItem(LS_UI, JSON.stringify(prefs)); } catch (e) {}
  }

  /* ---------- helpers ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function day(iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function pretty(iso) { var d = day(iso); return WEEKDAYS[d.getDay()] + " " + MONTHS[d.getMonth()] + " " + d.getDate(); }
  function daysUntil(iso) { return Math.round((day(iso).getTime() - today().getTime()) / 86400000); }
  function untilText(n) {
    if (n === 0) return "today";
    if (n === 1) return "tomorrow";
    if (n > 1) return "in " + n + " days";
    if (n === -1) return "yesterday";
    return Math.abs(n) + " days ago";
  }

  function periodIndex(d) {
    var t = d.getTime();
    if (t < day(WEEKS[0].start).getTime()) return -1;
    for (var i = 0; i < WEEKS.length; i++) {
      if (t >= day(WEEKS[i].start).getTime() && t <= day(WEEKS[i].end).getTime()) return i;
    }
    if (t >= day(EXAM.start).getTime() && t <= day(EXAM.end).getTime()) return WEEKS.length;
    return WEEKS.length + 1;
  }
  function nowIndex() { return periodIndex(today()); }
  function defaultWeek() { return Math.max(0, Math.min(WEEKS.length - 1, nowIndex())); }

  function course(key) { return COURSES.filter(function (c) { return c.key === key; })[0]; }
  function weekIds(w) { return COURSES.map(function (c) { return "w" + w.n + "-" + c.key; }); }
  function examIds(key) { return EXAM_TASKS.map(function (t) { return "exam-" + key + "-" + t.id; }); }
  function courseIds(key) { return WEEKS.map(function (w) { return "w" + w.n + "-" + key; }).concat(examIds(key)); }
  function allIds() {
    var ids = [];
    WEEKS.forEach(function (w) { ids = ids.concat(weekIds(w)); });
    SETUP.forEach(function (s) { ids.push(s.id); });
    COURSES.forEach(function (c) { ids = ids.concat(examIds(c.key)); });
    return ids;
  }
  function countDone(ids) { return ids.filter(function (id) { return state.done[id]; }).length; }
  function chk(id) { return state.done[id] ? " checked" : ""; }
  function doneCls(id) { return state.done[id] ? " is-done" : ""; }

  function isStandalone() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }

  var ICON = {
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  /* ---------- app state ---------- */

  var tab = "week";
  var weekIdx = defaultWeek();
  var installEvent = null;

  var bar = document.getElementById("appbar");
  var view = document.getElementById("view");

  /* ---------- shared bits ---------- */

  function pipsHtml(w) {
    return '<span class="pips" aria-hidden="true">' + COURSES.map(function (c) {
      return '<i class="pip ' + c.key + (state.done["w" + w.n + "-" + c.key] ? " on" : "") + '"></i>';
    }).join("") + "</span>";
  }

  function marksFor(index) {
    var h = "";
    COURSES.forEach(function (c) {
      ["mid", "final"].forEach(function (kind) {
        var v = state.dates[c.key + "-" + kind];
        if (v && periodIndex(day(v)) === index) {
          h += '<span class="mark ' + c.key + '">' + (kind === "mid" ? "mid" : "exam") + "</span>";
        }
      });
    });
    return h;
  }

  function upcoming() {
    var list = [];
    COURSES.forEach(function (c) {
      ["mid", "final"].forEach(function (kind) {
        var v = state.dates[c.key + "-" + kind];
        if (v && daysUntil(v) >= 0) list.push({ c: c, kind: kind, iso: v, n: daysUntil(v) });
      });
    });
    list.sort(function (a, b) { return a.n - b.n; });
    return list[0] || null;
  }

  function installBanner() {
    if (isStandalone() || prefs.hideInstall) return "";
    return '<div class="banner"><p><b>Put this plan on your home screen</b>It then opens like an app and works offline.</p>' +
      '<button type="button" class="linkbtn" data-act="tab" data-tab="guide">Show me how</button>' +
      '<button type="button" class="x" data-act="hide-install" aria-label="Dismiss">' + ICON.close + "</button></div>";
  }

  /* ---------- Week tab ---------- */

  function weekTab() {
    var w = WEEKS[weekIdx], ni = nowIndex(), isNow = weekIdx === ni;
    var d = countDone(weekIds(w));

    var top = '<button type="button" class="iconbtn" data-act="prev" aria-label="Previous week"' + (weekIdx === 0 ? " disabled" : "") + ">" + ICON.left + "</button>" +
      '<div class="ab-mid"><h1 class="ab-title">Week ' + w.n + '</h1><p class="ab-sub">' + esc(w.dates) + "</p></div>" +
      '<button type="button" class="iconbtn" data-act="next" aria-label="Next week"' + (weekIdx === WEEKS.length - 1 ? " disabled" : "") + ">" + ICON.right + "</button>";

    var status;
    if (isNow) status = '<span class="now-tag">This week</span>';
    else if (ni >= 0 && ni < WEEKS.length) status = '<button type="button" class="linkbtn" data-act="today">Back to this week</button>';
    else if (ni < 0) status = '<span class="sub">Classes start Thu Sep 10</span>';
    else status = '<span class="sub">Classes have ended</span>';

    var h = installBanner();
    h += '<section class="wk-top" aria-label="Week summary"><div class="wk-status">' + status +
      '<p class="wk-count">' + pipsHtml(w) + d + " of 4 done</p></div>";
    if (w.note) h += '<p class="wk-note">' + esc(w.note) + "</p>";
    var next = upcoming();
    if (next) {
      h += '<p class="nextup"><span><span class="label">Next date</span><br><b>' + esc(next.c.code) + "</b> " +
        (next.kind === "mid" ? "midterm" : "final exam") + " · " + esc(pretty(next.iso)) + '</span><span class="when">' + untilText(next.n) + "</span></p>";
    } else if (weekIdx < 4) {
      h += '<p class="nextup"><span>Add your midterm and exam dates to see a countdown.</span><button type="button" class="linkbtn" data-act="tab" data-tab="exams">Add dates</button></p>';
    }
    h += "</section>";

    h += '<ul class="cards" aria-label="Tasks">';
    COURSES.forEach(function (c) {
      var t = w.tasks[c.key], id = "w" + w.n + "-" + c.key;
      var reads = t.r.map(function (r) { return '<span><span class="book">' + esc(r[0]) + "</span>" + esc(r[1]) + "</span>"; }).join("");
      h += '<li><label class="card ' + c.key + doneCls(id) + '">' +
        '<span class="card-top"><span class="code"><i class="dot"></i>' + esc(c.code) + "</span>" +
        '<input type="checkbox" class="check" data-task="' + id + '"' + chk(id) + ' aria-label="Done: ' + esc(c.code + ", " + t.t) + '"></span>' +
        '<span class="topic">' + esc(t.t) + "</span>" +
        '<span class="reads">' + reads + "</span>" +
        '<span class="do"><span class="label">Practise</span>' + esc(t.d) + "</span>" +
        "</label></li>";
    });
    h += "</ul>";

    if (w.link) {
      var glyph = w.link.c.map(function (k) { return '<i class="dot ' + k + '"></i>'; }).join('<i class="ln"></i>');
      var names = w.link.c.map(function (k) { return course(k).code; }).join(" ↔ ");
      h += '<div class="link"><span class="glyph" aria-hidden="true">' + glyph + '</span><p><span class="label">Link · ' + esc(names) + "</span>" + esc(w.link.x) + "</p></div>";
    }

    if (w.n === 1) {
      h += '<section class="section"><h2>Set up this week</h2><div class="rows">';
      SETUP.forEach(function (s) {
        h += '<label class="row' + doneCls(s.id) + '"><input type="checkbox" class="check sm" data-task="' + s.id + '"' + chk(s.id) + "><span>" + esc(s.x) + "</span></label>";
      });
      h += "</div></section>";
    }
    return { top: top, body: h, plain: false };
  }

  /* ---------- Semester tab ---------- */

  function semesterTab() {
    var ids = allIds(), ni = nowIndex();
    var h = '<section class="summary" aria-label="Progress"><p class="label">Done so far</p>' +
      '<p class="big"><span class="big-n">' + countDone(ids) + '</span><span class="big-of">of ' + ids.length + " tasks</span></p><div class=\"bars\">";
    COURSES.forEach(function (c) {
      var cids = courseIds(c.key), d = countDone(cids);
      h += '<div class="bar-row ' + c.key + '"><span class="code"><i class="dot"></i>' + esc(c.code) + "</span>" +
        '<span class="count">' + d + "/" + cids.length + "</span>" +
        '<span class="bar" role="img" aria-label="' + esc(c.code) + ": " + d + " of " + cids.length + ' done"><i style="width:' + Math.round(d / cids.length * 100) + '%"></i></span></div>';
    });
    h += "</div></section>";

    h += '<section class="section"><h2>Weeks</h2><div class="weeks">';
    WEEKS.forEach(function (w, i) {
      var d = countDone(weekIds(w));
      var topics = COURSES.map(function (c) { return w.tasks[c.key].t; }).join(" · ");
      h += '<button type="button" class="wrow' + (i === ni ? " is-now" : "") + '" data-act="open-week" data-i="' + i + '" aria-label="Week ' + w.n + ", " + esc(w.dates) + ", " + d + ' of 4 done">' +
        '<span class="n">' + w.n + "</span>" +
        '<span><span class="d">' + esc(w.dates) + '</span><span class="t">' + esc(topics) + "</span></span>" +
        '<span class="right">' + pipsHtml(w) + '<span class="marks">' + marksFor(i) + "</span></span>" + ICON.right + "</button>";
      if (w.n === 4) h += '<div class="brow">Fall break · Oct 12–13</div>';
    });
    var eDone = COURSES.reduce(function (n, c) { return n + countDone(examIds(c.key)); }, 0);
    h += '<button type="button" class="wrow' + (ni === WEEKS.length ? " is-now" : "") + '" data-act="tab" data-tab="exams">' +
      '<span class="n">✓</span><span><span class="d">Exams · Dec 7 – 22</span><span class="t">' + eDone + " of " + COURSES.length * EXAM_TASKS.length + ' prep tasks done</span></span>' +
      '<span class="right"><span class="marks">' + marksFor(WEEKS.length) + "</span></span>" + ICON.right + "</button>";
    h += "</div></section>";

    return { top: '<div class="ab-mid"><h1 class="ab-title">Semester</h1><p class="ab-sub">Fall 2026 · Sep 10 – Dec 22</p></div>', body: h, plain: true };
  }

  /* ---------- Exams tab ---------- */

  function examsTab() {
    var h = '<section class="section"><h2>Your dates</h2><p class="sub">Copy these from each CourseLink outline and the final exam schedule.</p><div class="dates">';
    COURSES.forEach(function (c) {
      h += '<div class="dcard ' + c.key + '"><span class="code"><i class="dot"></i>' + esc(c.code) + " · " + esc(c.name) + '</span><div class="dfields">';
      [["mid", "Midterm", "2026-09-10"], ["final", "Final exam", "2026-12-01"]].forEach(function (f) {
        var key = c.key + "-" + f[0], v = state.dates[key] || "", n = v ? daysUntil(v) : null;
        h += '<label class="dfield"><span class="label">' + f[1] + "</span>" +
          '<input type="date" min="' + f[2] + '" max="2026-12-22" data-date="' + key + '" value="' + esc(v) + '">' +
          '<span class="until' + (n !== null && n >= 0 && n <= 7 ? " soon" : "") + '">' + (v ? untilText(n) : "") + "</span></label>";
      });
      h += "</div></div>";
    });
    h += "</div></section>";

    h += '<section class="section"><h2>Exam prep checklist</h2>';
    COURSES.forEach(function (c) {
      h += '<div class="egroup ' + c.key + '"><span class="code"><i class="dot"></i>' + esc(c.code) + '</span><div class="rows">';
      EXAM_TASKS.forEach(function (t) {
        var id = "exam-" + c.key + "-" + t.id;
        h += '<label class="row' + doneCls(id) + '"><input type="checkbox" class="check sm" data-task="' + id + '"' + chk(id) + ' aria-label="Done: ' + esc(c.code + ", " + t.x) + '"><span>' + esc(t.x) + "</span></label>";
      });
      h += "</div></div>";
    });
    h += "</section>";

    h += '<section class="section"><h2>Countdown plan</h2><dl class="plan">' +
      "<div><dt>Dec 5–6</dt><dd>Turn your weekly notes into one summary page per course, and list your weakest topics.</dd></div>" +
      "<div><dt>3 days out</dt><dd>Redo every problem you marked wrong.</dd></div>" +
      "<div><dt>2 days out</dt><dd>Timed mock exam: mixed end-of-chapter problems, closed book, real exam length.</dd></div>" +
      "<div><dt>Day before</dt><dd>Summary sheet and flashcards only. Stop by evening and sleep.</dd></div>" +
      "<div><dt>Between exams</dt><dd>Alternate courses so none goes more than three days without review.</dd></div>" +
      "</dl></section>";

    h += '<section class="section"><h2>Semester dates</h2><dl class="fixed">' +
      "<dt>Thu Sep 10</dt><dd>Classes start</dd>" +
      "<dt>Fri Sep 18</dt><dd>Last day to add a course</dd>" +
      "<dt>Oct 12–13</dt><dd>Fall break, no classes</dd>" +
      "<dt>Fri Dec 4</dt><dd>Classes end; last day to drop</dd>" +
      "<dt>Dec 7–22</dt><dd>Final exam period</dd>" +
      "</dl></section>";

    return { top: '<div class="ab-mid"><h1 class="ab-title">Exams</h1><p class="ab-sub">Final exam period · Dec 7 – 22</p></div>', body: h, plain: true };
  }

  /* ---------- Guide tab ---------- */

  function guideTab() {
    var h = "";
    if (!isStandalone()) {
      h += '<section class="install" aria-labelledby="h-install"><h2 class="ab-title" id="h-install">Install on your phone</h2>';
      if (installEvent) {
        h += '<div class="btns"><button type="button" class="btn" data-act="install">Install app</button></div>';
      }
      h += (isIOS() ? "" : "") +
        "<div><h3>iPhone (Safari)</h3><ol><li>Tap the Share button.</li><li>Scroll down and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>.</li></ol></div>" +
        "<div><h3>Android (Chrome)</h3><ol><li>Tap the ⋮ menu at the top right.</li><li>Tap <b>Install app</b> or <b>Add to Home screen</b>.</li><li>Tap <b>Install</b>.</li></ol></div>" +
        "</section>";
    }

    h += '<section class="section"><h2>A study week</h2><p class="sub">About six hours per course, roughly 24 hours a week. Do the steps in order.</p><ol class="loop">' +
      '<li><b>Preview<span class="hrs">20 min</span></b><p>Read the section headings and the end-of-chapter summary first.</p></li>' +
      '<li><b>Read<span class="hrs">2 h</span></b><p>After each worked example, close the book and redo it yourself.</p></li>' +
      '<li><b>Practise<span class="hrs">2.5 h</span></b><p>Do the week’s problem set. OpenStax answers are at the back of each book; Soderberg’s are in the two solutions files.</p></li>' +
      '<li><b>Recall<span class="hrs">1 h</span></b><p>With everything closed, write the mechanisms, equations or steps from memory, then check.</p></li>' +
      "</ol></section>";

    h += '<section class="section"><h2>Day plan</h2><dl class="days">' +
      "<dt>Mon</dt><dd>CHEM*1050 and IPS*1500</dd>" +
      "<dt>Tue</dt><dd>CHEM*2700 and BIOC*2580</dd>" +
      "<dt>Wed</dt><dd>CHEM*1050 and IPS*1500</dd>" +
      "<dt>Thu</dt><dd>CHEM*2700 and BIOC*2580</dd>" +
      "<dt>Fri</dt><dd>Problem sets for whichever course is behind</dd>" +
      "<dt>Sat</dt><dd>IPS*1500 practice and BIOC*2580 flashcards</dd>" +
      "<dt>Sun</dt><dd>45-minute review of the last two weeks, then read next week’s topics</dd>" +
      "</dl></section>";

    h += '<section class="section"><h2>Your books</h2><p class="sub">Short names used in each week. The PDFs are in Downloads\\Textbooks on your laptop.</p><ul class="books">';
    BOOKS.forEach(function (b) {
      h += '<li><span class="ttl"><span class="book">' + esc(b[0]) + "</span>" + esc(b[1]) + '</span><span class="meta"><span>' + esc(b[2] === "online only" ? "online only" : "Textbooks\\" + b[2]) +
        '</span><a href="' + esc(b[3]) + '" target="_blank" rel="noopener">Read online</a></span></li>';
    });
    h += "</ul></section>";

    h += '<section class="section" aria-labelledby="h-move"><h2 id="h-move">Move your ticks</h2>' +
      '<p class="sub">Ticks and dates are saved on this device only. To copy them to another phone or browser, copy your progress code here and paste it there. Ticks are added, never removed.</p>' +
      '<div class="btns"><button type="button" class="btn" data-act="copy-code">Copy progress code</button></div>' +
      '<label class="label" for="code-in">Paste a code from another device</label>' +
      '<textarea id="code-in" spellcheck="false" autocomplete="off" placeholder="SP1-…"></textarea>' +
      '<div class="btns"><button type="button" class="btn ghost" data-act="import-code">Add ticks from code</button></div></section>';

    h += '<section class="notes"><p>Semester dates come from the University of Guelph Fall 2026 undergraduate schedule of dates. Topics follow each course’s calendar description; if your instructor’s CourseLink outline covers something in a different week, follow the outline.</p>' +
      "<p>§ marks a section number in the book named beside it.</p></section>";

    return { top: '<div class="ab-mid"><h1 class="ab-title">Guide</h1><p class="ab-sub">How to study · books · install</p></div>', body: h, plain: true };
  }

  /* ---------- render ---------- */

  var TABS = { week: weekTab, semester: semesterTab, exams: examsTab, guide: guideTab };

  function render(opts) {
    var r = TABS[tab]();
    bar.className = "appbar" + (r.plain ? " plain" : "");
    bar.innerHTML = r.top;
    view.innerHTML = r.body;
    document.querySelectorAll(".tab").forEach(function (b) {
      if (b.getAttribute("data-tab") === tab) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    if (opts && opts.top) window.scrollTo(0, 0);
  }

  function go(newTab) {
    if (newTab === "week" && tab !== "week") weekIdx = defaultWeek();
    tab = newTab;
    render({ top: true });
    view.focus({ preventScroll: true });
  }

  function stepWeek(delta) {
    var n = weekIdx + delta;
    if (n < 0 || n >= WEEKS.length) return;
    weekIdx = n;
    render({ top: true });
  }

  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }

  /* ---------- progress codes ---------- */

  function makeCode() {
    var payload = JSON.stringify({ d: Object.keys(state.done), t: state.dates, u: state.updated });
    return "SP1-" + btoa(unescape(encodeURIComponent(payload)));
  }
  function readCode(str) {
    str = String(str || "").replace(/\s+/g, "");
    if (str.indexOf("SP1-") !== 0) return null;
    try {
      var o = JSON.parse(decodeURIComponent(escape(atob(str.slice(4)))));
      var done = {};
      (Array.isArray(o.d) ? o.d : []).forEach(function (k) { done[k] = true; });
      return norm({ done: done, dates: o.t, updated: o.u });
    } catch (e) { return null; }
  }

  function copyCode() {
    var code = makeCode();
    var box = document.getElementById("code-in");
    function fallback() {
      if (!box) return;
      box.value = code;
      box.focus();
      box.select();
      toast("Code is in the box below. Copy it, then paste it on the other device.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function () { toast("Progress code copied"); }, fallback);
    } else {
      fallback();
    }
  }

  function importCode() {
    var box = document.getElementById("code-in");
    var incoming = readCode(box && box.value);
    if (!incoming) {
      toast("That isn’t a progress code. Copy it again from the other device; it starts with SP1-.");
      return;
    }
    var added = 0;
    Object.keys(incoming.done).forEach(function (k) {
      if (!state.done[k]) { state.done[k] = true; added++; }
    });
    Object.keys(incoming.dates).forEach(function (k) {
      if (!state.dates[k] || incoming.updated > state.updated) state.dates[k] = incoming.dates[k];
    });
    save();
    render();
    toast(added ? "Added " + added + (added === 1 ? " tick" : " ticks") : "No new ticks in that code. Dates were updated.");
  }

  /* ---------- events ---------- */

  document.querySelector(".tabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tab]");
    if (b) go(b.getAttribute("data-tab"));
  });

  bar.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b || b.disabled) return;
    var act = b.getAttribute("data-act");
    if (act === "prev") stepWeek(-1);
    if (act === "next") stepWeek(1);
  });

  view.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-act]");
    if (!b) return;
    var act = b.getAttribute("data-act");
    if (act === "tab") go(b.getAttribute("data-tab"));
    else if (act === "today") { weekIdx = defaultWeek(); render({ top: true }); }
    else if (act === "open-week") { weekIdx = Number(b.getAttribute("data-i")); tab = "week"; render({ top: true }); }
    else if (act === "hide-install") { prefs.hideInstall = true; savePrefs(); render(); }
    else if (act === "install" && installEvent) {
      installEvent.prompt();
      installEvent.userChoice.then(function () { installEvent = null; render(); }, function () {});
    }
    else if (act === "copy-code") copyCode();
    else if (act === "import-code") importCode();
  });

  view.addEventListener("change", function (e) {
    var t = e.target;
    if (t.matches("input[data-task]")) {
      var id = t.getAttribute("data-task");
      if (t.checked) state.done[id] = true; else delete state.done[id];
      save();
      render();
      var again = view.querySelector('[data-task="' + id + '"]');
      if (again && document.activeElement === document.body) again.focus({ preventScroll: true });
    } else if (t.matches("input[data-date]")) {
      var k = t.getAttribute("data-date");
      if (DATE_RE.test(t.value)) state.dates[k] = t.value; else delete state.dates[k];
      save();
      render();
    }
  });

  var sx = null, sy = null;
  view.addEventListener("touchstart", function (e) {
    if (tab !== "week" || e.touches.length !== 1) { sx = null; return; }
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  view.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) stepWeek(dx < 0 ? 1 : -1);
  }, { passive: true });

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installEvent = e;
    if (tab === "guide") render();
  });
  window.addEventListener("appinstalled", function () { installEvent = null; render(); });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") render();
  });

  render();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }
})();
