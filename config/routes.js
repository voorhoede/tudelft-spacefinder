/* eslint-disable */
const flattenDeep = require('lodash/flattenDeep')
const locales = require('./locales.json')
const buildings = {
  en: require('../src/static/data/en/buildings.json'),
  nl: require('../src/static/data/nl/buildings.json')
}

module.exports = flattenDeep([
  '/',
  locales.map(locale => {
    return buildings[locale].map(building => [
      `/${locale}/buildings/${building.slug}`,
      `/${locale}/buildings/${building.slug}/spaces`,
    ])
  }),
])
