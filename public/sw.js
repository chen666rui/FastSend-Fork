import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

async function getResponseByCache(cacheName, request) {
  return caches.open(cacheName).then(async (cache) => {
    if (
      !request.url.includes(location.origin) ||
      request.url.includes(location.origin + '/api') ||
      request.method !== 'GET' ||
      request.url === location.origin + '/' ||
      request.url === location.origin + '/zh'
    ) {
      // 不缓存
      return fetch(request)
    }
    let res = await cache.match(request)
    if (res) {
      // 匹配成功，异步更新缓存
      cache.add(request)
      return res
    } else {
      // 匹配失败，同步更新缓存
      res = await fetch(request)
      await cache.put(request, res.clone())
      return res
    }
  })
}

self.addEventListener('install', (e) => {
  console.log('Install')
  caches.delete('main')
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  console.log('Activate')
})

self.addEventListener('fetch', (e) => {
  // e.respondWith(getResponseByCache('main', e.request))
  e.respondWith(fetch(e.request))
})
