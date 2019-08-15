/**
 * @see https://nuxtjs.org/api/configuration-build
 */
module.exports = {
  optimization: {
    minimize: false
  },
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
  terser: {
    sourceMap: true
  },
  extend(config, { isClient }) {
    // Extend only webpack config for client-bundle
    if (isClient) {
      config.devtool = '#source-map'
    }
  }
}
