/* eslint-disable no-undef */

describe('TUS-6 find a space on a map', () => {
  beforeEach(() => {
    cy.viewport('iphone-6')
      .visit('/')
  })
  specify('TUS-6-1 Check map', () => {
    cy.get('.modal-drawer')
      .should('not.exist')
      // open the drawer and nav to the map
      .get('header.app-header')
      .contains('menu')
      .click()
      .wait(300)
      .get('nav.app-menu')
      .contains('campus map')
      .click()
      // is there a map
      // nav to detail page via marker
      .server()
      // we set the response to be the spaces.json fixture
      .route('GET', '/data/spaces.json', 'fixture:spacesFiltersTest.json')
      .visit('/')
  })
})
