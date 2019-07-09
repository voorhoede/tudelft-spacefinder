/* eslint-disable */
import flattenDeep from 'lodash/flattenDeep'
import pagesI18n from '../src/pages.i18n'
const locales = ['en', 'nl']
const buildings = {
  en: require('../src/static/data/en/buildings.json'),
  nl: require('../src/static/data/nl/buildings.json')
}

export default flattenDeep([
  '/',
  locales.map(locale => {
    return flattenDeep([
      pagesI18n['buildings/index'][locale],
      buildings[locale].map(building => [
        pagesI18n['buildings/_buildingSlug/index'][locale]
          .replace(':buildingSlug', building.slug),
        pagesI18n['buildings/_buildingSlug/spaces/index'][locale]
          .replace(':buildingSlug', building.slug),
      ])
    ]).map(path => `/${locale}${path}`)
  })
])
