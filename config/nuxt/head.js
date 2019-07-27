/**
 * @see https://nuxtjs.org/api/configuration-head
 */
export default {
  title: 'TU Delft Spacefinder',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#00a6d6' },
    { name: 'robots', content: 'noindex' } // https://support.google.com/webmasters/answer/93710?hl=en
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    // all other app icons are generated and added by the @nuxt/pwa module
    { rel: 'dns-prefetch', href: 'https://api.mapbox.com/' }
  ]
}
