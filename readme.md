# tudelft-spacefinder
> App to easily find available spaces on the TU Delft Campus.

This app is a universal [Vue.js](https://vuejs.org/) app made with [Nuxt](https://nuxt.com/). The app has multi-language support (English and Dutch).

## Development

### Getting started
* Clone the repository.
* Copy `.env.example` to `.env` and set the environment variables. Copy them from the [Netlify build configuration](https://app.netlify.com/sites/spacefinder/settings/deploys#build-environment-variables) or ask a dev team member. 
* Run `npm ci` to install the dependencies.
* Run app in development mode (`npm run dev`), see [scripts](#scripts).
* Changes on master trigger a new build and deploy to the [live environment](https://spacefinder.netlify.com).

### Scripts
This project requires [Node.js](http://nodejs.org/) (>= v8) and [npm](https://npmjs.org/) (comes with Node).

The following scripts are available:

`npm run ...` | Description
---|---
`analyze` | Analyze the bundles created during build.
`build` | Builds app for production to `dist/`.
`dev` | Serves app on [`http://localhost:3463`](http://localhost:3463) ("find" in T9) with hot reloading.
`proxy` | Exposes app on localhost to world wide web for testing on other devices.
`start` | Serves production version of client app from (`/dist/`) on [`http://localhost:3464`](http://localhost:3464).

### Data
Until the topdesk api is used as primary data source, we'll read CSV from 
`data/studieplekken-latest`. When a new version of the data comes in from TU, 
do the following:

0. convert the incoming file from *xlsx* to *csv*
0. save to `data` directory as `studieplekken-v<version>.csv`
0. update the symlink to point to the latest version:
```sh
ln -sf studieplekken-v<version>.csv data/studieplekken-latest.csv
```

### Decision log

Key decisions that are made during the course of the project are documented in [docs/decision-log/](docs/decision-log/). Please read the log so you understand why decisions are made and document key decisions when you make them.
