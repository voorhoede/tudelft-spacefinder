/**
 * Prevent browsers from automatically prompting users to install the app to homescreen.
 * @see https://developers.google.com/web/fundamentals/app-install-banners/#listen_for_beforeinstallprompt
 */
export default ({ store }) => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    store.commit('setInstallPromptEvent', event)
  })
}
