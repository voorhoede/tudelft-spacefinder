# tudelft-spacefinder
> App to easily find available spaces on the TU Delft Campus.

This app is a universal [Vue.js](https://vuejs.org/) app made with [Nuxt](https://nuxt.com/). The app has multi-language support (English and Dutch).

## Development

### Requirements
- [Node.js](http://nodejs.org/)
- [Docker](https://www.docker.com/) if running Supabase locally

### Getting started
* Clone the repository.
* Run `npm ci` to install the dependencies.
* Copy `.env.example` to `.env` and set the environment variables. Copy them from the [Netlify settings](https://app.netlify.com/sites/spacefinder/settings/general) or ask a dev team member. 
* Run app in development mode (`npm run dev`), see all scripts with `npm run`.

#### Local Supabase
In order to make changes to the database schema a local Supabase instance is needed.
* Login with `npx supabase login`.
* Run `npm run supabase:start` to start a local Supabase instance.
* Use the output API url and key to set the environment variables `SUPABASE_URL` & `SUPABASE_KEY`.

#### Migration
* After changing the database schema run `npm run supabase:db:diff` followed by a migration name, e.g. `npm run supabase:db:diff -- create_xyz`.
* Possibly alter the seeding data to match the schema changes.
* Reset the local database to ensure everything works with `npm run supabase:db:reset`.
* Committed migrations that are merged to the main branch are automatically deployed.

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
