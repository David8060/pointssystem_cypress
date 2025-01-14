// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


import 'cypress-shadow-dom';

import { selectors } from './selectors';

// cypress/support/commands.js

Cypress.Commands.add('loginAuthentication', (url, username, password) => {
    // Make a request to authenticate with the server
    cy.request({
      method: 'GET',
      url: 'https://pointssystem.armdev.am/login', // URL of the protected login endpoint
      auth: {
        username,
        password
      }
    }).then((response) => {
      // Check if the authentication was successful
      expect(response.status).to.eq(200);
  
      // Visit the actual page once authenticated
      cy.visit(url, {
        auth: {
          username,
          password
        },
        failOnStatusCode: false // Optional: Prevent Cypress from failing on non-2xx status codes
      });
    });
  });
  


  
Cypress.Commands.add('loginToPage', (username, password) => {
    cy.get(selectors.shadowElement.shadowlogin)
      .shadow()
      .find(selectors.login.emailInput)
      .type(username);

  
    cy.get(selectors.shadowElement.shadowlogin)
      .shadow()
      .find(selectors.login.passwordInput)
      .type(password);
  
    cy.get(selectors.shadowElement.shadowlogin)
      .shadow()
      .find(selectors.login.primaryButton)
      .click();
  
    // Assert that the URL contains '/posts'
    cy.url().should('include', '/posts');
  });


