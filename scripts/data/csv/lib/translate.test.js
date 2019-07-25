const translate = require('./translate')

const translationMap = {
  propertyName: {
    en: 'propertyNameEN',
    nl: 'propertyNameNL'
  }
}

const data = {
  propertyNameEN: 'english',
  propertyNameNL: 'nederlands',
  other: 'unrelated property value'
}

const translator = translate(translationMap)
let result

beforeEach(() => {
  result = translator(data)
})

test('adds translations under the i18n property', () => {
  expect(result.hasOwnProperty('i18n')).toBe(true)
})

test('adds subproperty under i18n for every language in the translation map', () => {
  // EN and NL
  const languages = Object.keys(translationMap.propertyName)
  const hasAllLanguages = languages.every(lang => result.i18n.hasOwnProperty(lang))
  expect(hasAllLanguages).toBe(true)
})

test('translates properties successfully', () => {
  expect(result.i18n.en.propertyName).toBe('english')
  expect(result.i18n.nl.propertyName).toBe('nederlands')
})

test('leaves properties that are not in the translation map unaffected', () => {
  expect(result.other).toBe('unrelated property value')
})

test('removes properties that contained the translation values from the result', () => {
  expect(result.hasOwnProperty('propertyNameNL')).toBe(false)
  expect(result.hasOwnProperty('propertyNameEN')).toBe(false)
})

test('gracefully handles an incomplete translation map', () => {
  const incompleteTranslationMap = {
    propertyName: {
      en: 'propertyNameEN',
      nl: 'propertyNameNL'
    },
    incompletelyTranslated: {
      nl: 'foobarNL'
    }
  }

  const data = {
    propertyNameEN: 'english',
    propertyNameNL: 'nederlands',
    foobarNL: 'foo bar'
  }

  const result = translate(incompleteTranslationMap)(data)
  // incompletelyTranslated only has a dutch translation available
  expect(result.i18n.en.hasOwnProperty('incompletelyTranslated')).toBe(false)
  expect(result.i18n.nl.hasOwnProperty('incompletelyTranslated')).toBe(true)
})

test('gracefully handles incomplete data', () => {
  let result
  // If translation columns are not found in data, translator does not crash.
  expect(() => {
    result = translator({
      incompleteData: 'nothing to see here..'
    })
  }).not.toThrow()

  // and no properties are translated
  expect(result.i18n.en.hasOwnProperty('propertyName')).toBe(false)
  expect(result.i18n.nl.hasOwnProperty('propertyName')).toBe(false)
})
