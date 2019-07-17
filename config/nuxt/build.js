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
    extend (config) {
      config.module.rules.forEach((rule) => {
        if (rule.test.toString() === '/\\.(png|jpe?g|gif|svg|webp)$/i') {
          rule.test = /\\.(png|jpe?g|gif|webp)$/i
        }
      })

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader',
      })
    },
  }
  