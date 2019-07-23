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
    { src: '~/plugins/load-data' },
    { src: '~/plugins/persist-state.client' },
    { src: '~/plugins/virtual-scroller' }
  ],
  srcDir: 'src/'
}
