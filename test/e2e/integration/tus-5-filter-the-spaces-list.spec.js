/* eslint-disable no-undef */

describe('TUS-5 filter the spaces list', () => {
  specify('TUS-5-1 Check if the filter is accesible and empty', () => {
    cy.viewport('iphone-6')
      .visit('/')
      .get('.modal-drawer')
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
  specify('TUS-5-2 Check filter on open locations', () => {
    // we set the response to be the spaces.json fixture
    cy.server()
      .clock(1570620600000, ['Date']) // set time to openinghours, as documented via var does creates timing bug with animations in cypress. seems to be a react/vue issue: const open = new Date(Date.UTC(2019, 9, 9, 11, 30)).getTime()
      .route('GET', '/data/spaces.json', 'fixture:spacesFiltersTest.json').as('spacesFilterTest')
      .viewport('iphone-6')
      .visit('/')
      .wait('@spacesFilterTest') // remove the flash of production data
      .get('.modal-drawer')
      .should('not.exist')
      .get('header.app-header')
      .contains('filter')
      .click()
      .wait(300)
      // filter on open
      .get('label[for="show-open-locations"]')
      .click()
      // check if all spaces are in the list
      .get('.filter-menu button.button--primary')
      .should('contain', ' 1 ')
      // check if only one card in list
      .get('.modal-drawer')
      .should('be.visible')
      .contains('close')
      .click()
      .get('.space-list__item:visible')
      .should('have.length', 1)
      // reset and see all (2 in the fixture spaces data)
      .get('header.app-header')
      .contains('filter')
      .click()
      .wait(300)
      .get('label[for="show-open-locations"]')
      .click()
      .get('.modal-drawer')
      .contains('close')
      .click()
      .get('.space-list__item:visible')
      .should('have.length', 2)
  })
})
