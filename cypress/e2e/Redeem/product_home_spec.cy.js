import { config } from '../../support/config';
import { selectors } from '../../support/selectors';
import functions from '../../support/functions';

describe('interactions with product and shopping bag', () => {
    beforeEach(() => {
        // Use the custom command to login and visit the page
        cy.loginAuthentication(config.urls.loginUrl, config.authCredentials.username, config.authCredentials.password);
        cy.wait(config.waitTimes.pageLoad); // Wait for elements to load

        cy.loginToPage(config.loginCredentials.username, config.loginCredentials.password);
        cy.wait(config.waitTimes.mediumWait);

        cy.viewport(1920, 980);

        functions.getSingleShadowElement(selectors.shadowElement.shadowListPosts, '.btn.redeem.medium')
            .eq(0)
            .click();

        cy.wait(config.waitTimes.mediumWait);

            cy.get('.product-image-link')
                .first()
                .click();


    });

    it('check item home part navigations', () => {

        // Validate that URL doesn't include '/Products'
        cy.url().should('not.include', '/Products');
    
        // Navigate to home link
        cy.get('.breadcrumb-link.home-link')
            .first()
            .click();
    
        // Click through product links and validate each breadcrumb step
        for (let i = 0; i <= 2; i++) {
            cy.get('.product-image-link')
                .first()
                .click();
            checkBreadcrumbAndUrl(i);
        }
    });


    it('should increase and decrease quantity when buttons are clicked', () => {


        functions.adjustQuantityOfProduct(
            'input[name="lineItems[fd0b3d1a071d5d83fd9f5d43d1cfd0ff][quantity]"]',  // Input field selector
            '.btn.btn-outline-light.btn-plus.js-btn-plus',  // Plus button selector
            '.btn.btn-outline-light.btn-minus.js-btn-minus',  // Minus button selector
            0
        );

        // // Verify the value is 1
        // cy.get('input[name="lineItems[fd0b3d1a071d5d83fd9f5d43d1cfd0ff][quantity]"]')
        //     .should('have.value', '1');

        // // Try to decrease the quantity below the minimum (1)
        // cy.get('.btn.btn-outline-light.btn-minus.js-btn-minus')
        //     .eq(0)
        //     .click();

        // // Assert that the value is still 1, ensuring it does not go below 1
        // cy.get('.btn.btn-outline-light.btn-plus.js-btn-plus')
        //     .should('have.value', '1'); // The value should not go below 1

    });

    // it('shopping bag interactions', () => {

    //     cy.get('.btn-buy')
    //         .contains('Add to bag')
    //         .click();

    //     cy.get('.offcanvas.offcanvas-end.cart-offcanvas')
    //         .should('be.visible');



    //     functions.adjustQuantityOfProduct(
    //         'input[name="quantity"]',  // Input field selector
    //         '.btn.btn-outline-light.btn-plus.js-btn-plus',  // Plus button selector
    //         '.btn.btn-outline-light.btn-minus.js-btn-minus',  // Minus button selector
    //         1
    //     );

    //     cy.get(config.waitTimes.longWait);


    //     cy.get('.alert-content')
    //         .contains('Your shopping cart is empty');


    //     cy.get('.btn.begin-checkout-btn.btn-light')
    //         .should('have.class', 'disabled');


    // });




    it('closing shopping bag', () => {

        cy.get('.btn-buy')
            .contains('Add to bag')
            .click();

        cy.get('.offcanvas.offcanvas-end.cart-offcanvas')
            .should('be.visible');


        cy.get('.btn.btn-light.offcanvas-close.js-offcanvas-close')
            .eq(1)
            .click();


        cy.get('.offcanvas.offcanvas-end.cart-offcanvas')
            .should('not.exist');

    });

    it('deleteing chosen product', () => {

        cy.get('.btn-buy')
            .contains('Add to bag')
            .click();

        cy.get('.offcanvas.offcanvas-end.cart-offcanvas')
            .should('be.visible');


        cy.get('button[title="Remove"]')
            .click();


        cy.get('.alert-content')
            .contains('Your shopping cart is empty');


        cy.get('.btn.begin-checkout-btn.btn-light')
            .should('have.class', 'disabled');

    });

    it('clicking shopping bag button', () => {

        cy.get('.btn.header-cart-btn.header-actions-btn')
            .click();

        cy.get('.offcanvas.offcanvas-end.cart-offcanvas')
            .should('be.visible');

    });


    it('privacy policy and terms and conditions checks', () => {

        cy.get('.footer-service-menu-item')
            .contains('Privacy Policy')
            .scrollIntoView()
            .click()

        cy.url().should('include', 'Privacy-Policy');

        cy.get('.footer-service-menu-item')
            .contains('Terms and Conditions')
            .click()

        cy.url().should('include', 'Terms-and-Conditions');


    });





});


// Helper function to handle breadcrumb click and URL validation
function checkBreadcrumbAndUrl(index) {
    cy.get('.breadcrumb-title')
        .eq(index)  // Get the breadcrumb element based on index
        .invoke('text')
        .then((text) => {
            const formattedText = text.trim()                     // Trim any leading/trailing spaces
                .replace(/\s+/g, '-')                             // Replace spaces with hyphens
                .replace(/_/g, '-')                               // Replace underscores with hyphens
                .replace(/\//g, '-');                             // Replace slashes with hyphens

            cy.log(formattedText);  // Log the formatted text for debugging

            // Click on the breadcrumb title
            cy.get('.breadcrumb-title')
                .eq(index)  // Get the same breadcrumb element again (to click)
                .click();

            // Assert that the URL includes the formatted text
            cy.url().should('include', formattedText);
        });
}