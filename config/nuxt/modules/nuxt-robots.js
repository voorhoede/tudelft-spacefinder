import env from '../env'

/**
 * Requires '@nuxtjs/robots' module to be loaded.
 * @see https://github.com/nuxt-community/robots-module
 */

export default [
  '@nuxtjs/robots',
  {
    Sitemap: `${env.BASE_URL}/sitemap.xml`,
  },
]
