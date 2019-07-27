/* eslint-disable */
import flattenDeep from 'lodash/flattenDeep'
import pagesI18n from '../src/pages.i18n'
import { log } from 'util';
const locales = ['en', 'nl']
const buildings = require('../src/static/data/buildings.json')

const rootRoutes = locales.map(locale => {
  const route = pagesI18n['buildings/index'][locale]
  return `/${locale}${route}`
})

const buildingRoutes = flattenDeep(buildings.map(building => {
  return locales.map(locale => {
    const route = pagesI18n['buildings/_buildingSlug/index'][locale]
      .replace(':buildingSlug', building.i18n[locale].slug)
    return `/${locale}${route}`
  })
}))

const routes = [
  ...rootRoutes,
  ...buildingRoutes,
]

console.log(routes)

export default routes
