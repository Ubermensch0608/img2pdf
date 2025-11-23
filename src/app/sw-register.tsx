"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            if (process.env.NODE_ENV === "development") {
              console.log("서비스 워커 등록 성공:", registration.scope);
            }
          })
          .catch((error) => {
            if (process.env.NODE_ENV === "development") {
              console.error("서비스 워커 등록 실패:", error);
            }
          });
      });
    }
  }, []);

  return null;
}
