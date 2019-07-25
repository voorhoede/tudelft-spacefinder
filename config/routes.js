/* eslint-disable */
import flattenDeep from 'lodash/flattenDeep'
import pagesI18n from '../src/pages.i18n'
const locales = ['en', 'nl']
const buildings = require('../src/static/data/buildings.json')

export default flattenDeep([
  '/',
  // locales.map(locale => pagesI18n['buildings/index'][locale]),
    // buildings.map(building => [
    //   pagesI18n['buildings/_buildingSlug/index'][locale]
    //     .replace(':buildingSlug', building.i18n[locale].slug),
    // ]).map(path => `/${locale}${path}`)
])
