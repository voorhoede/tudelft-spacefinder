# tudelft-spacefinder

> App to easily find available spaces on the TU Delft Campus.

This app is a universal [Vue.js](https://vuejs.org/) app made with [Nuxt.js](https://nuxtjs.org/). The app has multi-language support (English and Dutch) using [Nuxt I18n](https://nuxt-community.github.io/nuxt-i18n/).

## Development

### Getting started

* Clone the repository.
* Copy `.env.example` to `.env` and set the environment variables. Copy them from the [Netlify build configuration](https://app.netlify.com/sites/spacefinder/settings/deploys#build-environment-variables) or ask a dev team member. 
* Run app in development mode (`npm run dev`), see [scripts](#scripts).
* Changes on master trigger a new build and deploy to the [live environment](https://spacefinder.netlify.com).

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
