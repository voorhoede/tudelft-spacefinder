const Ajv = require('ajv')

// schema files
const baseSchema = require('../../../schema/base.json')
const buildingSchema = require('../../../schema/building.json')
const spaceSchema = require('../../../schema/space.json')

const ajv = new Ajv({
  schemas: [ baseSchema, buildingSchema, spaceSchema ],
  verbose: true
})

// json schema validator function for spaces
const space = ajv.compile(spaceSchema)

// json schema validator function for buildings
const building = ajv.compile(buildingSchema)

module.exports = { space, building }
