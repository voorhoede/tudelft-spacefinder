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
      crossorigin: 'use-credentials'
    },
    workbox: {
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
