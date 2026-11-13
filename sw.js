/* Rrjeti Profesional TIK — service worker
   Kombinon: (1) njoftimet push të OneSignal, (2) funksionimin bazë jashtë linje. */
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const BASE = "/Rrjeti-profesional-TIK";
const CACHE = "rptik-v2";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request, { cache: "no-cache" }).catch(() => caches.match(`${BASE}/`)));
  }
});
