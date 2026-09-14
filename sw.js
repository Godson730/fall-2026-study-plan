/* Offline support: keep a copy of every app file so the plan opens without a connection. */
importScripts("./data.js", "./reminder.js");

var CACHE = "studyplan-v6";
var PROGRESS = "studyplan-progress"; /* the app keeps a copy of your ticks here for reminders */
var FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./app.js",
  "./config.js",
  "./reminder.js",
  "./questions.js",
  "./flashcards.js",
  "./practice-exams.js",
  "./practice-finals.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/badge-96.png",
  "./fonts/fonts.css",
  "./fonts/IBMPlexMono-400-latin-ext.woff2",
  "./fonts/IBMPlexMono-400-latin.woff2",
  "./fonts/IBMPlexMono-500-latin-ext.woff2",
  "./fonts/IBMPlexMono-500-latin.woff2",
  "./fonts/IBMPlexSans-400-greek.woff2",
  "./fonts/IBMPlexSans-400-latin-ext.woff2",
  "./fonts/IBMPlexSans-400-latin.woff2",
  "./fonts/IBMPlexSans-500-greek.woff2",
  "./fonts/IBMPlexSans-500-latin-ext.woff2",
  "./fonts/IBMPlexSans-500-latin.woff2",
  "./fonts/IBMPlexSans-600-greek.woff2",
  "./fonts/IBMPlexSans-600-latin-ext.woff2",
  "./fonts/IBMPlexSans-600-latin.woff2",
  "./fonts/Newsreader-400-latin-ext.woff2",
  "./fonts/Newsreader-400-latin.woff2",
  "./fonts/Newsreader-600-latin-ext.woff2",
  "./fonts/Newsreader-600-latin.woff2"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE && k !== PROGRESS; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

/* Serve from the cache straight away, and refresh the cached copy in the background. */
self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req, { ignoreSearch: true }).then(function (hit) {
        var network = fetch(req)
          .then(function (res) {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(function () {
            if (hit) return hit;
            if (req.mode === "navigate") return cache.match("./index.html");
            return Response.error();
          });
        if (hit) {
          event.waitUntil(network.catch(function () {}));
          return hit;
        }
        return network;
      });
    })
  );
});

/* Daily reminder: GitHub wakes the phone once a day, and the text is written here from your own ticks. */
self.addEventListener("push", function (event) {
  var kind = "daily";
  try { var p = event.data && event.data.json(); if (p && p.type) kind = p.type; } catch (e) {}
  event.waitUntil(
    caches.open(PROGRESS)
      .then(function (c) { return c.match("./progress.json"); })
      .then(function (res) { return res ? res.json() : null; })
      .catch(function () { return null; })
      .then(function (saved) {
        var m = self.buildReminder(self.PLAN, saved, new Date());
        var title = kind === "test" ? "Reminders are working" : m.title;
        var body = kind === "test" ? m.title + ": " + m.body : m.body;
        return self.registration.showNotification(title, {
          body: body,
          icon: "icons/icon-192.png",
          badge: "icons/badge-96.png",
          tag: "daily-reminder",
          renotify: true,
          data: { url: "./" }
        });
      })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ("focus" in list[i]) return list[i].focus();
      }
      return self.clients.openWindow("./");
    })
  );
});
