import dotenv from 'dotenv-safe'

dotenv.config() // load env variables from .env file into process.env

/**
 * pass Node env variables to Nuxt env
 * @see https://nuxtjs.org/api/configuration-env/
 */
export default {
  MAPBOX_TOKEN: process.env.MAPBOX_TOKEN
}
