# Upgrade to Nuxt 3

We decided to upgrade to the latest version of Nuxt to resolve outdated dependencies and leverage the benefits of Nuxt 3 (smaller bundlesize, hybrid rendering, API routes, Vue 3, ES Modules, TypeScript).

- Date: 2023-02-22
- Alternatives Considered: Latest Nuxt 2, Astro with Vue, Vue SPA.
- Decision Made By: [Jasper](https://github.com/jbmoelker), [Misha](https://github.com/kyrel), [Selwyn](https://github.com/Siilwyn).

## Decision

When restarting development on the Spacefinder we found dependencies were 3+ years out of date, with many deprecation and security warnings on npm install. The project was still using Node.js v10 which was no longer supported by Netlify (the hosting platform used) causing deployments to fail. We therefore needed to update project dependencies and decided to upgrade to the new major version of Nuxt: Nuxt 3. 

- Nuxt 3 was preferred over Nuxt 2 as Nuxt 3 provides smaller bundlesize, better performance, hybrid rendering, API routes, Vue 3, ES Modules and TypeScript support. Some Nuxt 2 plugins (like i18n) were not available for Nuxt 3 (yet), but were considered solveable in another way.
- Astro with Vue was considered unsuitable as Astro is designed for mostly static sites, whereas the Spacefinder is a dynamic web application (with dynamic filtering of lists and a map). Thus not profiting from an island architecture with partial hydration.
- Vue (3) SPA was considered unsuitable as the Spacefinder is a public web app where the customer cares about each building and space being indexable on its own page. And a Vue SPA would be a bigger overhaul of the filesystem router and page setup already in place.
