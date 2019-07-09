/**
 * @see https://nuxtjs.org/api/configuration-build
 */
module.exports = {
    postcss: {
      'postcss-import': {},
      'postcss-custom-properties': {
        importFrom: './src/components/app-core/variables.css',
        preserve: false,
      },
      'autoprefixer': {}
    },
  }
  