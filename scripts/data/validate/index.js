const {
  __,
  applySpec,
  converge,
  curry,
  filter,
  identity,
  ifElse,
  isNil,
  map,
  mergeDeepRight,
  not,
  objOf,
  pathOr,
  pipe,
  prop,
  tap
} = require('ramda')

const validators = require('./schema')
const hasValidationErrors = pipe(prop('errors'), isNil, not)
const getEntityIdentifier = pathOr(__, ['i18n', 'nl', 'slug'])

const logErrors = tap(({ value, errors }) => {
  const { roomId, buildingId } = value
  const defaultName = roomId || buildingId || 'unknown'
  const name = getEntityIdentifier(defaultName, value)

  const errorText = [`${name} did not pass json schema validation:`]
    .concat(errors.map((error) => {
      const { dataPath, message, data, params } = error
      // generic display of offending data
      let errorState = `Got ${data}`

      if (params.missingProperty) {
        // error text for missing required property
        errorState = `Object was: \n${JSON.stringify(data, null, 2)}`
      } else if (params.additionalProperty) {
        // Too many properties
        errorState = `Offending property: ${params.additionalProperty}`
      }

      return `> ${dataPath || ''} ${message}. ${errorState}`
    }))

  console.warn(errorText.join('\n'))
})

// validate against json schema
const validate = curry((validator, data) => {
  const getErrors = () => validator.errors
  return pipe(
    applySpec({
      value: identity,
      // Run validator for side-effects. This stores the current value's
      // validation errors on the validator function as 'errors'
      errors: pipe(
        tap(validator),
        getErrors
      )
    }),
    // log validation errors to console
    ifElse(hasValidationErrors, logErrors, identity)
  )(data)
})

// filter out invalid values after validation
const keepValidValues = pipe(
  filter(pipe(hasValidationErrors, not)),
  map(prop('value'))
)

const validateProperty = curry((propertyName, validator, data) => {
  return pipe(
    prop(propertyName),
    map(validate(validator)),
    objOf(propertyName)
  )(data)
})

module.exports = pipe(
  converge(mergeDeepRight, [
    validateProperty('buildings', validators.building),
    validateProperty('spaces', validators.space)
  ]),
  map(keepValidValues)
)
