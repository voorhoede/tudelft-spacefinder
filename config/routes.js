/* eslint-disable */
import flattenDeep from 'lodash/flattenDeep'
import pagesI18n from '../src/pages.i18n'
import locales from './locales'
const buildings = require('../src/static/data/buildings.json')
const spaces = require('../src/static/data/spaces.json')

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

const spaceRoutes = flattenDeep(spaces.map(space => {
  return locales.map(locale => {
    const building = buildings.find((building) => building.number === space.buildingNumber)
    const route = pagesI18n['buildings/_buildingSlug/spaces/_spaceSlug'][locale]
      .replace(':buildingSlug', building.i18n[locale].slug)
      .replace(':spaceSlug', space.i18n[locale].slug)
    return `/${locale}${route}`
  })
}))

const routes = [
  ...rootRoutes,
  ...buildingRoutes,
  ...spaceRoutes
]

export default routes
