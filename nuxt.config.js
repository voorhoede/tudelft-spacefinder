import css from './config/nuxt/css'
import head from './config/nuxt/head'
import generate from './config/nuxt/generate'
import modules from './config/nuxt/modules'

export default {
  css,
  generate,
  head,
  loading: { color: '#fff' },
  mode: 'universal',
  modules,
  plugins: [],
  srcDir: 'src/'
}
