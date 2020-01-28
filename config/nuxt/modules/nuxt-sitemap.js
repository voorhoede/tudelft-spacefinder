import routes from '../../routes'
import env from '../env'

/**
 * Requires '@nuxtjs/sitemap' module to be loaded.
 * @see https://github.com/nuxt-community/sitemap-module
 */

export default [
  '@nuxtjs/sitemap',
  {
    hostname: env.BASE_URL,
    routes,
  },
]
