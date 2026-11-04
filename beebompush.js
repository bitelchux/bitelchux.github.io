/**
 * ============================================================================
 * SERVICE WORKER COMÚN DE NOTIFICACIONES PUSH
 * ============================================================================
 * Va en bitelchux.github.io/beebompush.js y se carga desde el /push-sw.js
 * de cada web con importScripts(). Se ejecuta en el origen de esa web.
 *
 * Payload esperado (JSON) al enviar una notificación:
 *   {
 *     "title": "Título",            // por defecto: dominio de la web
 *     "body": "Texto",
 *     "url": "/ruta-o-url-completa", // a dónde lleva el clic (por defecto "/")
 *     "icon": "https://...png",      // por defecto /favicon.ico de la web
 *     "image": "https://...jpg",     // imagen grande (opcional)
 *     "badge": "https://...png",     // icono monocromo de Android (opcional)
 *     "tag": "novedad-123",          // agrupa/sustituye notificaciones (opcional)
 *     "requireInteraction": false
 *   }
 */

// Deben coincidir con CONFIG.PUSH del appmanager.js
const SUBSCRIBE_URL = 'https://pbnstats.promocionesycolecciones.com/push/subscribe.php';
const VAPID_PUBLIC_KEY = ''; // ← misma clave pública VAPID que en appmanager.js

const SITE = self.location.hostname.toLowerCase().replace(/^www\./, '');

const base64UrlToUint8Array = (b64) => {
  const padded = (b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(padded);
  return Uint8Array.from(bin, c => c.charCodeAt(0));
};

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

/* ---------- Recepción de la notificación ---------- */
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try { data = event.data.json(); } catch { data = { body: event.data.text() }; }
  }

  const title = data.title || SITE;
  const options = {
    body: data.body || '',
    icon: data.icon || '/favicon.ico',
    data: { url: data.url || '/' }
  };
  if (data.image) options.image = data.image;
  if (data.badge) options.badge = data.badge;
  if (data.tag) options.tag = data.tag;
  if (data.requireInteraction) options.requireInteraction = true;

  event.waitUntil(self.registration.showNotification(title, options));
});

/* ---------- Clic en la notificación ---------- */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/', self.location.origin).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows.find(w => w.url === target);
    if (existing && 'focus' in existing) return existing.focus();
    return self.clients.openWindow(target);
  })());
});

/* ---------- El navegador renueva la suscripción ---------- */
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil((async () => {
    const subscription = event.newSubscription
      || await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToUint8Array(VAPID_PUBLIC_KEY)
      });

    await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site: SITE,
        subscription: subscription.toJSON(),
        old_endpoint: event.oldSubscription?.endpoint || null
      })
    });
  })());
});
