// public/service-worker.js

const CACHE_NAME = "image2pdf-cache-v1";
const OFFLINE_URL = "/"; // 루트 페이지를 오프라인 fallback으로 사용

// 설치 시 미리 캐싱할 리소스 리스트
const PRE_CACHE_URLS = [
  OFFLINE_URL,
  "/favicon.ico",
  "/icon-32.png",
  "/icon-64.png",
  "/icon-128.png",
  "/icon-256.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  console.log("[SW] install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRE_CACHE_URLS);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] activate");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      ),
  );
  self.clients.claim();
});

// 요청 가로채기 (캐시 + 네트워크 전략)
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // 1) 페이지 이동(Navigation) 요청인 경우
  // 예: 주소창에 URL 입력, 링크 클릭 등
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // 우선 네트워크 시도
          const networkResponse = await fetch(request);
          // 정상 응답이면 캐시에 저장해두고 그대로 반환
          const cache = await caches.open(CACHE_NAME);
          cache.put(OFFLINE_URL, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // 네트워크 실패 시, 캐시에 저장된 루트 페이지 반환
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);

          if (cachedResponse) {
            return cachedResponse;
          }

          // 캐시에 루트 페이지가 없으면, 최소한의 응답 반환
          return new Response(
            "오프라인 상태입니다. 그리고 루트 페이지 캐시가 없습니다.",
            {
              status: 503,
              statusText: "Service Unavailable",
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            },
          );
        }
      })(),
    );
    return;
  }

  // 2) 그 외 정적 리소스(GET) 요청은 그냥 네트워크 우선 + 캐시 fallback (옵션)
  if (request.method === "GET") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);

        try {
          const networkResponse = await fetch(request);
          // 원하면 여기서도 캐싱 가능
          // cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          const cachedResponse = await cache.match(request);
          if (cachedResponse) return cachedResponse;

          return new Response("오프라인 상태이며 캐시된 리소스가 없습니다.", {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })(),
    );
  }
});
