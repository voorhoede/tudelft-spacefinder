/* eslint-disable no-undef */

describe('TUS-5 filter the spaces list', () => {
  beforeEach(() => {
    cy.viewport('iphone-6')
      .visit('/')
  })
  specify('TUS-5-1 Check if the filter is accesible and empty', () => {
    cy.get('.modal-drawer')
      .should('not.exist')
      .get('header.app-header')
      .contains('filter')
      .click()
      .wait(300)
      // filter on silent
      .get('label[for="quietness-silent"]')
      .click()
      // filter on quit
      .get('label[for="quietness-quiet"]')
      .click()
      // filter on self study
      .get('label[for="study-type-self"]')
      .click()
      // filter on nearby printer
      .get('label[for="near-printer"]')
      .click()
      // filter on power outlet
      .get('label[for="power-outlets"]')
      .click()
      // filter on adjustable chairs
      .get('label[for="adjustable-chairs"]')
      .click()
      // filter on building
      .get('label[for="buildings-22"]')
      .click()
      // check if filter is still there on reload
      .reload()
      .filterState({ 'quietness': ['silent', 'quiet'], 'adjustableChairs': true, 'studyType': ['self'], 'nearPrinter': true, 'powerOutlets': true, 'buildings': [22] })
      // open drawer and check if it says there are only two spaces as result
      .get('header.app-header')
      .contains('filter')
      .click()
      .wait(300)
      .get('.filter-menu button.button--primary')
      .should('contain', ' 2 ')
      // check if drawer is open and close it
      .get('.modal-drawer')
      .should('be.visible')
      .contains('close')
      .click()
      // check if filter button has indicator
      .get('.app-header__status-indicator')
      .should('be.visible')
      // check if there are only two spaces left in view
      .get('.vue-recycle-scroller__item-wrapper .vue-recycle-scroller__item-view:visible')
      .its('length')
      .should('eq', 2)
      // open the drawer and check if filter clears
      .get('header.app-header')
      .contains('filter')
      .click()
      .wait(300)
      .get('.filter-menu')
      .contains(' clear filter')
      .click()
      .filterState()
      // check if all spaces are in the list
      .get('.filter-menu button.button--primary')
      .should('contain', ' 398 ')
  })
})
