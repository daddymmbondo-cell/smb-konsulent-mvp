// Minimal service worker — kun til stede for at nettsiden skal regnes som
// "installerbar" (Legg til på Hjem-skjerm / Chrome sin installasjonsprompt).
//
// Den gjør BEVISST ingen caching av sider eller data: dette er en side med
// innlogging og ferske tall (kartlegging, rapporter), og feil bufring kunne
// vist utdaterte eller feil data til brukeren. Alle forespørsler går derfor
// rett til nettverket som normalt — service workeren er et rent "pass-through".
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
