/**
 * @see https://nuxtjs.org/api/configuration-build
 */
module.exports = {
  html: {
    /**
     * Overwrite default config to skip minification of CSS & JS to speed up build
     * default: https://github.com/nuxt/nuxt.js/blob/5fa768373da1adfd8c76145b2ec95b7824af93b4/packages/config/src/config/build.js#L93-L94
     */
    minify: {
      collapseBooleanAttributes: true,
      decodeEntities: true,
      minifyCSS: false,
      minifyJS: false,
      processConditionalComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      trimCustomFragments: true,
      useShortDoctype: true
    }
  },
  postcss: {
    'postcss-import': {},
    'postcss-custom-properties': {
      importFrom: './src/components/app-core/variables.css',
      preserve: false
    },
    'autoprefixer': {}
  },
  extend(config) {
    config.module.rules.forEach((rule) => {
      if (rule.test.toString() === '/\\.(png|jpe?g|gif|svg|webp)$/i') {
        rule.test = /\\.(png|jpe?g|gif|webp)$/i
      }
    })

    config.module.rules.push({
      test: /\.svg$/,
      loader: 'vue-svg-loader'
    })
  }
}
