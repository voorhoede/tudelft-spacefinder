import env from '../env'

export default [
  '@nuxtjs/robots',
  {
    Sitemap: `${env.BASE_URL}/sitemap.xml`,
  },
]
