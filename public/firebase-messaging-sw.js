

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
  "/Submit Add/ad.js",
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1')
      .then(res => {
        console.log('wait.........!')
        return res.addAll(staticAssets);
      })
  );
  console.log('installed');
  // var cache = caches.open('v1');
  // cache.addAll(staticAssets);
});

self.addEventListener('activate', (event) => {
  console.log('activated');
});

self.addEventListener('fetch', (ev) => {
  console.log('Fetch from Service Worker ', ev);
  const req = ev.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    ev.respondWith(cacheFirst(req));
  }
  return ev.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
  let cacheRes = await caches.match(req);
  return cacheRes || fetch(req);
}

async function networkFirst(req) {
  const dynamicCache = await caches.open('v1-dynamic');
  try {
    const networkResponse = await fetch(req);
    dynamicCache.put(req, networkResponse.clone());
    return networkResponse;
  } catch (err) { 
    const cacheResponse = await caches.match(req);
    return cacheResponse;
  }
}