/* eslint-disable no-undef */

describe('TUS-1 see all available spaces in a list', () => {
  beforeEach(() => {
    cy.viewport('iphone-6')
      .visit('/')
  })
  specify('TUS-1-1 has a scrollable list on homescreen', () => {
    cy.get('.space-list')
      .scrollTo('bottom', { duration: 3000 })
      .get('.space-list__item')
      .should('have.length.greaterThan', 3)
  })
  specify('TUS-1-2 has list item with a title, seating, room number', () => {
    cy.get('.space-list__item')
      .first()
      .find('.space-card__location h3')
      .invoke('text')
      .should('have.length.greaterThan', 0)
      // find first list item
      .get('.space-list__item')
      .first()
      .find('.space-card__seating')
      .invoke('text')
      .should('have.length.greaterThan', 0)
  })
})
