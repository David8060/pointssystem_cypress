import { config } from '../../support/config';
import { selectors } from '../../support/selectors';
import functions from '../../support/functions';


describe('My account tests', () => {
    beforeEach(() => {
        // Use the custom command to login and visit the page
        cy.loginAuthentication(config.urls.loginUrl, config.authCredentials.username, config.authCredentials.password);
        cy.wait(config.waitTimes.longWait); // Wait for elements to load

        cy.loginToPage(config.loginCredentials.username, config.loginCredentials.password);
        cy.wait(config.waitTimes.longWait);

        cy.viewport(1920, 980);
    });

    it('navigate to my account and check My Activity', () => {

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.profile-info')
            .find(selectors.myAccount.profileImage)
            .trigger('mouseover');

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.account-detail')
            .eq(0)
            .click();

        cy.wait(config.waitTimes.pageLoad);

        functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowPersonalInfo, '.my-item')
            .eq(0)
            .click();

        cy.wait(config.waitTimes.pageLoad);

        cy.get(selectors.shadowElement.shadowUserAccount)
            .shadow()
            .find(selectors.shadowElement.shadowUserActivity)
            .shadow()
            .find('.table-body-part.extrasmall.cursor-pointer')
            .eq(0)
            .click();

        cy.wait(config.waitTimes.pageLoad);

        functions.getSingleShadowElement(selectors.shadowElement.shadowShowPost, '.inner.modal-container')
            .should('be.visible');


        // cy.get(selectors.shadowElement.shadowShowPost)
        //     .shadow()
        //     .contains('You’ve Earned Points!')
        //     .should('be.visible');

        // cy.get(selectors.shadowElement.shadowShowPost)
        //     .shadow()
        //     .contains('Thank you for being an invaluable part of our Company!')
        //     .should('be.visible');

        functions.getSingleShadowElement(selectors.shadowElement.shadowShowPost, '.close-btn')
            .click();



        functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserActivity, '.activity-tab')
            .eq(1)
            .click();


            cy.get(selectors.shadowElement.shadowUserAccount)
            .shadow()
            .find(selectors.shadowElement.shadowUserActivity)
            .shadow()
            .then(($shadowRoot) => {
              // Check if .empty-data exists in the shadow DOM
              const emptyDataExists = $shadowRoot.find('.empty-data').length > 0;
          
              if (emptyDataExists) {
                // If .empty-data exists, it means no data is available
                cy.log("No data available. Skipping verification.");
              } else {
                // If .empty-data does not exist, check for .table-body-part
                const tableBodyPartExists = $shadowRoot.find('.table-body-part').length > 0;
          
                if (tableBodyPartExists) {
                  // If .table-body-part exists and is visible, proceed with verification
                  cy.get(selectors.shadowElement.shadowUserAccount)
                    .shadow()
                    .find(selectors.shadowElement.shadowUserActivity)
                    .shadow()
                    .find('.table-body-part')
                    .then($tableBodyPart => {
                      if ($tableBodyPart.is(':visible')) {
                        // If .table-body-part is visible, proceed with verification
                        cy.log("Data is available and visible. Proceeding with verification.");
                        verifyTableBodyTextAgainstUserName(1);
                      } else {
                        // If .table-body-part exists but is not visible
                        cy.log("Data exists but is not visible. Skipping verification.");
                      }
                    });
                } else {
                  // If neither .empty-data nor .table-body-part exists, handle accordingly
                  cy.log("Unexpected situation: neither .empty-data nor .table-body-part is visible.");
                }
              }
            });
        


        functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserActivity, '.activity-tab')
            .eq(2)
            .click();

        cy.get(selectors.shadowElement.shadowUserAccount)
        .shadow()
        .find(selectors.shadowElement.shadowUserActivity)
        .shadow()
        .then(($shadowRoot) => {
          // Check if .empty-data exists in the shadow DOM
          const emptyDataExists = $shadowRoot.find('.empty-data').length > 0;
      
          if (emptyDataExists) {
            // If .empty-data exists, it means no data is available
            cy.log("No data available. Skipping verification.");
          } else {
            // If .empty-data does not exist, check for .table-body-part
            const tableBodyPartExists = $shadowRoot.find('.table-body-part').length > 0;
      
            if (tableBodyPartExists) {
              // If .table-body-part exists and is visible, proceed with verification
              cy.get(selectors.shadowElement.shadowUserAccount)
                .shadow()
                .find(selectors.shadowElement.shadowUserActivity)
                .shadow()
                .find('.table-body-part')
                .then($tableBodyPart => {
                  if ($tableBodyPart.is(':visible')) {
                    // If .table-body-part is visible, proceed with verification
                    cy.log("Data is available and visible. Proceeding with verification.");
                    verifyTableBodyTextAgainstUserName(0);
                  } else {
                    // If .table-body-part exists but is not visible
                    cy.log("Data exists but is not visible. Skipping verification.");
                  }
                });
            } else {
              // If neither .empty-data nor .table-body-part exists, handle accordingly
              cy.log("Unexpected situation: neither .empty-data nor .table-body-part is visible.");
            }
          }
        });


        functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserActivity, '#datepicker')
            .click();

        cy.get('select.flatpickr-monthDropdown-months')
            .eq(1)
            .select('October');

        cy.get('.numInput.cur-year')
            .eq(1)
            .type(2024);

        // Select the start date (October 8, 2024)
        cy.get('.flatpickr-day[aria-label="October 8, 2024"]')
            .should('be.visible') // Ensure element is visible
            .wait(500) // Add a small delay to ensure the aria-label has time to update
            .should('have.attr', 'aria-label', 'October 8, 2024') // Verify correct start date
            .click(); // Click to select the start date

        // Select the end date (October 23, 2024)
        cy.get('.flatpickr-day[aria-label="October 23, 2024"]')
            .should('have.attr', 'aria-label', 'October 23, 2024') // Verify correct end date
            .click();

        functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserActivity, '.activity-tab')
            .eq(0)
            .click();

            cy.get(selectors.shadowElement.shadowUserAccount)
            .shadow()
            .find(selectors.shadowElement.shadowUserActivity)
            .shadow()
            .then(($shadowRoot) => {
              // Check if .empty-data exists in the shadow DOM
              const emptyDataExists = $shadowRoot.find('.empty-data').length > 0;
          
              if (emptyDataExists) {
                // If .empty-data exists, it means no data is available
                cy.log("No data available. Skipping verification.");
              } else {

                functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserActivity, '.table-body-part.extrasmall.cursor-pointer')
                .each(($parentEl, index) => {
                    cy.wrap($parentEl)
                        .find('.table-body-inner')
                        .eq(2)
                        .then($el => {
                            // Get the text of the element (e.g., "10/22/24")
                            const dateText = $el.text().trim();
    
                            // Split the text into three parts: month/day/year
                            const dateParts = dateText.split('/');
    
                            const firstPart = parseInt(dateParts[0]); // month
                            const middlePart = parseInt(dateParts[1]); // day
                            const thirdPart = parseInt(dateParts[2]); // year
    
                            // Check conditions: firstPart == 10, middlePart in range, thirdPart == 24
                            if (firstPart === 10 && middlePart >= 8 && middlePart <= 23 && thirdPart === 24) {
                                cy.log(`Test passed for element ${index}: ${dateText}`);
                            } else {
                                // Log the failure and explicitly throw an error to fail the test
                                cy.log(`Test failed for element ${index}. Date: ${dateText} is not in expected format or range.`);
                                throw new Error(`Date ${dateText} is not valid for element ${index}. Expected format: 10/MM/24 where MM is between 8 and 23.`);
                            }
                        });
                });

              }
            });
    });


});

function verifyTableBodyTextAgainstUserName(eqIndex) {

    functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserActivity, '.table-body-part.extrasmall.cursor-pointer')
        .each(($el) => {
            // For each '.table-body-part.extrasmall.cursor-pointer', find the specified '.table-body-inner' element
            cy.wrap($el)
                .find('.table-body-inner')
                .eq(eqIndex) // Use the provided index
                .then(($innerEl) => {
                    // Get the text of '.table-body-inner' element at the specified index
                    const tableBodyText = $innerEl.text().trim();

                    functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserInfo, '.user-name.medium.large1')
                        .then(($userName) => {
                            const userNameText = $userName.text().trim();

                            // Assert that the texts are equal
                            expect(tableBodyText).to.equal(userNameText);
                        });
                });
        });
}
