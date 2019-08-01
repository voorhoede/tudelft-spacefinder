import build from './config/nuxt/build'
import css from './config/nuxt/css'
import env from './config/nuxt/env'
import head from './config/nuxt/head'
import generate from './config/nuxt/generate'
import modules from './config/nuxt/modules'

export default {
  build,
  css,
  env,
  generate,
  head,
  loading: { color: '#fff' },
  mode: 'universal',
  modules,
  plugins: [
    '~/plugins/install-prompt.client',
    { src: '~/plugins/load-data' },
    { src: '~/plugins/persist-state', ssr: false },
    { src: '~/plugins/virtual-scroller' }
  ],
  router: {
    middleware: ['history']
  },
  srcDir: 'src/'
}
