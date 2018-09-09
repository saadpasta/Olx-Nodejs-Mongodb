var cacheName = "OLX-Pak ";
var filesToCache = [
  "/",
  "/app.js",
  "/views/about.handlebars",
  "/views/addView.handlebars",
  "/views/index.handlebars",
  "/views/ideas/index.handlebars",
  "/views/ideas/edit.handlebars",
  "/views/ideas/add.handlebars",
  "/views/layouts/main.handlebars",
  "/views/layouts/main.handlebars",
  "/views/partials/_errors.handlebars",
  "/views/partials/_msg.handlebars",
  "/views/partials/_navbar.handlebars",
  "/views/users/login.handlebars",
  "/views/partials/register.handlebars",
  "/routes/ideas.handlebars",
  "/routes/users.handlebars",
  "/public/css/style.css",
  "/public/css/font2.woff2",
  "/public/css/font.woff2",
  "/public/img/logo.png",
  "/models/Idea.js",
  "/models/User.js",
  "/helpers/auth.js",
  "/config/passport.js",


]

self.addEventListener("install", function(e) {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", function(e) {
  console.log("[ServiceWorker] Activate");
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== cacheName) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  console.log("[Service Worker] Fetch", e.request.url);
  var dataUrl = "https://query.yahooapis.com/v1/public/yql";
  /*
       * The app is asking for app shell files. In this scenario the app uses the
       * "Cache, falling back to the network" offline strategy:
       * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
       */
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
