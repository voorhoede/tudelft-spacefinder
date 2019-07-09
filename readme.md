# tudelft-spacefinder

> App to easily find available spaces on the TU Delft Campus.

This app is a universal [Vue.js](https://vuejs.org/) app made with [Nuxt.js](https://nuxtjs.org/). The app has multi-language support (English and Dutch) using [Nuxt I18n](https://nuxt-community.github.io/nuxt-i18n/).

## Development

### Scripts

This project requires [Node.js](http://nodejs.org/) (>= v8) and [npm](https://npmjs.org/) (comes with Node).

After installing dependencies using `npm install` the following scripts are available:

`npm run ...` | Description
---|---
`analyze` | Analyze the bundles created during build.
`build` | Builds app for production to `dist/`.
`dev` | Serves app on [`http://localhost:3463`](http://localhost:3463) ("find" in T9) with hot reloading.
`proxy` | Exposes app on localhost to world wide web for testing on other devices.
`start` | Serves production version of client app from (`/dist/`) on [`http://localhost:3464`](http://localhost:3464).
