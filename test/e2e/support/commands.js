/* eslint-disable no-undef */

// We do not want to click the popup every test
const setNoOnboarding = { 'hasSeenOnboarding': true, 'showOnboarding': false }

Cypress.Commands.add('noOnboarding', () => {
  window.localStorage.setItem('app-state', JSON.stringify(setNoOnboarding))
})

Cypress.Commands.add('filterState', (options = {}) => {
  const adjustableChairs = options.adjustableChairs || false
  const buildings = options.buildings || []
  const daylit = options.daylit || false
  const ethernet = options.ethernet || false
  const studyType = options.studyType || []
  const nearBathroom = options.nearBathroom || false
  const nearCoffeeMachine = options.nearCoffeeMachine || false
  const nearPrinter = options.nearPrinter || false
  const powerOutlets = options.powerOutlets || false
  const presentationScreen = options.presentationScreen || false
  const quietness = options.quietness || []
  const showNearbyLocations = options.showNearbyLocations || false
  const showOpenLocations = options.showOpenLocations || false
  const smartBoard = options.smartBoard || false
  const stationaryPC = options.stationaryPC || false
  const whiteBoard = options.whiteBoard || false

  const appState = {
    'filters': {
      'adjustableChairs': adjustableChairs,
      'buildings': buildings,
      'daylit': daylit,
      'ethernet': ethernet,
      'studyType': studyType,
      'nearBathroom': nearBathroom,
      'nearCoffeeMachine': nearCoffeeMachine,
      'nearPrinter': nearPrinter,
      'powerOutlets': powerOutlets,
      'presentationScreen': presentationScreen,
      'quietness': quietness,
      'showNearbyLocations': showNearbyLocations,
      'showOpenLocations': showOpenLocations,
      'smartBoard': smartBoard,
      'stationaryPC': stationaryPC,
      'whiteBoard': whiteBoard },
    'showOnboarding': false,
    'hasSeenOnboarding': true,
  }

  cy.wrap().should(() => {
    expect(localStorage.getItem('app-state')).to.eq(JSON.stringify(appState))
  })
})
