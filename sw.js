/* Offline support: keep a copy of every app file so the plan opens without a connection. */
var CACHE = "studyplan-v1";
var FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
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
        return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
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
