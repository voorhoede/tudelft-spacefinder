/**
 * @see https://nuxtjs.org/api/configuration-render
 */
export default {
  bundleRenderer: {
    /**
     * Extend default preload (scripts and styles)
     * with woff2 font files for faster font rendering
     * Default: https://github.com/nuxt/nuxt.js/blob/21aaef3b4825e9b11aeecf7eaa8cd2c3d24fc3ce/packages/config/src/config/render.js#L6
     */
    shouldPreload: (file, type) => {
      if (type === 'script' || type === 'style') {
        return true
      }
      if (type === 'font') {
        return /\.woff2$/.test(file)
      }
    }
  }
}
