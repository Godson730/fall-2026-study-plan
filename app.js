(function () {
  "use strict";

  var P = window.PLAN;
  var QUESTIONS = window.QUESTIONS || {};
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
    var quizMarks = {};
    if (s.quiz && typeof s.quiz === "object") {
      Object.keys(s.quiz).forEach(function (k) {
        if (/^w\d{1,2}-c\d{4}-q\d{1,2}$/.test(k) && (s.quiz[k] === "got" || s.quiz[k] === "again")) quizMarks[k] = s.quiz[k];
      });
    }
    var cardMarks = {};
    if (s.cards && typeof s.cards === "object") {
      Object.keys(s.cards).forEach(function (k) {
        if (/^fc-c\d{4}-\d{2}$/.test(k) && (s.cards[k] === "know" || s.cards[k] === "learning")) cardMarks[k] = s.cards[k];
      });
    }
    var examsSaved = {};
    if (s.exams && typeof s.exams === "object") {
      Object.keys(s.exams).forEach(function (k) {
        if (!/^c\d{4}(-final)?$/.test(k) || !Array.isArray(s.exams[k])) return;
        examsSaved[k] = s.exams[k].filter(function (a) { return a && typeof a.at === "number"; }).slice(-10).map(function (a) {
          var mc = {}, pts = {};
          if (a.mc && typeof a.mc === "object") {
            Object.keys(a.mc).forEach(function (i) { if (/^\d{1,2}$/.test(i) && [0, 1, 2, 3].indexOf(a.mc[i]) >= 0) mc[i] = a.mc[i]; });
          }
          if (a.pts && typeof a.pts === "object") {
            Object.keys(a.pts).forEach(function (i) {
              if (/^\d{1,2}$/.test(i) && Array.isArray(a.pts[i])) pts[i] = a.pts[i].slice(0, 10).map(function (v) { return v ? 1 : 0; });
            });
          }
          return { at: a.at, mc: mc, pts: pts };
        });
      });
    }
    var ttList = [];
    if (Array.isArray(s.timetable)) {
      s.timetable.slice(0, 60).forEach(function (c) {
        if (!c || typeof c !== "object") return;
        var code = String(c.code || "").trim().toUpperCase().slice(0, 20);
        var tre = /^([01]\d|2[0-3]):[0-5]\d$/;
        var ds = Array.isArray(c.days) ? c.days.filter(function (d, i, arr) { return typeof d === "number" && d >= 0 && d <= 6 && d % 1 === 0 && arr.indexOf(d) === i; }) : [];
        if (!code || !ds.length || !tre.test(c.s) || !tre.test(c.e) || c.e <= c.s) return;
        ttList.push({
          id: /^[a-z0-9]{1,24}$/i.test(c.id) ? c.id : "c" + Math.random().toString(36).slice(2, 9),
          code: code,
          sec: String(c.sec || "").trim().slice(0, 10),
          type: ["LEC", "LAB", "SEM", "TUT"].indexOf(c.type) >= 0 ? c.type : "LEC",
          days: ds.sort(),
          s: c.s,
          e: c.e,
          room: String(c.room || "").trim().slice(0, 40)
        });
      });
    }
    return { v: 1, updated: Number(s.updated) || 0, done: done, dates: dates, quiz: quizMarks, cards: cardMarks, exams: examsSaved, timetable: ttList };
  }

  var state;
  try { state = norm(JSON.parse(localStorage.getItem(LS_STATE))); } catch (e) { state = norm({}); }
  var prefs;
  try { prefs = JSON.parse(localStorage.getItem(LS_UI)) || {}; } catch (e) { prefs = {}; }

  function save() {
    state.updated = Date.now();
    try { localStorage.setItem(LS_STATE, JSON.stringify(state)); }
    catch (e) { toast("Your ticks couldn’t be saved. Check that this browser allows site storage."); }
    syncToWorker();
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

    var h = installBanner() || reminderBanner();
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
    if (isNow) h += todayClasses();

    h += '<ul class="cards" aria-label="Tasks">';
    COURSES.forEach(function (c) {
      var t = w.tasks[c.key], id = "w" + w.n + "-" + c.key;
      var reads = t.r.map(function (r) { return '<span><span class="book">' + esc(r[0]) + "</span>" + esc(r[1]) + "</span>"; }).join("");
      h += '<li class="card ' + c.key + doneCls(id) + '"><label class="card-main">' +
        '<span class="card-top"><span class="code"><i class="dot"></i>' + esc(c.code) + "</span>" +
        '<input type="checkbox" class="check" data-task="' + id + '"' + chk(id) + ' aria-label="Done: ' + esc(c.code + ", " + t.t) + '"></span>' +
        '<span class="topic">' + esc(t.t) + "</span>" +
        '<span class="reads">' + reads + "</span>" +
        '<span class="do"><span class="label">Practise</span>' + esc(t.d) + "</span>" +
        "</label>" + quizButton(id) + cardsButton(w, c.key) + "</li>";
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
    var h = timetableSection() + '<section class="summary" aria-label="Progress"><p class="label">Done so far</p>' +
      '<p class="big"><span class="big-n">' + countDone(ids) + '</span><span class="big-of">of ' + ids.length + " tasks</span></p><div class=\"bars\">";
    COURSES.forEach(function (c) {
      var cids = courseIds(c.key), d = countDone(cids);
      h += '<div class="bar-row ' + c.key + '"><span class="code"><i class="dot"></i>' + esc(c.code) + "</span>" +
        '<span class="count">' + d + "/" + cids.length + "</span>" +
        '<span class="bar" role="img" aria-label="' + esc(c.code) + ": " + d + " of " + cids.length + ' done"><i style="width:' + Math.round(d / cids.length * 100) + '%"></i></span></div>';
    });
    h += "</div></section>";

    h += reviewSection();

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
    var h = practiceSection() + '<section class="section"><h2>Your dates</h2><p class="sub">Copy these from each CourseLink outline and the final exam schedule.</p><div class="dates">';
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

    h += reminderSection();

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

  var TABS = { week: weekTab, semester: semesterTab, cards: cardsTab, exams: examsTab, guide: guideTab, quiz: quizTab, exam: examTab, ttedit: ttEditTab };

  function render(opts) {
    var r = TABS[tab]();
    bar.className = "appbar" + (r.plain ? " plain" : "");
    bar.innerHTML = r.top;
    view.innerHTML = r.body;
    document.querySelectorAll(".tab").forEach(function (b) {
      if (b.getAttribute("data-tab") === (tab === "quiz" ? quiz.from : tab === "exam" ? "exams" : tab === "ttedit" ? "semester" : tab)) b.setAttribute("aria-current", "page");
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

  /* ---------- review questions ---------- */

  var quiz = { id: null, from: "week", shown: {} };

  function quizStats(taskId) {
    var qs = QUESTIONS[taskId] || [], got = 0, again = 0;
    qs.forEach(function (_, i) {
      var m = state.quiz[taskId + "-q" + (i + 1)];
      if (m === "got") got++;
      else if (m === "again") again++;
    });
    return { total: qs.length, got: got, again: again };
  }

  function quizButton(taskId) {
    var s = quizStats(taskId);
    if (!s.total) return "";
    var detail = (s.got || s.again)
      ? s.got + " of " + s.total + " got" + (s.again ? " · " + s.again + " to redo" : "")
      : s.total + " questions";
    return '<button type="button" class="quiz-btn" data-act="quiz" data-id="' + taskId + '"><span>Review questions</span><span class="qmeta">' + detail + "</span>" + ICON.right + "</button>";
  }

  function taskOrder() {
    var ids = [];
    WEEKS.forEach(function (w) { COURSES.forEach(function (c) { ids.push("w" + w.n + "-" + c.key); }); });
    return ids;
  }

  function openQuiz(id) {
    if (!QUESTIONS[id]) return;
    if (tab !== "quiz") quiz.from = tab;
    quiz.id = id;
    quiz.shown = {};
    tab = "quiz";
    render({ top: true });
  }

  function quizTab() {
    var id = quiz.id, parts = id.split("-");
    var w = WEEKS[Number(parts[0].slice(1)) - 1], c = course(parts[1]), t = w.tasks[c.key];
    var qs = QUESTIONS[id], s = quizStats(id);

    var top = '<button type="button" class="iconbtn" data-act="quiz-back" aria-label="Back">' + ICON.left + "</button>" +
      '<div class="ab-mid"><h1 class="ab-title">Review questions</h1><p class="ab-sub">' + esc(c.code + " · Week " + w.n) + "</p></div><span></span>";

    var h = '<section class="qhead ' + c.key + '"><span class="code"><i class="dot"></i>' + esc(c.code) + "</span>" +
      '<h2 class="qtopic">' + esc(t.t) + "</h2>" +
      '<p class="qscore"><span><b>' + s.got + "</b> got it</span><span><b>" + s.again + "</b> to review again</span><span><b>" + (s.total - s.got - s.again) + "</b> not marked</span></p>" +
      '<p class="sub">Answer each question in your head or on paper before you check.</p></section>';

    h += '<ol class="qlist">';
    qs.forEach(function (qa, i) {
      var qid = id + "-q" + (i + 1), mark = state.quiz[qid] || "";
      h += '<li class="q"><p class="qtext"><span class="qn">' + (i + 1) + "</span><span>" + esc(qa[0]) + "</span></p>";
      if (quiz.shown[qid]) {
        h += '<div class="answer"><span class="label">Answer</span><p>' + esc(qa[1]) + "</p></div>" +
          '<div class="qbtns">' +
            '<button type="button" class="qmark got' + (mark === "got" ? " on" : "") + '" data-act="mark" data-q="' + qid + '" data-v="got" data-focus="got-' + qid + '" aria-pressed="' + (mark === "got") + '">Got it</button>' +
            '<button type="button" class="qmark again' + (mark === "again" ? " on" : "") + '" data-act="mark" data-q="' + qid + '" data-v="again" aria-pressed="' + (mark === "again") + '">Review again</button>' +
          "</div>";
      } else {
        h += '<div class="qbtns"><button type="button" class="btn ghost" data-act="reveal" data-q="' + qid + '">Show answer</button>' +
          (mark ? '<span class="qchip ' + mark + '">' + (mark === "got" ? "Got it" : "Review again") + "</span>" : "") + "</div>";
      }
      h += "</li>";
    });
    h += "</ol>";

    var order = taskOrder(), next = order[order.indexOf(id) + 1];
    h += '<div class="btns">';
    if (next) {
      var np = next.split("-");
      h += '<button type="button" class="btn" data-act="quiz" data-id="' + next + '">Next: ' + esc(course(np[1]).code + " · Week " + np[0].slice(1)) + "</button>";
    }
    h += '<button type="button" class="btn ghost" data-act="quiz-reveal-all">Show all answers</button></div>';
    if (s.got || s.again) h += '<div class="btns"><button type="button" class="linkbtn" data-act="quiz-reset">Clear my marks for this topic</button></div>';

    return { top: top, body: h, plain: false };
  }

  function reviewSection() {
    var total = 0, got = 0, rows = "";
    WEEKS.forEach(function (w) {
      COURSES.forEach(function (c) {
        var id = "w" + w.n + "-" + c.key, s = quizStats(id);
        total += s.total;
        got += s.got;
        if (s.again) {
          rows += '<button type="button" class="wrow" data-act="quiz" data-id="' + id + '">' +
            '<span class="n">' + w.n + "</span>" +
            '<span><span class="d">' + esc(c.code) + '</span><span class="t">' + esc(w.tasks[c.key].t) + "</span></span>" +
            '<span class="right"><span class="mark ' + c.key + '">' + s.again + " to redo</span></span>" + ICON.right + "</button>";
        }
      });
    });
    return '<section class="section"><h2>Review questions</h2>' +
      '<p class="sub">' + got + " of " + total + " questions marked Got it.</p>" +
      (rows
        ? '<p class="label">To review again</p><div class="weeks">' + rows + "</div>"
        : '<p class="sub">Questions you mark Review again collect here, so you can find them before a midterm.</p>') +
      "</section>";
  }

  /* ---------- flashcards ---------- */

  var CARDS = window.FLASHCARDS || [];
  var CARD_BY_ID = {};
  CARDS.forEach(function (c) { CARD_BY_ID[c.id] = c; });

  var fc = {
    course: prefs.fcCourse || "all",
    range: prefs.fcRange === "all" ? "all" : "sofar",
    week: null,
    mode: prefs.fcMode === "list" ? "list" : "study",
    order: null,
    pos: 0,
    flipped: false,
    onlyLearning: false
  };

  function currentWeekNo() {
    var ni = nowIndex();
    return ni < 0 ? 1 : Math.min(WEEKS.length, ni + 1);
  }

  function fcFiltered() {
    var cw = currentWeekNo(), wk = fc.week || cw;
    return CARDS.filter(function (c) {
      if (fc.course !== "all" && c.c !== fc.course) return false;
      if (fc.range === "week") return c.w === wk;
      if (fc.range === "sofar") return c.w <= cw;
      return true;
    });
  }

  function fcDeck() {
    if (!fc.order) {
      var list = fcFiltered();
      if (fc.onlyLearning) list = list.filter(function (c) { return state.cards[c.id] === "learning"; });
      var fresh = list.filter(function (c) { return state.cards[c.id] !== "know"; });
      var known = list.filter(function (c) { return state.cards[c.id] === "know"; });
      fc.order = fresh.concat(known).map(function (c) { return c.id; });
      fc.pos = 0;
      fc.flipped = false;
    }
    return fc.order.map(function (id) { return CARD_BY_ID[id]; }).filter(Boolean);
  }

  function fcResetDeck() { fc.order = null; fc.onlyLearning = false; fc.flipped = false; }

  function fcStep(delta) {
    var deck = fcDeck();
    var n = Math.max(0, Math.min(deck.length, fc.pos + delta));
    if (n === fc.pos) return;
    fc.pos = n;
    fc.flipped = false;
    render();
  }

  function lines(text) { return esc(text).split(";  ").join("<br>"); }

  function cardsButton(w, key) {
    var n = CARDS.filter(function (c) { return c.c === key && c.w === w.n; }).length;
    if (!n) return "";
    return '<button type="button" class="quiz-btn" data-act="cards-for" data-c="' + key + '" data-w="' + w.n + '"><span>Flashcards</span><span class="qmeta">' + n + (n === 1 ? " card" : " cards") + "</span>" + ICON.right + "</button>";
  }

  function cardsTab() {
    var top = '<div class="ab-mid"><h1 class="ab-title">Flashcards</h1><p class="ab-sub">Key formulas and reactions</p></div>';
    var cw = currentWeekNo(), wk = fc.week || cw;

    function pressed(on) { return ' aria-pressed="' + on + '"'; }
    var h = '<section class="fc-controls">';
    h += '<div class="chips" role="group" aria-label="Course">' +
      '<button type="button" class="chip" data-act="fc-course" data-v="all"' + pressed(fc.course === "all") + ">All courses</button>";
    COURSES.forEach(function (c) {
      h += '<button type="button" class="chip ' + c.key + '" data-act="fc-course" data-v="' + c.key + '"' + pressed(fc.course === c.key) + '><i class="dot"></i>' + esc(c.code) + "</button>";
    });
    h += "</div>";
    h += '<div class="seg" role="group" aria-label="Weeks">' +
      '<button type="button" data-act="fc-range" data-v="week"' + pressed(fc.range === "week") + ">" + (wk === cw ? "This week" : "Week " + wk) + "</button>" +
      '<button type="button" data-act="fc-range" data-v="sofar"' + pressed(fc.range === "sofar") + ">Up to week " + cw + "</button>" +
      '<button type="button" data-act="fc-range" data-v="all"' + pressed(fc.range === "all") + ">All weeks</button></div>";
    h += '<div class="seg" role="group" aria-label="View">' +
      '<button type="button" data-act="fc-mode" data-v="study"' + pressed(fc.mode === "study") + ">Study</button>" +
      '<button type="button" data-act="fc-mode" data-v="list"' + pressed(fc.mode === "list") + ">List</button></div>";

    var all = fcFiltered();
    var knownN = all.filter(function (c) { return state.cards[c.id] === "know"; }).length;
    var learningN = all.filter(function (c) { return state.cards[c.id] === "learning"; }).length;
    h += '<p class="sub">' + all.length + (all.length === 1 ? " card" : " cards") + " · " + knownN + " know it · " + learningN + " still learning</p></section>";

    if (fc.mode === "list") {
      if (!all.length) return { top: top, body: h + '<p class="sub">No cards match these filters.</p>', plain: true };
      var weeksSeen = [];
      all.forEach(function (c) { if (weeksSeen.indexOf(c.w) < 0) weeksSeen.push(c.w); });
      weeksSeen.sort(function (a, b) { return a - b; }).forEach(function (wn) {
        h += '<section class="fc-week"><p class="label">Week ' + wn + '</p><ul class="fc-list">';
        all.filter(function (c) { return c.w === wn; }).forEach(function (card) {
          var mark = state.cards[card.id];
          h += '<li class="fc-item ' + card.c + '"><span class="fc-item-top"><span class="code"><i class="dot"></i>' + esc(course(card.c).code) + "</span>" +
            (mark ? '<span class="qchip ' + (mark === "know" ? "got" : "again") + '">' + (mark === "know" ? "Know it" : "Still learning") + "</span>" : "") + "</span>" +
            '<p class="fc-q">' + esc(card.f) + '</p><p class="fc-a">' + lines(card.b) + "</p>" +
            (card.n ? '<p class="fc-n">' + esc(card.n) + "</p>" : "") + "</li>";
        });
        h += "</ul></section>";
      });
      return { top: top, body: h, plain: true };
    }

    var deck = fcDeck();
    if (!deck.length) {
      h += '<section class="fc-done"><h2>No cards here</h2><p class="sub">' +
        (fc.onlyLearning ? "Nothing in this set is marked Still learning." : "No cards match these filters. Try All weeks or All courses.") + "</p>" +
        (fc.onlyLearning ? '<div class="btns"><button type="button" class="btn ghost" data-act="fc-restart">Study all cards</button></div>' : "") + "</section>";
      return { top: top, body: h, plain: true };
    }

    if (fc.pos >= deck.length) {
      var k = deck.filter(function (c) { return state.cards[c.id] === "know"; }).length;
      var l = deck.filter(function (c) { return state.cards[c.id] === "learning"; }).length;
      h += '<section class="fc-done"><h2>Deck finished</h2><p>' + deck.length + (deck.length === 1 ? " card: " : " cards: ") + k + " know it, " + l + " still learning.</p>" +
        '<div class="btns">' + (l ? '<button type="button" class="btn" data-act="fc-learning">Study the ' + l + " still learning</button>" : "") +
        '<button type="button" class="btn ghost" data-act="fc-restart">Start again</button></div></section>';
      return { top: top, body: h, plain: true };
    }

    var card = deck[fc.pos], cc = course(card.c), mark = state.cards[card.id] || "";
    h += '<p class="fc-pos"><span>Card ' + (fc.pos + 1) + " of " + deck.length + "</span>" +
      (mark ? '<span class="qchip ' + (mark === "know" ? "got" : "again") + '">' + (mark === "know" ? "Know it" : "Still learning") + "</span>" : "") +
      '<button type="button" class="linkbtn" data-act="fc-shuffle">Shuffle</button></p>';
    h += '<div class="fc-card ' + card.c + (fc.flipped ? " is-flipped" : "") + '" role="button" tabindex="0" data-act="fc-flip" aria-label="' + (fc.flipped ? "Card showing the answer. Tap to see the prompt." : "Card showing the prompt. Tap to see the answer.") + '">' +
      '<div class="fc-inner">' +
        '<div class="fc-face fc-front"' + (fc.flipped ? ' aria-hidden="true"' : "") + '><span class="code"><i class="dot"></i>' + esc(cc.code + " · Week " + card.w) + '</span><p class="fc-prompt">' + esc(card.f) + '</p><span class="fc-hint">Tap to flip</span></div>' +
        '<div class="fc-face fc-back"' + (fc.flipped ? "" : ' aria-hidden="true"') + '><span class="code"><i class="dot"></i>' + esc(cc.code + " · Week " + card.w) + '</span><p class="fc-answer">' + lines(card.b) + "</p>" +
          (card.n ? '<p class="fc-note">' + esc(card.n) + "</p>" : '<span class="fc-hint">Tap to flip back</span>') + "</div>" +
      "</div></div>";
    h += '<div class="fc-actions">' +
      '<button type="button" class="iconbtn" data-act="fc-prev" aria-label="Previous card"' + (fc.pos === 0 ? " disabled" : "") + ">" + ICON.left + "</button>" +
      (fc.flipped
        ? '<button type="button" class="qmark again' + (mark === "learning" ? " on" : "") + '" data-act="fc-mark" data-v="learning">Still learning</button>' +
          '<button type="button" class="qmark got' + (mark === "know" ? " on" : "") + '" data-act="fc-mark" data-v="know">Know it</button>'
        : '<button type="button" class="btn" data-act="fc-flip">Show answer</button>') +
      '<button type="button" class="iconbtn" data-act="fc-next" aria-label="Next card">' + ICON.right + "</button></div>" +
      '<p class="sub fc-tip">Swipe left or right to move between cards.</p>';
    return { top: top, body: h, plain: true };
  }

  /* ---------- practice midterms ---------- */

  var EXAMS = window.PRACTICE_EXAMS || {};
  var LS_DRAFT = "studyplan-exam-draft-v1";
  var drafts;
  try { drafts = JSON.parse(localStorage.getItem(LS_DRAFT)) || {}; } catch (e) { drafts = {}; }
  function saveDrafts() { try { localStorage.setItem(LS_DRAFT, JSON.stringify(drafts)); } catch (e) {} }

  var ex = { course: null, view: "intro", confirmSubmit: false, confirmDiscard: false };
  var LETTERS = "ABCD";

  function rubricMax(q) { return q.r.reduce(function (m, r) { return m + r[1]; }, 0); }
  function examTotal(def) { return def.questions.reduce(function (n, q) { return n + (q.t === "mc" ? 1 : rubricMax(q)); }, 0); }
  function mcCount(def) { return def.questions.filter(function (q) { return q.t === "mc"; }).length; }
  function attemptScore(def, att) {
    var s = 0;
    def.questions.forEach(function (q, i) {
      if (q.t === "mc") { if (att.mc[i] === q.a) s += 1; }
      else { var p = att.pts[i] || []; q.r.forEach(function (r, j) { if (p[j]) s += r[1]; }); }
    });
    return s;
  }
  function attemptsFor(key) { return state.exams[key] || []; }
  function latestAttempt(key) { var a = attemptsFor(key); return a.length ? a[a.length - 1] : null; }
  function fmt(n) { return String(Math.round(n * 100) / 100); }
  function remainingSec(def, d) { return Math.max(0, Math.round(def.minutes * 60 - (Date.now() - d.started) / 1000)); }
  function mmss(sec) { var m = Math.floor(sec / 60), s = sec % 60; return m + ":" + (s < 10 ? "0" : "") + s; }

  function examCourse(id) { return id.split("-")[0]; }
  function examLabel(def) { return def.kind === "final" ? "Practice final" : "Practice midterm"; }

  function examRow(id, c) {
    var def = EXAMS[id];
    if (!def) return "";
    var total = examTotal(def), atts = attemptsFor(id), d = drafts[id], status;
    if (d) status = d.timed ? "In progress · " + Math.ceil(remainingSec(def, d) / 60) + " min left" : "In progress";
    else if (atts.length) {
      var best = Math.max.apply(null, atts.map(function (a) { return attemptScore(def, a); }));
      status = "Best " + fmt(best) + "/" + total + " (" + Math.round(best / total * 100) + "%)";
    } else status = "Not taken";
    var length = def.minutes >= 60 ? (def.minutes / 60) + " h" : def.minutes + " min";
    return '<button type="button" class="wrow" data-act="exam-open" data-c="' + id + '">' +
      '<span class="n"><i class="dot ' + c.key + '"></i></span>' +
      '<span><span class="d">' + esc(c.code) + '</span><span class="t">' + total + " marks · " + length + "</span></span>" +
      '<span class="right"><span class="exstat">' + esc(status) + "</span></span>" + ICON.right + "</button>";
  }

  function practiceSection() {
    var mids = "", finals = "";
    COURSES.forEach(function (c) {
      mids += examRow(c.key, c);
      finals += examRow(c.key + "-final", c);
    });
    var toExams = Math.round((day(EXAM.start).getTime() - today().getTime()) / 86400000);
    var finalsHtml = '<section class="section"><h2>Practice finals</h2><p class="sub">Cumulative (weeks 1–12), weighted toward weeks 7–12, 2 hours each.' +
      (toExams > 0 ? " The exam period starts in " + toExams + (toExams === 1 ? " day." : " days.") : "") + '</p><div class="weeks">' + finals + "</div></section>";
    var midsHtml = '<section class="section"><h2>Practice midterms</h2><p class="sub">Weeks 1–6. Your real midterm may cover a different range, so check CourseLink.</p><div class="weeks">' + mids + "</div></section>";
    return nowIndex() >= 6 ? finalsHtml + midsHtml : midsHtml + finalsHtml;
  }

  function openExam(key) {
    if (!EXAMS[key]) return;
    ex.course = key;
    ex.view = "intro";
    ex.confirmSubmit = false;
    ex.confirmDiscard = false;
    tab = "exam";
    render({ top: true });
  }

  function startExam(timed) {
    drafts[ex.course] = { started: Date.now(), timed: timed, mc: {}, notes: {} };
    saveDrafts();
    ex.view = "taking";
    ex.confirmSubmit = false;
    render({ top: true });
  }

  function finalizeExam(key, auto) {
    var def = EXAMS[key], d = drafts[key];
    if (!def || !d) return;
    var att = { at: Date.now(), mc: {}, pts: {} };
    Object.keys(d.mc).forEach(function (k) { att.mc[k] = d.mc[k]; });
    def.questions.forEach(function (q, i) { if (q.t === "sa") att.pts[i] = q.r.map(function () { return 0; }); });
    state.exams[key] = attemptsFor(key).concat([att]).slice(-10);
    delete drafts[key];
    saveDrafts();
    save();
    if (tab === "exam" && ex.course === key) {
      ex.view = "results";
      ex.confirmSubmit = false;
      render({ top: true });
    } else if (tab === "exams") {
      render();
    }
    toast(auto ? "Time’s up. Your " + course(examCourse(key)).code + " " + examLabel(def).toLowerCase() + " was submitted." : "Submitted. Mark your written answers below.");
  }

  function examTick() {
    Object.keys(drafts).forEach(function (key) {
      var def = EXAMS[key], d = drafts[key];
      if (!def || !d || typeof d.started !== "number") { delete drafts[key]; saveDrafts(); return; }
      if (d.timed && remainingSec(def, d) <= 0) finalizeExam(key, true);
    });
    if (tab === "exam" && ex.view === "taking" && drafts[ex.course] && drafts[ex.course].timed) {
      var el = document.getElementById("exam-clock");
      if (el) {
        var rem = remainingSec(EXAMS[ex.course], drafts[ex.course]);
        el.textContent = mmss(rem) + " left";
        el.classList.toggle("low", rem <= 300);
      }
    }
  }

  function examTab() {
    var key = ex.course, c = course(examCourse(key)), def = EXAMS[key];
    var top = '<button type="button" class="iconbtn" data-act="exam-back" aria-label="Back to Exams">' + ICON.left + "</button>" +
      '<div class="ab-mid"><h1 class="ab-title">' + examLabel(def) + '</h1><p class="ab-sub">' + esc(c.code + " · Weeks " + def.weeks[0] + "–" + def.weeks[1]) + "</p></div><span></span>";
    var body;
    if (ex.view === "taking" && drafts[key]) body = examTaking(def, key);
    else if (ex.view === "results" && latestAttempt(key)) body = examResults(def, key);
    else body = examIntro(def, key, c);
    return { top: top, body: body, plain: false };
  }

  function examIntro(def, key, c) {
    var total = examTotal(def), mc = mcCount(def), sa = def.questions.length - mc, d = drafts[key], atts = attemptsFor(key);
    var h = '<section class="qhead ' + key + '"><span class="code"><i class="dot"></i>' + esc(c.code + " · " + c.name) + "</span>" +
      '<h2 class="qtopic">' + examLabel(def) + "</h2>" +
      '<p class="qscore"><span><b>' + def.questions.length + "</b> questions</span><span><b>" + total + "</b> marks</span><span><b>" + def.minutes + "</b> minutes</span></p></section>";
    h += '<section class="install"><h3>Covers</h3><p class="sub">' + esc(def.covers) + "</p>" +
      '<h3>Format</h3><ul class="bullets">' +
        "<li>" + mc + " multiple-choice questions, 1 mark each, marked automatically.</li>" +
        "<li>" + sa + " written questions worth " + fmt(total - mc) + " marks. Work them on paper, then mark yourself against the model answer.</li>" +
        "<li>Closed book. Use a calculator and the constants given.</li>" +
        "<li>The timer keeps running if you leave the app, and the exam submits itself when time runs out.</li>" +
      "</ul></section>";
    h += '<div class="btns">';
    if (d) {
      h += '<button type="button" class="btn" data-act="exam-continue">Continue' + (d.timed ? " (" + Math.ceil(remainingSec(def, d) / 60) + " min left)" : "") + "</button>" +
        '<button type="button" class="btn ghost" data-act="exam-discard">' + (ex.confirmDiscard ? "Tap again to discard your answers" : "Discard and start over") + "</button>";
    } else {
      h += '<button type="button" class="btn" data-act="exam-start" data-timed="1">Start timed exam (' + def.minutes + " min)</button>" +
        '<button type="button" class="btn ghost" data-act="exam-start" data-timed="0">Start without a timer</button>';
    }
    h += "</div>";
    if (atts.length) {
      h += '<section class="section"><h2>Past attempts</h2><ul class="history">';
      atts.slice().reverse().forEach(function (a) {
        var dt = new Date(a.at);
        h += "<li><span>" + MONTHS[dt.getMonth()] + " " + dt.getDate() + "</span><span>" + fmt(attemptScore(def, a)) + " / " + total + "</span></li>";
      });
      h += '</ul><div class="btns"><button type="button" class="btn ghost" data-act="exam-results">See latest results and answers</button></div></section>';
    }
    return h;
  }

  function examTaking(def, key) {
    var d = drafts[key], rem = d.timed ? remainingSec(def, d) : null;
    var mcN = mcCount(def), answered = Object.keys(d.mc).length;
    var h = '<div class="exbar"><span id="exam-clock" class="clock' + (rem !== null && rem <= 300 ? " low" : "") + '">' + (rem === null ? "No timer" : mmss(rem) + " left") + "</span>" +
      '<span id="exam-progress">' + answered + " of " + mcN + " multiple choice answered</span></div>";
    h += '<ol class="qlist">';
    def.questions.forEach(function (q, i) {
      h += '<li class="q"><p class="qtext"><span class="qn">' + (i + 1) + "</span><span>" + esc(q.q) +
        '<span class="qmarks">' + (q.t === "mc" ? "1 mark" : fmt(rubricMax(q)) + " marks") + "</span></span></p>";
      if (q.t === "mc") {
        h += '<div class="opts" role="radiogroup" aria-label="Question ' + (i + 1) + ' options">';
        q.o.forEach(function (opt, j) {
          var on = d.mc[i] === j;
          h += '<button type="button" class="opt' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-act="exam-pick" data-i="' + i + '" data-j="' + j + '">' +
            '<span class="letter">' + LETTERS[j] + "</span><span>" + esc(opt) + "</span></button>";
        });
        h += "</div>";
      } else {
        h += '<label class="label qindent" for="note-' + i + '">Notes (optional; your paper answer is what counts)</label>' +
          '<textarea class="qindent" id="note-' + i + '" data-note="' + i + '" rows="4" spellcheck="false">' + esc(d.notes[i] || "") + "</textarea>";
      }
      h += "</li>";
    });
    h += "</ol>";
    var unanswered = mcN - answered;
    h += '<div class="btns">' + (ex.confirmSubmit && unanswered
      ? '<button type="button" class="btn" data-act="exam-submit" data-force="1">Submit with ' + unanswered + " unanswered</button>" +
        '<button type="button" class="btn ghost" data-act="exam-keep">Keep working</button>'
      : '<button type="button" class="btn" data-act="exam-submit">Submit exam</button>') + "</div>";
    return h;
  }

  function examResults(def, key) {
    var att = latestAttempt(key), total = examTotal(def), score = attemptScore(def, att), ck = examCourse(key);
    var mcN = mcCount(def), mcRight = 0;
    def.questions.forEach(function (q, i) { if (q.t === "mc" && att.mc[i] === q.a) mcRight++; });

    var h = '<section class="exres"><p class="label">Your score</p>' +
      '<p class="big"><span class="big-n">' + fmt(score) + '</span><span class="big-of">/ ' + total + " · " + Math.round(score / total * 100) + "%</span></p>" +
      '<p class="qscore"><span>Multiple choice <b>' + mcRight + "/" + mcN + "</b></span><span>Written <b>" + fmt(score - mcRight) + "/" + fmt(total - mcN) + "</b></span></p>" +
      '<p class="sub">Written marks count once you tick the rubric points your answers earned.</p></section>';

    var byWeek = {};
    def.questions.forEach(function (q, i) {
      var b = byWeek[q.w] || (byWeek[q.w] = [0, 0]);
      if (q.t === "mc") { b[1] += 1; if (att.mc[i] === q.a) b[0] += 1; }
      else { var p = att.pts[i] || []; q.r.forEach(function (r, j) { b[1] += r[1]; if (p[j]) b[0] += r[1]; }); }
    });
    h += '<section class="section"><h2>By week</h2><p class="sub">Tap a week to open its review questions.</p><div class="weeks">';
    Object.keys(byWeek).map(Number).sort(function (a, b) { return a - b; }).forEach(function (wn) {
      var b = byWeek[wn];
      h += '<button type="button" class="wrow" data-act="quiz" data-id="w' + wn + "-" + ck + '"><span class="n">' + wn + "</span>" +
        '<span><span class="d">' + fmt(b[0]) + " / " + fmt(b[1]) + ' marks</span><span class="t">' + esc(WEEKS[wn - 1].tasks[ck].t) + "</span></span>" +
        '<span class="right">' + (b[0] / b[1] < 0.7 ? '<span class="qchip again">Review</span>' : "") + "</span>" + ICON.right + "</button>";
    });
    h += "</div></section>";

    h += '<section class="section"><h2>Answers</h2><ol class="qlist">';
    def.questions.forEach(function (q, i) {
      h += '<li class="q"><p class="qtext"><span class="qn">' + (i + 1) + "</span><span>" + esc(q.q) + "</span></p>";
      if (q.t === "mc") {
        var pick = att.mc[i];
        h += '<div class="opts">';
        q.o.forEach(function (opt, j) {
          var cls = j === q.a ? " correct" : (j === pick ? " wrong" : "");
          var tag = j === q.a ? (j === pick ? "Your answer · correct" : "Correct answer") : (j === pick ? "Your answer" : "");
          h += '<div class="opt static' + cls + '"><span class="letter">' + LETTERS[j] + "</span><span>" + esc(opt) + (tag ? '<b class="tag">' + tag + "</b>" : "") + "</span></div>";
        });
        h += "</div>" +
          '<p class="qres ' + (pick === q.a ? "ok" : "miss") + '">' + (pick === undefined ? "Not answered" : pick === q.a ? "Correct" : "Incorrect") + "</p>" +
          '<div class="answer"><span class="label">Why</span><p>' + esc(q.e) + "</p></div>";
      } else {
        var p = att.pts[i] || [], got = 0;
        q.r.forEach(function (r, j) { if (p[j]) got += r[1]; });
        h += '<div class="answer"><span class="label">Model answer</span><p>' + lines(q.s) + "</p></div>" +
          '<p class="label qindent">Tick what your answer earned · ' + fmt(got) + " / " + fmt(rubricMax(q)) + "</p>" +
          '<div class="rows qindent">';
        q.r.forEach(function (r, j) {
          h += '<label class="row"><input type="checkbox" class="check sm" data-rubric="' + i + "-" + j + '"' + (p[j] ? " checked" : "") + ">" +
            "<span>" + esc(r[0]) + ' <b class="pts">' + fmt(r[1]) + (r[1] === 1 ? " mark" : " marks") + "</b></span></label>";
        });
        h += "</div>";
      }
      h += "</li>";
    });
    h += "</ol></section>" +
      '<div class="btns"><button type="button" class="btn" data-act="exam-retake">Take it again</button><button type="button" class="btn ghost" data-act="exam-back">Back to Exams</button></div>';
    return h;
  }

  /* ---------- timetable ---------- */

  var TT_TYPES = [["LEC", "Lecture"], ["LAB", "Lab"], ["SEM", "Seminar"], ["TUT", "Tutorial"]];
  var DAY3 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
  var tt = { form: null, confirmDelete: false, pasteOpen: false, error: "" };

  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function clock(m) {
    var h = Math.floor(m / 60), mm = m % 60, h12 = h % 12 || 12;
    return h12 + ":" + (mm < 10 ? "0" : "") + mm + (h < 12 ? " a.m." : " p.m.");
  }
  function hourLabel(h) { var h12 = h % 12 || 12; return h12 + (h < 12 ? "am" : "pm"); }
  function typeName(code) { var t = TT_TYPES.filter(function (x) { return x[0] === code; })[0]; return t ? t[1] : code; }
  function isoOf(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

  /* Which weekday’s classes run on a date: -1 when there are no classes (outside term, fall break). */
  function classDay(d) {
    var iso = isoOf(d);
    if (iso < WEEKS[0].start || iso > "2026-12-04" || iso === "2026-10-12" || iso === "2026-10-13") return -1;
    if (iso === "2026-12-03") return 2;
    if (iso === "2026-12-04") return 1;
    return d.getDay();
  }

  function meetingsOn(dow) {
    return state.timetable.filter(function (c) { return c.days.indexOf(dow) >= 0; })
      .sort(function (a, b) { return a.s < b.s ? -1 : a.s > b.s ? 1 : 0; });
  }

  function ttGrid() {
    var list = state.timetable;
    var weekend = list.some(function (c) { return c.days.indexOf(0) >= 0 || c.days.indexOf(6) >= 0; });
    var days = weekend ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5];
    var minS = Math.min.apply(null, list.map(function (c) { return toMin(c.s); }));
    var maxE = Math.max.apply(null, list.map(function (c) { return toMin(c.e); }));
    var startH = Math.min(8, Math.floor(minS / 60)), endH = Math.max(17, Math.ceil(maxE / 60));
    var pph = 44, now = new Date(), todayDow = classDay(now), nowMin = now.getHours() * 60 + now.getMinutes();

    var h = '<div class="tt" style="--days:' + days.length + ";--pph:" + pph + 'px">';
    h += '<div class="tt-head" aria-hidden="true"><span></span>' + days.map(function (d) {
      return "<span" + (d === todayDow ? ' class="today"' : "") + ">" + DAY3[d] + "</span>";
    }).join("") + "</div>";
    h += '<div class="tt-body" style="height:' + (endH - startH) * pph + 'px">';
    h += '<div class="tt-axis" aria-hidden="true">';
    for (var hr = startH; hr < endH; hr++) h += '<span class="tt-hour" style="top:' + (hr - startH) * pph + 'px">' + hourLabel(hr) + "</span>";
    h += "</div>";
    days.forEach(function (d) {
      var items = meetingsOn(d), laneEnds = [];
      var placed = items.map(function (c) {
        var s = toMin(c.s), lane = 0;
        while (lane < laneEnds.length && laneEnds[lane] > s) lane++;
        laneEnds[lane] = toMin(c.e);
        return { c: c, lane: lane };
      });
      var lanes = Math.max(1, laneEnds.length);
      h += '<div class="tt-col">';
      placed.forEach(function (p) {
        var c = p.c, s = toMin(c.s), e = toMin(c.e);
        var top = (s - startH * 60) / 60 * pph, height = Math.max(18, (e - s) / 60 * pph - 2);
        var w = 100 / lanes;
        h += '<button type="button" class="tt-block ' + c.type + '" data-act="tt-edit" data-id="' + esc(c.id) + '" ' +
          'style="top:' + top.toFixed(1) + "px;height:" + height.toFixed(1) + "px;left:calc(" + (p.lane * w).toFixed(3) + "% + 2px);width:calc(" + w.toFixed(3) + '% - 4px)" ' +
          'aria-label="' + esc(c.code + " " + typeName(c.type) + ", " + DAY_FULL[d] + " " + clock(s) + " to " + clock(e) + (c.room ? ", " + c.room : "") + ", edit") + '">' +
          '<span class="tt-code">' + esc(c.code.split("*")[0]) + '</span><span class="tt-type">' + esc((c.code.split("*")[1] || "") + " " + c.type) + "</span></button>";
      });
      if (d === todayDow && nowMin >= startH * 60 && nowMin <= endH * 60) {
        h += '<i class="tt-now" style="top:' + ((nowMin - startH * 60) / 60 * pph).toFixed(1) + 'px" aria-hidden="true"></i>';
      }
      h += "</div>";
    });
    return h + "</div></div>";
  }

  function ttCode() { return "TT1-" + btoa(unescape(encodeURIComponent(JSON.stringify(state.timetable)))); }
  function ttRead(str) {
    str = String(str || "").replace(/\s+/g, "");
    if (str.indexOf("TT1-") !== 0) return null;
    try {
      var list = norm({ timetable: JSON.parse(decodeURIComponent(escape(atob(str.slice(4))))) }).timetable;
      return list.length ? list : null;
    } catch (e) { return null; }
  }

  function timetableSection() {
    var list = state.timetable;
    var h = '<section class="section" aria-labelledby="h-tt"><div class="sec-row"><h2 id="h-tt">Timetable</h2>' +
      (list.length ? '<button type="button" class="btn small" data-act="tt-add">Add class</button>' : "") + "</div>";
    if (!list.length) {
      h += '<div class="tt-empty"><p class="sub">Add your classes to see your week at a glance. Today’s classes will also show on the Week tab and in your morning reminder.</p>' +
        '<div class="btns"><button type="button" class="btn" data-act="tt-add">Add your first class</button>' +
        '<button type="button" class="btn ghost" data-act="tt-paste">Paste a timetable code</button></div></div>';
    } else {
      h += ttGrid();
      h += '<p class="tt-legend">' + TT_TYPES.filter(function (t) {
        return list.some(function (c) { return c.type === t[0]; });
      }).map(function (t) { return '<span><i class="tt-swatch ' + t[0] + '"></i>' + t[1] + "</span>"; }).join("") +
        '<span class="sub">Tap a class to edit it</span></p>';
      h += '<details class="tt-all"><summary>All classes (' + list.length + ")</summary><div class=\"weeks\">";
      list.slice().sort(function (a, b) { return a.code < b.code ? -1 : a.code > b.code ? 1 : a.type < b.type ? -1 : 1; }).forEach(function (c) {
        var daysTxt = [1, 2, 3, 4, 5, 6, 0].filter(function (d) { return c.days.indexOf(d) >= 0; }).map(function (d) { return DAY3[d]; }).join(", ");
        h += '<button type="button" class="wrow" data-act="tt-edit" data-id="' + esc(c.id) + '">' +
          '<span class="n"><i class="tt-swatch ' + c.type + '"></i></span>' +
          '<span><span class="d">' + esc(c.code + (c.sec ? "*" + c.sec : "") + " " + c.type) + '</span><span class="t">' + esc(daysTxt + " · " + clock(toMin(c.s)) + "–" + clock(toMin(c.e)) + (c.room ? " · " + c.room : "")) + "</span></span>" +
          '<span class="right"></span>' + ICON.right + "</button>";
      });
      h += "</div></details>";
      h += '<div class="btns"><button type="button" class="linkbtn" data-act="tt-copy">Copy timetable code</button><button type="button" class="linkbtn" data-act="tt-paste">' + (tt.pasteOpen ? "Hide code box" : "Paste a timetable code") + "</button></div>";
    }
    if (tt.pasteOpen) {
      h += '<div class="tt-paste"><label class="label" for="tt-code-in">Timetable code</label>' +
        '<textarea id="tt-code-in" spellcheck="false" autocomplete="off" placeholder="TT1-…"></textarea>' +
        '<div class="btns"><button type="button" class="btn" data-act="tt-import">' + (list.length ? "Replace my " + list.length + (list.length === 1 ? " class" : " classes") : "Load timetable") + "</button></div></div>";
    }
    return h + "</section>";
  }

  function todayClasses() {
    if (!state.timetable.length) return "";
    var now = new Date(), iso = isoOf(now), dow = classDay(now), nowMin = now.getHours() * 60 + now.getMinutes();
    if (dow < 0) {
      if (iso === "2026-10-12" || iso === "2026-10-13") return '<p class="nextup"><span>Fall break: no classes today.</span></p>';
      return "";
    }
    var list = meetingsOn(dow);
    var note = iso === "2026-12-03" ? " (Tuesday schedule)" : iso === "2026-12-04" ? " (Monday schedule)" : "";
    if (!list.length) return '<p class="nextup"><span>No classes today' + note + '.</span><button type="button" class="linkbtn" data-act="tab" data-tab="semester">Timetable</button></p>';
    var nextMarked = false;
    var h = '<section class="tc" aria-labelledby="h-tc"><p class="label" id="h-tc">Today’s classes' + note + '</p><ul class="tc-list">';
    list.forEach(function (c) {
      var s = toMin(c.s), e = toMin(c.e), tag = "", cls = "";
      if (nowMin >= s && nowMin < e) tag = '<span class="tc-tag">Now</span>';
      else if (nowMin >= e) cls = ' class="past"';
      else if (!nextMarked) { tag = '<span class="tc-tag next">Next</span>'; nextMarked = true; }
      if (nowMin >= s && nowMin < e) nextMarked = true;
      h += "<li" + cls + '><span class="tc-time">' + clock(s) + "<br>" + clock(e) + "</span>" +
        '<span class="tc-what"><i class="tt-swatch ' + c.type + '"></i>' + esc(c.code + " " + typeName(c.type)) +
        (c.room ? '<span class="tc-room">' + esc(c.room) + "</span>" : "") + "</span>" + tag + "</li>";
    });
    return h + "</ul></section>";
  }

  function ttOpenForm(id) {
    var c = id ? state.timetable.filter(function (x) { return x.id === id; })[0] : null;
    tt.form = c ? JSON.parse(JSON.stringify(c)) : { id: null, code: "", sec: "", type: "LEC", days: [], s: "", e: "", room: "" };
    tt.error = "";
    tt.confirmDelete = false;
    tab = "ttedit";
    render({ top: true });
  }

  function ttClose() {
    tt.form = null;
    tab = "semester";
    render({ top: true });
  }

  function ttEditTab() {
    var f = tt.form;
    if (!f) { tab = "semester"; return semesterTab(); }
    var top = '<button type="button" class="iconbtn" data-act="tt-cancel" aria-label="Cancel">' + ICON.left + "</button>" +
      '<div class="ab-mid"><h1 class="ab-title">' + (f.id ? "Edit class" : "Add class") + '</h1><p class="ab-sub">Fall 2026 timetable</p></div><span></span>';
    function pressed(on) { return ' aria-pressed="' + on + '"'; }
    var h = '<form class="ttform" data-form="tt" novalidate>' +
      '<label class="field"><span class="label">Course code</span><input type="text" data-tt="code" value="' + esc(f.code) + '" placeholder="BIOC*2580" autocapitalize="characters" autocomplete="off" spellcheck="false"></label>' +
      '<div class="field-row">' +
        '<label class="field"><span class="label">Section <i>(optional)</i></span><input type="text" data-tt="sec" value="' + esc(f.sec) + '" placeholder="0227" autocomplete="off"></label>' +
        '<label class="field"><span class="label">Room <i>(optional)</i></span><input type="text" data-tt="room" value="' + esc(f.room) + '" placeholder="MCKN 120" autocapitalize="characters" autocomplete="off"></label>' +
      "</div>" +
      '<div class="field"><span class="label" id="tt-type-l">Type</span><div class="seg" role="group" aria-labelledby="tt-type-l">' +
        TT_TYPES.map(function (t) { return '<button type="button" data-act="tt-type" data-v="' + t[0] + '"' + pressed(f.type === t[0]) + ">" + t[1] + "</button>"; }).join("") +
      "</div></div>" +
      '<div class="field"><span class="label" id="tt-days-l">Days</span><div class="daychips" role="group" aria-labelledby="tt-days-l">' +
        [1, 2, 3, 4, 5, 6, 0].map(function (d) { return '<button type="button" data-act="tt-day" data-v="' + d + '" aria-label="' + DAY_FULL[d] + '"' + pressed(f.days.indexOf(d) >= 0) + ">" + DAY3[d] + "</button>"; }).join("") +
      "</div></div>" +
      '<div class="field-row">' +
        '<label class="field"><span class="label">Starts</span><input type="time" data-tt="s" value="' + esc(f.s) + '" step="300"></label>' +
        '<label class="field"><span class="label">Ends</span><input type="time" data-tt="e" value="' + esc(f.e) + '" step="300"></label>' +
      "</div>" +
      '<p class="form-error" role="alert">' + esc(tt.error) + "</p>" +
      '<div class="btns"><button type="submit" class="btn">Save class</button><button type="button" class="btn ghost" data-act="tt-cancel">Cancel</button></div>' +
      (f.id ? '<div class="btns"><button type="button" class="linkbtn danger" data-act="tt-delete">' + (tt.confirmDelete ? "Tap again to delete this class" : "Delete this class") + "</button></div>" : "") +
      "</form>";
    return { top: top, body: h, plain: false };
  }

  function ttSave() {
    var f = tt.form;
    if (!f) return;
    var code = f.code.trim().toUpperCase();
    var err = !code ? "Enter the course code, for example BIOC*2580."
      : !f.days.length ? "Pick at least one day."
      : (!TIME_RE.test(f.s) || !TIME_RE.test(f.e)) ? "Enter both a start time and an end time."
      : f.e <= f.s ? "The end time needs to be later than the start time." : "";
    if (err) {
      tt.error = err;
      var fe = view.querySelector(".form-error");
      if (fe) fe.textContent = err;
      return;
    }
    var entry = { id: f.id || "c" + Date.now().toString(36), code: code, sec: f.sec.trim(), type: f.type, days: f.days.slice().sort(), s: f.s, e: f.e, room: f.room.trim() };
    var i = state.timetable.map(function (c) { return c.id; }).indexOf(entry.id);
    if (i >= 0) state.timetable[i] = entry; else state.timetable.push(entry);
    save();
    ttClose();
    toast(f.id ? "Class updated" : "Class added");
  }

  function ttCopy() {
    var code = ttCode();
    function fallback() {
      tt.pasteOpen = true;
      render();
      var box = document.getElementById("tt-code-in");
      if (box) { box.value = code; box.focus(); box.select(); }
      toast("Select the code in the box and copy it.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(function () { toast("Timetable code copied"); }, fallback);
    else fallback();
  }

  /* ---------- daily reminders ---------- */

  var CFG = window.REMINDER_CONFIG || {};
  var remind = { sub: null };

  function pushSupported() {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window && location.protocol !== "file:";
  }

  function keyBytes(b64) {
    var s = (b64 + "===".slice((b64.length + 3) % 4)).replace(/-/g, "+").replace(/_/g, "/");
    var raw = atob(s), out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  function reminderCode() {
    return remind.sub ? "SPR1-" + btoa(JSON.stringify(remind.sub.toJSON())) : "";
  }

  /* The service worker reads this copy of your ticks to write each day’s reminder. */
  function syncToWorker() {
    if (!("caches" in window)) return;
    caches.open("studyplan-progress").then(function (c) {
      return c.put("./progress.json", new Response(JSON.stringify(state), { headers: { "Content-Type": "application/json" } }));
    }).catch(function () {});
  }

  function checkReminders() {
    if (!pushSupported()) return;
    navigator.serviceWorker.ready
      .then(function (reg) { return reg.pushManager.getSubscription(); })
      .then(function (sub) { if (sub) { remind.sub = sub; render(); } })
      .catch(function () {});
  }

  function turnOnReminders() {
    if (!pushSupported()) { toast("This browser can’t show reminders."); return; }
    if (!CFG.vapidPublicKey || CFG.vapidPublicKey.indexOf("__") === 0) { toast("Reminders aren’t set up on GitHub yet."); return; }
    Promise.resolve(Notification.requestPermission()).then(function (perm) {
      if (perm !== "granted") {
        render();
        toast("Notifications are blocked. Allow them for Study Plan in your phone’s settings, then try again.");
        return null;
      }
      return navigator.serviceWorker.ready.then(function (reg) {
        return reg.pushManager.getSubscription().then(function (existing) {
          return existing || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(CFG.vapidPublicKey) });
        });
      });
    }).then(function (sub) {
      if (!sub) return;
      remind.sub = sub;
      render();
      toast("Reminder turned on. Finish the steps below.");
    }).catch(function () {
      toast("Couldn’t turn on the reminder. Check your connection and try again.");
    });
  }

  function turnOffReminders() {
    if (!remind.sub) return;
    remind.sub.unsubscribe().then(function () {
      remind.sub = null;
      render();
      toast("Reminder turned off on this device");
    }, function () { toast("Couldn’t turn off the reminder. Try again."); });
  }

  function copyReminderCode() {
    var code = reminderCode(), box = document.getElementById("rem-code");
    function fallback() {
      if (box) { box.focus(); box.select(); }
      toast("Select the code in the box and copy it.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(function () { toast("Reminder code copied"); }, fallback);
    else fallback();
  }

  function previewReminder() {
    var m = window.buildReminder(P, state, new Date());
    navigator.serviceWorker.ready.then(function (reg) {
      return reg.showNotification(m.title, { body: m.body, icon: "icons/icon-192.png", badge: "icons/badge-96.png", tag: "daily-reminder" });
    }).then(function () { toast("Preview sent. Check your notifications."); }, function () { toast("Couldn’t show a notification on this device."); });
  }

  function reminderBanner() {
    if (!pushSupported() || !isStandalone() || remind.sub || prefs.hideReminderTip || Notification.permission === "denied") return "";
    return '<div class="banner"><p><b>Get a daily reminder</b>One notification each morning with today’s courses.</p>' +
      '<button type="button" class="linkbtn" data-act="tab" data-tab="guide">Set it up</button>' +
      '<button type="button" class="x" data-act="hide-remind" aria-label="Dismiss">' + ICON.close + "</button></div>";
  }

  function reminderSection() {
    var time = esc(CFG.timeLabel || "8:00 a.m.");
    var h = '<section class="remind" aria-labelledby="h-remind"><h2 class="ab-title" id="h-remind">Daily reminder</h2>';
    if (!pushSupported()) {
      h += (isIOS() && !isStandalone())
        ? '<p class="sub">On iPhone, reminders only work in the Home Screen app. Add Study Plan to your Home Screen with the steps below, open it from its icon, then come back to this tab.</p>'
        : '<p class="sub">This browser can’t show reminders. On Android, open the app in Chrome. On iPhone, use the Home Screen app (iOS 16.4 or later).</p>';
      return h + "</section>";
    }
    if (Notification.permission === "denied") {
      return h + '<p class="sub">Notifications are blocked for this app. iPhone: Settings → Notifications → Study Plan. Android: press and hold the app icon → App info → Notifications. Then reopen the app.</p></section>';
    }
    if (!remind.sub) {
      return h + '<p class="sub">One notification a day at ' + time + ' Guelph time with today’s courses from the day plan, how many of this week’s tasks are done, and a heads-up when a midterm or exam is within a week.</p>' +
        '<div class="btns"><button type="button" class="btn" data-act="remind-on">Turn on daily reminder</button></div></section>';
    }
    h += '<p class="state on"><i></i>On for this device · every day at ' + time + "</p>" +
      '<ol class="steps">' +
        '<li><span>Copy your reminder code.</span><textarea id="rem-code" readonly spellcheck="false" aria-label="Reminder code">' + esc(reminderCode()) + '</textarea><span class="btns"><button type="button" class="btn" data-act="remind-copy">Copy reminder code</button></span></li>' +
        '<li><span>On GitHub, add a secret named <span class="kv">PUSH_SUBSCRIPTIONS</span> and paste the code as its value, then tap <b>Add secret</b>. For more than one device, put each code on its own line.</span><span class="btns"><a class="btn ghost" href="https://github.com/' + esc(CFG.repo || "") + '/settings/secrets/actions/new" target="_blank" rel="noopener">Open GitHub secrets</a></span></li>' +
        '<li><span>Check that notifications appear on this device.</span><span class="btns"><button type="button" class="btn ghost" data-act="remind-preview">Show a preview now</button></span></li>' +
      "</ol>" +
      '<p class="sub">You only do this once per device. If you reinstall the app, turn the reminder on again and replace the code on GitHub.</p>' +
      '<div class="btns"><button type="button" class="linkbtn" data-act="remind-off">Turn off reminder on this device</button></div>';
    return h + "</section>";
  }

  /* ---------- progress codes ---------- */

  function makeCode() {
    var payload = JSON.stringify({ d: Object.keys(state.done), t: state.dates, q: state.quiz, k: state.cards, x: state.exams, tt: state.timetable, u: state.updated });
    return "SP1-" + btoa(unescape(encodeURIComponent(payload)));
  }
  function readCode(str) {
    str = String(str || "").replace(/\s+/g, "");
    if (str.indexOf("SP1-") !== 0) return null;
    try {
      var o = JSON.parse(decodeURIComponent(escape(atob(str.slice(4)))));
      var done = {};
      (Array.isArray(o.d) ? o.d : []).forEach(function (k) { done[k] = true; });
      return norm({ done: done, dates: o.t, quiz: o.q, cards: o.k, exams: o.x, timetable: o.tt, updated: o.u });
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
    Object.keys(incoming.quiz).forEach(function (k) {
      if (!state.quiz[k] || incoming.updated > state.updated) state.quiz[k] = incoming.quiz[k];
    });
    Object.keys(incoming.cards).forEach(function (k) {
      if (!state.cards[k] || incoming.updated > state.updated) state.cards[k] = incoming.cards[k];
    });
    if (incoming.timetable.length && (!state.timetable.length || incoming.updated > state.updated)) state.timetable = incoming.timetable;
    Object.keys(incoming.exams).forEach(function (k) {
      var mine = state.exams[k] || [], seen = mine.map(function (a) { return a.at; });
      var merged = mine.concat(incoming.exams[k].filter(function (a) { return seen.indexOf(a.at) < 0; }));
      merged.sort(function (a, b) { return a.at - b.at; });
      state.exams[k] = merged.slice(-10);
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
    if (act === "exam-back") { tab = "exams"; render({ top: true }); }
    if (act === "tt-cancel") ttClose();
    if (act === "quiz-back") {
      if (quiz.from === "week") weekIdx = Number(quiz.id.split("-")[0].slice(1)) - 1;
      tab = quiz.from;
      render({ top: true });
    }
  });

  view.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-act], [role=\"button\"][data-act]");
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
    else if (act === "quiz") openQuiz(b.getAttribute("data-id"));
    else if (act === "exam-open") openExam(b.getAttribute("data-c"));
    else if (act === "tt-add") ttOpenForm(null);
    else if (act === "tt-edit") ttOpenForm(b.getAttribute("data-id"));
    else if (act === "tt-cancel") ttClose();
    else if (act === "tt-type" && tt.form) {
      tt.form.type = b.getAttribute("data-v");
      b.parentNode.querySelectorAll("button").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
    }
    else if (act === "tt-day" && tt.form) {
      var dv = Number(b.getAttribute("data-v")), di = tt.form.days.indexOf(dv);
      if (di >= 0) tt.form.days.splice(di, 1); else tt.form.days.push(dv);
      b.setAttribute("aria-pressed", String(di < 0));
    }
    else if (act === "tt-delete" && tt.form) {
      if (!tt.confirmDelete) { tt.confirmDelete = true; b.textContent = "Tap again to delete this class"; }
      else {
        var delId = tt.form.id;
        state.timetable = state.timetable.filter(function (c) { return c.id !== delId; });
        save();
        ttClose();
        toast("Class deleted");
      }
    }
    else if (act === "tt-copy") ttCopy();
    else if (act === "tt-paste") { tt.pasteOpen = !tt.pasteOpen; render(); var tb = document.getElementById("tt-code-in"); if (tb) tb.focus(); }
    else if (act === "tt-import") {
      var tbox = document.getElementById("tt-code-in"), loaded = ttRead(tbox && tbox.value);
      if (!loaded) { toast("That isn’t a timetable code. It should start with TT1-."); }
      else {
        state.timetable = loaded;
        save();
        tt.pasteOpen = false;
        render();
        toast("Timetable loaded: " + loaded.length + (loaded.length === 1 ? " class" : " classes"));
      }
    }
    else if (act === "exam-start") startExam(b.getAttribute("data-timed") === "1");
    else if (act === "exam-continue") { ex.view = "taking"; render({ top: true }); }
    else if (act === "exam-discard") {
      if (!ex.confirmDiscard) { ex.confirmDiscard = true; render(); }
      else { delete drafts[ex.course]; saveDrafts(); ex.confirmDiscard = false; render(); toast("Answers discarded"); }
    }
    else if (act === "exam-pick") {
      var pd = drafts[ex.course];
      if (pd) {
        var pi = b.getAttribute("data-i"), pj = Number(b.getAttribute("data-j"));
        pd.mc[pi] = pj;
        saveDrafts();
        ex.confirmSubmit = false;
        b.parentNode.querySelectorAll(".opt").forEach(function (o) {
          var on = o === b;
          o.classList.toggle("on", on);
          o.setAttribute("aria-checked", String(on));
        });
        var prog = document.getElementById("exam-progress");
        if (prog) prog.textContent = Object.keys(pd.mc).length + " of " + mcCount(EXAMS[ex.course]) + " multiple choice answered";
      }
    }
    else if (act === "exam-submit") {
      var sd = drafts[ex.course], left = sd ? mcCount(EXAMS[ex.course]) - Object.keys(sd.mc).length : 0;
      if (left && b.getAttribute("data-force") !== "1") { ex.confirmSubmit = true; render(); toast(left + (left === 1 ? " question is" : " questions are") + " unanswered"); }
      else finalizeExam(ex.course, false);
    }
    else if (act === "exam-keep") { ex.confirmSubmit = false; render(); }
    else if (act === "exam-results") { ex.view = "results"; render({ top: true }); }
    else if (act === "exam-retake") { ex.view = "intro"; ex.confirmDiscard = false; render({ top: true }); }
    else if (act === "exam-back") { tab = "exams"; render({ top: true }); }
    else if (act === "cards-for") {
      fc.course = b.getAttribute("data-c");
      fc.range = "week";
      fc.week = Number(b.getAttribute("data-w"));
      fc.mode = "study";
      fcResetDeck();
      tab = "cards";
      render({ top: true });
    }
    else if (act === "fc-course") { fc.course = b.getAttribute("data-v"); prefs.fcCourse = fc.course; savePrefs(); fcResetDeck(); render(); }
    else if (act === "fc-range") {
      fc.range = b.getAttribute("data-v");
      if (fc.range !== "week") { fc.week = null; prefs.fcRange = fc.range; savePrefs(); }
      fcResetDeck();
      render();
    }
    else if (act === "fc-mode") { fc.mode = b.getAttribute("data-v"); prefs.fcMode = fc.mode; savePrefs(); render(); }
    else if (act === "fc-flip") {
      fc.flipped = !fc.flipped;
      render();
      var cardEl = view.querySelector(".fc-card");
      if (cardEl) cardEl.focus({ preventScroll: true });
    }
    else if (act === "fc-mark") {
      var cur = fcDeck()[fc.pos];
      if (cur) { state.cards[cur.id] = b.getAttribute("data-v"); save(); }
      fc.pos++;
      fc.flipped = false;
      render();
    }
    else if (act === "fc-next") fcStep(1);
    else if (act === "fc-prev") fcStep(-1);
    else if (act === "fc-shuffle") {
      var ord = fc.order || [];
      for (var si = ord.length - 1; si > 0; si--) { var sj = Math.floor(Math.random() * (si + 1)); var tmp = ord[si]; ord[si] = ord[sj]; ord[sj] = tmp; }
      fc.pos = 0;
      fc.flipped = false;
      render();
      toast("Cards shuffled");
    }
    else if (act === "fc-restart") { fcResetDeck(); render({ top: true }); }
    else if (act === "fc-learning") { fc.order = null; fc.onlyLearning = true; render({ top: true }); }
    else if (act === "reveal") {
      var rq = b.getAttribute("data-q");
      quiz.shown[rq] = true;
      render();
      var gotBtn = view.querySelector('[data-focus="got-' + rq + '"]');
      if (gotBtn) gotBtn.focus({ preventScroll: true });
    }
    else if (act === "mark") {
      var mq = b.getAttribute("data-q"), mv = b.getAttribute("data-v");
      if (state.quiz[mq] === mv) delete state.quiz[mq]; else state.quiz[mq] = mv;
      save();
      render();
    }
    else if (act === "quiz-reveal-all") {
      (QUESTIONS[quiz.id] || []).forEach(function (_, i) { quiz.shown[quiz.id + "-q" + (i + 1)] = true; });
      render();
    }
    else if (act === "quiz-reset") {
      Object.keys(state.quiz).forEach(function (k) { if (k.indexOf(quiz.id + "-q") === 0) delete state.quiz[k]; });
      save();
      render();
      toast("Marks cleared for this topic");
    }
    else if (act === "remind-on") turnOnReminders();
    else if (act === "remind-off") turnOffReminders();
    else if (act === "remind-copy") copyReminderCode();
    else if (act === "remind-preview") previewReminder();
    else if (act === "hide-remind") { prefs.hideReminderTip = true; savePrefs(); render(); }
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
    } else if (t.matches("input[data-rubric]")) {
      var att = latestAttempt(ex.course), ij = t.getAttribute("data-rubric").split("-");
      if (att) {
        att.pts[ij[0]] = att.pts[ij[0]] || [];
        att.pts[ij[0]][Number(ij[1])] = t.checked ? 1 : 0;
        save();
        render();
      }
    } else if (t.matches("input[data-date]")) {
      var k = t.getAttribute("data-date");
      if (DATE_RE.test(t.value)) state.dates[k] = t.value; else delete state.dates[k];
      save();
      render();
    }
  });

  view.addEventListener("input", function (e) {
    var t = e.target;
    if (t.matches && t.matches("input[data-tt]") && tt.form) {
      tt.form[t.getAttribute("data-tt")] = t.value;
      if (tt.error) { tt.error = ""; var fe = view.querySelector(".form-error"); if (fe) fe.textContent = ""; }
      return;
    }
    if (t.matches && t.matches("textarea[data-note]") && drafts[ex.course]) {
      drafts[ex.course].notes[t.getAttribute("data-note")] = t.value;
      saveDrafts();
    }
  });

  view.addEventListener("submit", function (e) {
    if (e.target.matches && e.target.matches('[data-form="tt"]')) { e.preventDefault(); ttSave(); }
  });

  view.addEventListener("keydown", function (e) {
    var el = e.target.closest && e.target.closest('[role="button"][data-act]');
    if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); el.click(); }
  });

  var sx = null, sy = null;
  view.addEventListener("touchstart", function (e) {
    var swipeable = tab === "week" || (tab === "cards" && fc.mode === "study");
    if (!swipeable || e.touches.length !== 1) { sx = null; return; }
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  view.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      if (tab === "cards") fcStep(dx < 0 ? 1 : -1);
      else stepWeek(dx < 0 ? 1 : -1);
    }
  }, { passive: true });

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installEvent = e;
    if (tab === "guide") render();
  });
  window.addEventListener("appinstalled", function () { installEvent = null; render(); });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && tab !== "guide" && tab !== "exam" && tab !== "ttedit") render();
  });

  render();
  syncToWorker();
  checkReminders();
  examTick();
  setInterval(examTick, 1000);

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }
})();
