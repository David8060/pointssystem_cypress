import { config } from '../../support/config';
import { selectors } from '../../support/selectors';
import functions from '../../support/functions';

describe('redeem filters tests', () => {
    beforeEach(() => {
        // Use the custom command to login and visit the page
        cy.loginAuthentication(config.urls.loginUrl, config.authCredentials.username, config.authCredentials.password);
        cy.wait(config.waitTimes.longWait); // Wait for elements to load

        cy.loginToPage(config.loginCredentials.username, config.loginCredentials.password);
        cy.wait(config.waitTimes.longWait);

        cy.viewport(1920, 980);

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.header-btn.redeem')
            .eq(0)
            .click();

        cy.wait(config.waitTimes.pageLoad);
    });

    it('check search filter pop-up item', () => {

        cy.get('.form-control.header-search-input')
            .should('be.visible')
            .type('ladies');

        cy.get('.col.search-suggest-product-name')
            .first()
            .click();

        cy.get('.breadcrumb-title')
            .contains('Ladies')

    });


    it('check search filter pop-up item', () => {

        cy.get('.form-control.header-search-input')
            .should('be.visible')
            .type('ladies{enter}');

        cy.url().should('include', 'ladies');

    });


    it('categories filter expand check', () => {

        cy.get('.category-navigation-link')
            .contains('Watches')
            .click();

        cy.get('.collapse')
            .should('have.class', 'show');

        cy.get('.collapse-btn')
            .eq(0)
            .click();

        cy.get('.collapse')
            .eq(0)
            .should('not.have.class', 'show');

    });

    it('categories filter check', () => {

        for (let i = 0; i < 5; i++) {
            cy.get('.category-navigation-link')
                .eq(i) // Get the element at the specific index
                .click() // Click on the category link
                .invoke('text')
                .then((text) => {
                    const formattedText = text.trim()
                        .replace(/\s+/g, '-') // Replace spaces with hyphens
                        .replace(/_/g, '-')    // Replace underscores with hyphens
                        .replace(/\//g, '-');  // Replace slashes with hyphens

                    cy.log(formattedText); // Log the formatted text
                    cy.url().should('include', `/${formattedText}`); // Check the URL includes the formatted category name
                });
        }

    });


    it('manufacturer filter check', () => {

        for (let i = 0; i < 2; i++) {

            cy.wait(config.waitTimes.pageLoad);

            cy.get('.form-check')
                .eq(i)
                .click()
                .wait(config.waitTimes.pageLoad)
                .invoke('text')
                .then((text) => {
                    const formattedText = text.trim()

                    cy.get('.manufacture-name')
                        .eq(0)
                        .invoke('text')
                        .then((manufactureName) => {
                            // Clean up the manufacturer name text to remove extra spaces and non-breaking spaces
                            const cleanedManufactureName = manufactureName
                                .replace(/\n/g, '')  // Remove newlines
                                .replace(/&nbsp;/g, '') // Remove &nbsp; (non-breaking spaces)
                                .trim(); // Trim leading/trailing spaces

                            cy.log(cleanedManufactureName); // Log the cleaned manufacturer name

                            // Compare the cleaned manufacturer name with the formatted text
                            expect(cleanedManufactureName).to.equal(formattedText);


                            cy.get('.form-check')
                                .eq(i)
                                .click();
                        });
                });

        }

    });


    it('points filter check', () => {
        // Type the minimum and maximum price values in the input fields
        cy.get('.form-control.min-input')
            .type('20');

        cy.get('.form-control.max-input')
            .type('100');

        // Click the apply filter button
        cy.get('.f_filter-panel-apply-price-filter.btn.btn-light')
            .click();

        // Wait for the page to load after applying the filter
        cy.wait(config.waitTimes.pageLoad);

        // Get all the product prices and validate they are within the range 20-100
        cy.get('.product-price', { timeout: 500 })
            .each(($price) => {

                // Get the price text and parse it as a number
                const priceText = $price.text().trim();
                const price = parseFloat(priceText.replace(/[^\d.-]/g, '')); // Remove non-numeric characters

                // Ensure the price is within the range
                expect(price).to.be.within(20, 100);

            });
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
