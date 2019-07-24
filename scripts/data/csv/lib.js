const {
  applySpec,
  curry,
  filter,
  identity,
  ifElse,
  isNil,
  map,
  not,
  pipe,
  prop,
  tap
} = require('ramda')

const hasValidationErrors = pipe(prop('errors'), isNil, not)

const logErrors = tap(({ value, errors }) => {
  // console.log(value, errors)
  const { slug } = value
  const errorText = [`${slug} did not pass json schema validation:`]
    .concat(errors.map((error) => {
      const { dataPath, message, data, params } = error
      // generic display of offending data
      let errorState = `Got ${data}`

      if (params.missingProperty) {
        // error text for missing required property
        errorState = `Object was: \n${JSON.stringify(data, null, 2)}`
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

module.exports = {
  hasValidationErrors,
  keepValidValues,
  toString,
  validate
}
