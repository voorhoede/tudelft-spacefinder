export default [
  '@nuxtjs/sitemap',
  {
    sitemap: {
      path: '/sitemap.xml',
      hostname: process.env.BASE_URL,
    },
  },
]
