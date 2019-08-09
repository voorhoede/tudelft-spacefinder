/**
 * @see https://github.com/jmblog/nuxt-netlify-http2-server-push#setup
 */

export default [
  'nuxt-netlify-http2-server-push',
  {
    // Specify relative path to the dist directory and its content type
    resources: [
      { path: '_nuxt/fonts/*.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
    ]
  }
]
