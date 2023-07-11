import lunr from "lunr";
import { BuildingI18n } from "./../../../src/types/Building";

export function createBuildingIndex(buildings: BuildingI18n[]) {
  const index = lunr((config) => {
    config.ref('buildingId')

    const buildingLocales = Object.keys(buildings[0].i18n)

    // specify which fields should be indexed
    buildingLocales.forEach((locale) => {
      config.field(`i18n_${locale}_name`)
      config.field(`i18n_${locale}_abbreviation`)
      config.field(`i18n_${locale}_slug`)
    })

    // create a mapping so you can easily retrieve the relevant fields (necessary because lunr cannot access nested fields)
    const buildingMappings = buildings.map((building) => {
      const i18nBuildingNames = buildingLocales.reduce((acc, locale) => ({
          ...acc,
          [`i18n_${locale}_name`]: building.i18n[locale].name,
          [`i18n_${locale}_abbreviation`]: building.i18n[locale].abbreviation,
          [`i18n_${locale}_slug`]: building.i18n[locale].slug,
      }), {})

      return {
        buildingId: building.buildingId,
        ...i18nBuildingNames,
      }
    })

    // index the specified fields of the buildings
    buildingMappings.forEach((buildingMap) => {
      config.add(buildingMap)
    })
  });

  return index;
}
