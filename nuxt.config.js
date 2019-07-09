import head from './config/nuxt/head'
import generate from './config/nuxt/generate'
import modules from './config/nuxt/modules'

export default {
  mode: 'universal',
  srcDir: 'src/',
  generate,
  head,
  loading: { color: '#fff' },
  plugins: [],
  modules
}
