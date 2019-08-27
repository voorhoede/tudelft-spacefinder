import Vue from 'vue'

const enforceTrailingSlash = url => (url.endsWith('/') ? url : `${url}/`)

Vue.mixin({
  created() {
    const _localePath = this.localePath
    const _switchLocalePath = this.switchLocalePath

    /**
     * Extends Nuxt I18n's localePath with an enforced trailing slash
     * @see https://nuxt-community.github.io/nuxt-i18n/basic-usage.html#nuxt-link
     * @param {string|object} options   name of route (string) or object for route
     * @param {string} options.name     name of route
     * @param {object} options.params   route parameters
     * @param {string} [locale]
     */
    this.localePath = (options, locale) => {
      const url = _localePath(options, locale)
      return enforceTrailingSlash(url)
    }

    /**
     * Extends Nuxt I18n's switchLocalePath with an enforced trailing slash
     * @see https://nuxt-community.github.io/nuxt-i18n/lang-switcher.html
     * @param {string} locale
     */
    this.switchLocalePath = (locale) => {
      const url = _switchLocalePath(locale)
      return enforceTrailingSlash(url)
    }
  },
})
