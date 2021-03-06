/**
 * @see https://nuxtjs.org/api/configuration-head
 */
export default {
  title: 'TU Delft Spacefinder',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#00a6d6' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    // all other app icons are generated and added by the @nuxt/pwa module
    { rel: 'dns-prefetch', href: 'https://api.mapbox.com/' },
    { rel: 'dns-prefetch', href: 'https://www.datocms-assets.com/' },
  ],
  script: [
    { src: '//siteimproveanalytics.com/js/siteanalyze_6005654.js', defer: true },
  ],
}
