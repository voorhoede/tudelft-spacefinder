import nuxtI18n from './modules/nuxt-i18n'
import nuxtPwa from './modules/nuxt-pwa'

/**
 * @see https://nuxtjs.org/api/configuration-modules
 */
export default [nuxtI18n, nuxtPwa, '@nuxtjs/svg-sprite'].filter(
  Boolean
)
