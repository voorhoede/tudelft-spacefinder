/* eslint-disable no-undef */

describe('TUS-2 see that i am in the tudelft spacefinder', () => {
  beforeEach(() => {
    cy.viewport('iphone-6')
      .visit('/')
  })
  specify('TUS-2-1 has header-bar in all available routes/pages', () => {
    cy.get('header.app-header')
  })
  specify('TUS-2-2 has TUDelft branding', () => {
    cy.get('header.app-header')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(0, 166, 214)')
      // check title
      .get('header.app-header h1')
      .should('contain', 'Spacefinder')
      .and('have.css', 'color')
      .and('eq', 'rgb(255, 255, 255)')
  })
  specify('TUS-2-3 has visible logo', () => {
    cy.get('header.app-header .app-header__logo[href="/en/"]')
      .should('be.visible')
  })
})
