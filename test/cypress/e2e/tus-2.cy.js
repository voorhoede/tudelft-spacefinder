/* eslint-disable no-undef */
beforeEach(() => {
  cy.viewport('iphone-6')
  cy.visit('/')
})

describe('TUS-2-1 Check header-bar in all available routes/pages', () => {
  it('Has header in route <baseUrl>', () => {
    cy.get('header.app-header')
  })
})

describe('TUS-2-2 Check header-bar styling and content', () => {
  it('Has background-color #00a6d6', () => {
    cy.get('header.app-header')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(0, 166, 214)')
  })
  it('Has text color #ffffff', () => {
    cy.get('header.app-header h1')
      .should('have.css', 'color')
      .and('eq', 'rgb(255, 255, 255)')
  })
})
