import { config } from '../../support/config';
import { selectors } from '../../support/selectors';
import functions from '../../support/functions';

describe('Points System Login Page', () => {
  beforeEach(() => {
    // Use the custom command to login and visit the page
    cy.loginAuthentication(config.urls.loginUrl, config.authCredentials.username, config.authCredentials.password);
    cy.wait(config.waitTimes.longWait); // Wait for elements to load
  });

  it('invalid login', () => {
    functions.getSingleShadowElement(selectors.shadowElement.shadowlogin, selectors.login.emailInput)
      .type('invalidlogin@mail.com');

    functions.getSingleShadowElement(selectors.shadowElement.shadowlogin, selectors.login.passwordInput)
      .type('invalidpassword');

    functions.getSingleShadowElement(selectors.shadowElement.shadowlogin, selectors.login.lockIcon)
      .click();

    functions.getSingleShadowElement(selectors.shadowElement.shadowlogin, selectors.login.passwordInput)
      .should('have.attr', 'type', 'text');

    functions.getSingleShadowElement(selectors.shadowElement.shadowlogin, selectors.login.primaryButton)
      .click();

    cy.url().should('not.include', '/posts');

    functions.getSingleShadowElement(selectors.shadowElement.shadowlogin, selectors.login.errorMsg)
      .should('be.visible');
  });


  it('forgot password', () => {
    // Start listening for the network request triggered by clicking the primary button
    cy.intercept('POST', '/your/api/endpoint').as('forgotPasswordRequest'); // Replace with your actual endpoint

    // Click on the forgot password link
    functions.getSingleShadowElement(selectors.shadowElement.shadowlogin, selectors.login.forgotPasswordLink)
      .click();

    // Interact with the input field for the email
    functions.getSingleShadowElement(selectors.shadowElement.shadowContainerForgotPassword, selectors.forgotPassword.inputField)
      .type('example@example.com');

    // Click on the primary button to initiate password reset
    functions.getSingleShadowElement(selectors.shadowElement.shadowContainerForgotPassword, selectors.userForgotPassword.primaryButton)
      .click();

    // Verify that the error message is visible if the email was invalid
    functions.getSingleShadowElement(selectors.shadowElement.shadowContainerForgotPassword, selectors.forgotPassword.errorText)
      .should('be.visible');

    // Now clear the input and enter a valid email
    functions.getSingleShadowElement(selectors.shadowElement.shadowContainerForgotPassword, selectors.forgotPassword.inputField)
      .clear()
      .type('davit.vardapetyan@naghashyan.com');

    // Click on the primary button again
    functions.getSingleShadowElement(selectors.shadowElement.shadowContainerForgotPassword, selectors.userForgotPassword.primaryButton)
      .click();

    // Wait for the "innerForgotPassword" container to be visible, with a timeout of 9 seconds
    functions.getSingleShadowElement(selectors.shadowElement.shadowContainerForgotPassword, selectors.forgotPassword.innerForgotPassword)
      .should('be.visible', { timeout: 9000 });

    // Handle the 2FA digit input (if required)
    functions.getSingleShadowElement(selectors.shadowElement.shadowContainerForgotPassword, selectors.forgotPassword.digitInput)
      .each(($input) => {
        cy.wrap($input).type('5');
      });

    // Click the primary button again to complete the process
    functions.getSingleShadowElement(selectors.shadowElement.shadowContainerForgotPassword, selectors.userForgotPassword.primaryButton)
      .click();

    functions.getSingleShadowElement(selectors.shadowElement.shadowContainerForgotPassword, selectors.forgotPassword.errorText)
      .should('be.visible');
  });


  it('valid log in and log out', () => {
    functions.getSingleShadowElement(selectors.shadowElement.shadowlogin, selectors.login.emailInput)
      .type(config.loginCredentials.username);

    functions.getSingleShadowElement(selectors.shadowElement.shadowlogin, selectors.login.passwordInput)
      .type(config.loginCredentials.password);

    functions.getSingleShadowElement(selectors.shadowElement.shadowlogin, selectors.login.primaryButton)
      .click();

    cy.url().should('include', '/posts');

    functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, selectors.myAccount.profileImage)
      .eq(5)
      .trigger('mouseover');

    functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.container-2')
      .eq(2)
      .click();

    cy.url().should('include', '/login');
  });

});

// Prevent Cypress from failing the test on uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
