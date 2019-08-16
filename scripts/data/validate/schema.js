const Ajv = require('ajv')

// schema files
const buildingSchema = require('../../../schema/building.json')
const spaceSchema = require('../../../schema/space.json')
const openingHoursSchema = require('../../../schema/opening-hours.json')

const ajv = new Ajv({
  schemas: [ buildingSchema, spaceSchema, openingHoursSchema ],
  verbose: true
})

const space = ajv.compile(spaceSchema)
const building = ajv.compile(buildingSchema)
const openingHours = ajv.compile(openingHoursSchema)

module.exports = { space, building, openingHours }
