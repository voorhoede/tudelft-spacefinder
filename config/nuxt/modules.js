import nuxtI18n from './modules/nuxt-i18n'
import nuxtPwa from './modules/nuxt-pwa'
import nuxtServerPush from './modules/nuxt-server-push'
import nuxtRobots from './modules/nuxt-robots'
import nuxtSitemap from './modules/nuxt-sitemap'

/**
 * @see https://nuxtjs.org/api/configuration-modules
 */
export default [nuxtI18n, nuxtPwa, nuxtServerPush, '@nuxtjs/svg-sprite', nuxtRobots, nuxtSitemap].filter(
  Boolean
)
