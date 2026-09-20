"use client";

import { useEffect } from "react";

// Registrerer service workeren i nettleseren. Må være en klientkomponent
// siden navigator/service worker-API kun finnes i nettleseren, ikke på
// serveren. Feiler stille (f.eks. i nettlesere uten støtte) — dette skal
// aldri kunne stoppe resten av siden fra å fungere.
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Bevisst stille feilhåndtering — manglende service worker skal ikke
      // påvirke resten av opplevelsen.
    });
  }, []);

  return null;
}
