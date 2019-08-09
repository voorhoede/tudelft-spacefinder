import nuxtI18n from './modules/nuxt-i18n'
import nuxtPwa from './modules/nuxt-pwa'
import nuxtServerPush from './modules/nuxt-server-push'

/**
 * @see https://nuxtjs.org/api/configuration-modules
 */
export default [nuxtI18n, nuxtPwa, nuxtServerPush, '@nuxtjs/svg-sprite'].filter(
  Boolean
)
