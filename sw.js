/* Rrjeti Profesional TIK — service worker */
const BASE = "/Rrjeti-profesional-TIK";
const CACHE = "rptik-v1";

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

/* I njëjti konfigurim si në index.html */
firebase.initializeApp({
  apiKey: "AIzaSyDmgon14YJIHr61bvtZ1hQ421LfidnxmKY",
  authDomain: "rrjeti-profesional-tik.firebaseapp.com",
  projectId: "rrjeti-profesional-tik",
  storageBucket: "rrjeti-profesional-tik.firebasestorage.app",
  messagingSenderId: "765672918027",
  appId: "1:765672918027:web:bf3d7b0baafcc46a544b0e"
});

const messaging = firebase.messaging();

/* Njoftim kur aplikacioni është i mbyllur / në sfond */
messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  self.registration.showNotification(n.title || "Rrjeti Profesional TIK", {
    body: n.body || "",
    icon: `${BASE}/pwa-assets/icon-192-any.png`,
    badge: `${BASE}/pwa-assets/icon-192-any.png`,
    data: payload.data || {},
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) if (c.url.includes(BASE) && "focus" in c) return c.focus();
      return clients.openWindow(BASE + "/");
    })
  );
});

/* Instalueshmëria + përdorim bazë jashtë linje */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(`${BASE}/`))
    );
  }
});
