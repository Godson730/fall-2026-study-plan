/* Writes the daily reminder text. Shared by the app (preview) and the service worker (real notifications). */
(function (root) {
  "use strict";

  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // Matches the day plan in the Guide tab.
  var DAY_PLAN = { 1: ["c1050", "c1500"], 2: ["c2700", "c2580"], 3: ["c1050", "c1500"], 4: ["c2700", "c2580"], 5: "catch-up", 6: ["c1500", "c2580"], 0: "review" };

  function day(iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }

  root.buildReminder = function (plan, saved, now) {
    var done = (saved && saved.done) || {};
    var dates = (saved && saved.dates) || {};
    var t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var courses = plan.COURSES, weeks = plan.WEEKS;
    function course(key) { return courses.filter(function (c) { return c.key === key; })[0]; }

    var soon = null;
    courses.forEach(function (c) {
      ["mid", "final"].forEach(function (kind) {
        var v = dates[c.key + "-" + kind];
        if (!v) return;
        var n = Math.round((day(v).getTime() - t.getTime()) / 86400000);
        if (n >= 0 && n <= 7 && (!soon || n < soon.n)) soon = { c: c, kind: kind, n: n };
      });
    });
    var heads = soon
      ? soon.c.code + " " + (soon.kind === "mid" ? "midterm" : "final exam") + " " + (soon.n === 0 ? "today" : soon.n === 1 ? "tomorrow" : "in " + soon.n + " days") + ". "
      : "";

    var w = null;
    weeks.forEach(function (wk) {
      if (t >= day(wk.start) && t <= day(wk.end)) w = wk;
    });

    if (!w) {
      if (t < day(weeks[0].start)) {
        return { title: "Study plan", body: "Week 1 starts Thursday, September 10." };
      }
      if (t <= day(plan.EXAM.end)) {
        var ids = [];
        courses.forEach(function (c) { plan.EXAM_TASKS.forEach(function (x) { ids.push("exam-" + c.key + "-" + x.id); }); });
        var d = ids.filter(function (id) { return done[id]; }).length;
        return { title: "Exam prep · " + DAY_NAMES[t.getDay()], body: heads + d + " of " + ids.length + " exam checklist items done. Open the Exams tab for today’s step." };
      }
      return { title: "Study plan", body: "The Fall 2026 semester is over. Well done." };
    }

    var weekDone = courses.filter(function (c) { return done["w" + w.n + "-" + c.key]; }).length;
    var today = DAY_PLAN[t.getDay()];
    var body;
    if (Array.isArray(today)) {
      var todo = today.filter(function (k) { return !done["w" + w.n + "-" + k]; });
      body = todo.length
        ? "Today: " + todo.map(function (k) { return course(k).code + " – " + w.tasks[k].t; }).join("; ") + "."
        : "Today’s courses are already ticked. Use the time to review or get ahead.";
    } else if (today === "catch-up") {
      var left = courses.filter(function (c) { return !done["w" + w.n + "-" + c.key]; });
      body = left.length
        ? "Catch-up day: finish " + left.map(function (c) { return c.code; }).join(", ") + "."
        : "All four tasks are done. Catch up on flashcards or review.";
    } else {
      body = "Sunday review: go over the last two weeks, then read next week’s topics.";
    }
    return { title: "Week " + w.n + " · " + DAY_NAMES[t.getDay()], body: heads + body + " " + weekDone + " of 4 done this week." };
  };
})(typeof self !== "undefined" ? self : this);
