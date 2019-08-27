const startPage = '/200.html'
/**
 * @see https://pwa.nuxtjs.org
 */
export default [
  '@nuxtjs/pwa',
  {
    manifest: {
      name: 'TU Delft\nSpacefinder',
      short_name: 'Spacefinder',
      background_color: '#00a6d6',
      theme_color: '#00a6d6',
      display: 'standalone',
      crossorigin: 'use-credentials',
      start_url: `${startPage}?utm_source=homescreen`
    },
    meta: {
      mobileApp: true,
      mobileAppIOS: true
    },
    workbox: {
      preCaching: [startPage],
      offlinePage: startPage,
      runtimeCaching: [
        {
          urlPattern: 'https://www.datocms-assets.com/.*',
          handler: 'cacheFirst',
          method: 'GET'
        }
      ]
    }
  }
]
