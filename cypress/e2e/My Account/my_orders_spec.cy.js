import { config } from '../../support/config';
import { selectors } from '../../support/selectors';
import functions from '../../support/functions';



describe('My account tests', () => {
    beforeEach(() => {
        // Use the custom command to login and visit the page
        cy.loginAuthentication(config.urls.loginUrl, config.authCredentials.username, config.authCredentials.password);
        cy.wait(config.waitTimes.pageLoad); // Wait for elements to load

        cy.loginToPage(config.loginCredentials.username, config.loginCredentials.password);
        cy.wait(config.waitTimes.pageLoad);

        cy.viewport(1920, 980);
    });

    it('navigate to my account and check My Orders', () => {
        // Navigate to profile info
        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.profile-info')
            .find(selectors.myAccount.profileImage)
            .trigger('mouseover');

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, selectors.myAccount.container)
            .eq(0)
            .click();

        cy.wait(config.waitTimes.pageLoad);
        cy.url().should('include', '/user-account');

        // Click on personal info
        functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowPersonalInfo, selectors.myAccount.myOrders)
            .eq(1)
            .click();

        cy.wait(config.waitTimes.pageLoad);
        cy.url().should('include', '/user-orders');

        cy.get(selectors.shadowElement.shadowUserAccount)
            .shadow()
            .find(selectors.shadowElement.shadowUserOrders)
            .shadow()
            .then(($shadowRoot) => {
                // Check if .empty-data exists in the shadow DOM
                const emptyDataExists = $shadowRoot.find('.empty-data').length > 0;

                if (emptyDataExists) {
                    // If .empty-data exists, it means no data is available
                    cy.log("No data available. Skipping verification.");
                } else {
                    // If there are orders, perform the listed actions

                    // View more orders
                    functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserOrders, selectors.myAccount.viewMoreText)
                        .eq(0)
                        .click();

                    // Check product header is visible and contains 'Product'
                    functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserOrders, selectors.myAccount.orderHeaderName)
                        .contains('Product');

                    // View less orders
                    functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserOrders, selectors.myAccount.viewMoreText)
                        .eq(0)
                        .contains('View less')
                        .click();

                    // Assert order header is not visible
                    functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserOrders, selectors.myAccount.orderHeaderName)
                        .should('not.be.visible');
                }
            });



    });
});
