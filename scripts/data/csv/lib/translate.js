const {
  chain,
  curryN,
  keys,
  map,
  mergeDeepRight,
  objOf,
  omit,
  pipe,
  reduce,
  uniq,
  values,
  zipObj
} = require('ramda')

/*
  Get unique languages from translation map
*/
const getLanguages = pipe(
  values,
  chain(keys),
  uniq
)

const getPropertiesToRemove = pipe(
  values,
  chain(values)
)

module.exports = curryN(2, (translations, data) => {
  const languages = getLanguages(translations)
  const propertiesToTranslate = keys(translations)
  const propertiesToRemove = getPropertiesToRemove(translations)
  const i18nObject = pipe(
    map((lang) => {
      return map((word) => {
        const key = translations[word][lang]
        const translation = data[key]
        return translation ? { [word]: data[key] } : {}
      }, propertiesToTranslate)
    }),
    map(reduce(mergeDeepRight, {})),
    zipObj(languages),
    objOf('i18n')
  )(languages)

  return mergeDeepRight(omit(propertiesToRemove, data), i18nObject)
})
