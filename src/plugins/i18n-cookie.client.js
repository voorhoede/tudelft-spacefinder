import Cookie from 'js-cookie'

/**
 * Set nf_lang cookie so Netlify uses user selected language
 * @see https://www.netlify.com/docs/redirects/#geoip-and-language-based-redirects
 */
export default ({ app }) => {
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    Cookie.set('nf_lang', newLocale)
  }
}
