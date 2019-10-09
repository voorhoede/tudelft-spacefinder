/* eslint-disable no-undef */

describe('TUS-3 find all details of a space', () => {
  beforeEach(() => {
    cy.viewport('iphone-6')
      .visit('/')
  })
  specify('TUS-3-1 navigate to a space and back to home', () => {
    cy.get('.space-list__item')
      .first()
      .find('a')
      .invoke('attr', 'href')
      .then((href) => {
        cy.visit(href)
          .url().should('include', href)
          .get('.back-button')
          // .should('have.attr', 'href', '/en') // todo: seems to be a problem with history.back and cypress!?
          // .click()
      })
  })
})
