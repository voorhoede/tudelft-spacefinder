/* eslint-disable no-undef */

const menuItems = [ { name: 'home', url: '/en' }, { name: 'Buildings', url: '/en/buildings/' }, { name: 'Tips', url: '/en/tips/' }, { name: 'campus map', url: '/en' } ]

describe('TUS-4 navigates within the spacefinder', () => {
  beforeEach(() => {
    cy.viewport('iphone-6')
      .visit('/')
  })
  specify('TUS-4-1 Check if menu toggle is in header and toggles panel in and out of view', () => {
    cy.get('.modal-drawer')
      .should('not.exist')
      .get('header.app-header')
      .contains('menu')
      .click()
      .get('.modal-drawer')
      .should('be.visible')
      .contains('close')
      .click()
  })
  specify('TUS-4-2 Check menu contens', () => {
    cy.get('header.app-header')
      .contains('menu')
      .click()
    menuItems.forEach((el) => {
      cy.get('nav.app-menu')
        .contains(el.name)
        .and('be.visible')
        .and('have.attr', 'href')
        .and('contain', el.url)
    })
    cy.get('.modal-drawer')
      .should('be.visible')
      .contains('close')
      .click()
  })
  specify('TUS-4-3 Check routes', () => {
    menuItems.forEach((el) => {
      cy.get('header.app-header')
        .contains('menu')
        .click()
        .get('nav.app-menu')
        .contains(el.name)
        .click()
        .url().should('include', el.url)
    })
  })
  specify('TUS-4-4 Check routes language switch', () => {
    cy.get('header.app-header')
      .contains('menu')
      .click()
      .get('nav.app-menu')
      .contains('nederlands')
      // check switching lang to nl (url+cookie)
      .click()
      .url().should('include', '/nl')
      .getCookie('nf_lang')
      .should('have.property', 'value', 'nl')
  })
})
