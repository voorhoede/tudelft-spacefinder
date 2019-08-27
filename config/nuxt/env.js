import dotenv from 'dotenv-safe'

dotenv.config() // load env variables from .env file into process.env

/**
 * pass Node env variables to Nuxt env
 * @see https://nuxtjs.org/api/configuration-env/
 */
export default {
  // pass Netlify's deploy URL (https://www.netlify.com/docs/continuous-deployment/#environment-variables)
  BASE_URL: process.env.URL,
  MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
}
