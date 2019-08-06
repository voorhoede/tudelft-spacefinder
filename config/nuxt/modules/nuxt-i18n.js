import pages from '../../../src/pages.i18n'
const locales = ['en', 'nl']
const defaultLocale = locales[0]

/**
 * @see https://nuxt-community.github.io/nuxt-i18n/
 */
export default [
  'nuxt-i18n',
  {
    defaultLocale,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'nf_lang' // https://www.netlify.com/docs/redirects/#geoip-and-language-based-redirects
    },
    lazy: true,
    langDir: 'static/data/',
    locales: locales.map((locale) => {
      return {
        code: locale,
        file: `${locale}/messages.json`,
        iso: locale,
        name: locale
      }
    }),
    parsePages: false,
    pages: pages,
    rootRedirect: defaultLocale,
    strategy: 'prefix',
    vueI18n: {
      fallbackLocale: defaultLocale
    }
  }
]
