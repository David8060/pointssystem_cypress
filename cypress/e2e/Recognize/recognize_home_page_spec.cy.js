import { config } from '../../support/config';
import { selectors } from '../../support/selectors';
import functions from '../../support/functions';


describe('Recognize home page tests', () => {
    beforeEach(() => {
        // Use the custom command to login and visit the page
        cy.loginAuthentication(config.urls.loginUrl, config.authCredentials.username, config.authCredentials.password);
        cy.wait(config.waitTimes.longWait); // Wait for elements to load

        cy.loginToPage(config.loginCredentials.username, config.loginCredentials.password);
        cy.wait(config.waitTimes.longWait);

        cy.viewport(1920, 980);


        cy.get(selectors.shadowElement.shadowHeader)
            .shadow()
            .find('.header-btn.recognize.medium1')
            .eq(0)
            .click();

        cy.wait(config.waitTimes.mediumWait);

    });

    it('reset check', () => {

        // Search for the employee
        typeInEmployeeSearch('user test');

        cy.wait(config.waitTimes.pageLoad);

        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.border-outer')
            .first()
            .click();

        // Check for visibility of the top-icon
        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.top-icon')
            .should('be.visible');

        // Click the reset button
        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.btn.reset.cursor-pointer')
            .click();

        // Check that the top-icon no longer exists
        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.top-icon')
            .should('not.exist');

        // Check that the selected-employees no longer exist
        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.selected-employees.recognize.cursor-pointer')
            .should('not.exist');
    });


    it('home part interactions', () => {
        // Initial check to ensure the element starts at 0 degrees
        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '#f_employees-list')
            .should('have.attr', 'style', 'transform: rotate(0deg);');

        // Rotate down by 36 degrees
        functions.rotateEmployeeList(36, 'down');

        // Rotate back up to 0 degrees (this should check for -36 degrees)
        functions.rotateEmployeeList(0, 'up'); // Expect the element to rotate back to -36 degrees

        // Search for the employee
        typeInEmployeeSearch('user test');

        cy.wait(config.waitTimes.pageLoad);

        // Check that the employee with the name "user test" is visible
        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.employee-data.bold.small')
            .filter(':contains("user")')
            .should('be.visible');
    });




    it('send award flow', () => {

        // Search for the employee
        typeInEmployeeSearch('user test');

        cy.wait(config.waitTimes.pageLoad);

        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.border-outer')
            .first()
            .click();

        // First, check that the initial element is visible

        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.top-icon')
            .should('be.visible') // Ensure it is visible
            .click(); // Click the element

        // Wait for any UI changes if necessary (optional)
        cy.wait(config.waitTimes.pageLoad);

        // Verify that the new element with the changed class is now visible

        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.selected-employees.members-inside.organisation')
            .should('be.visible'); // Assert that the new class is visible


        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.border-outer')
            .click();

        // Now check that the original element is not visible
        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.selected-employees.recognize.cursor-pointer')
            .should('be.visible') // Assert that it is not visible
            .click();

        functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowSendReward, '.send-reward')
            .should('be.visible');


        // Get all the `.wrapper` elements within `ngs-loads-stepper-sendreward`
        functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowSendReward, '.wrapper')
            .each(($wrapper, index) => {
                // Assert that the current wrapper is visible before clicking
                cy.wrap($wrapper)
                    .should('be.visible')
                    .click(); // Click the current wrapper

                // Assert that the clicked wrapper now has the class 'active'
                cy.wrap($wrapper)
                    .should('have.class', 'active');

                // Verify that the other wrappers do not have the 'active' class
                functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowSendReward, '.wrapper')
                    .each(($otherWrapper, otherIndex) => {
                        if (otherIndex !== index) {
                            // Ensure that the other wrappers do not have the 'active' class
                            cy.wrap($otherWrapper).should('not.have.class', 'active');
                        }
                    });

                // Optional: Click again to revert and prepare for the next iteration (if needed)
                // This may depend on your application's specific behavior.
                cy.wrap($wrapper).click(); // Click again to reset if needed
            });

        functions.getSingleShadowElement(selectors.shadowElement.shadowStepper, '.btn.active')
            .click();

        functions.getSingleShadowElement(selectors.shadowElement.shadowStepper, '.modal-container')
            .should('be.visible');

        functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowSelectPoints, '.content')
            .each(($wrapper, index) => {
                // Assert that the current wrapper is visible before clicking
                cy.wrap($wrapper)
                    .should('be.visible')
                    .click(); // Click the current wrapper

                // Assert that the clicked wrapper now has the class 'active'
                cy.wrap($wrapper)
                    .should('have.class', 'active');

                // Verify that the other wrappers do not have the 'active' class
                functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowSelectPoints, '.content')
                    .each(($otherWrapper, otherIndex) => {
                        if (otherIndex !== index) {
                            // Ensure that the other wrappers do not have the 'active' class
                            cy.wrap($otherWrapper).should('not.have.class', 'active');
                        }
                    });

                // Extract the points to compare
                functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowSelectPoints, '.small')
                    .invoke('text')
                    .then((pointsText) => {
                        const points = Number(pointsText.match(/\d+/)[0]); // Extract number from the string
                        cy.log(`Points extracted: ${points}`); // Log the extracted points

                        // Now get the count using a more reliable approach
                        functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowSelectPoints, '.count.large1.medium')
                            .eq(index)
                            .should('be.visible') // Ensure it's visible before accessing
                            .then(($el) => {
                                const countText = $el[0].textContent; // Extract the text content directly
                                cy.log(`Raw count text: "${countText}"`); // Log the raw count text

                                // Clean the text to extract the number
                                const cleanCountText = countText.trim().replace(/\D/g, '');
                                cy.log(`Clean count text: "${cleanCountText}"`); // Log cleaned count text

                                const count = parseInt(cleanCountText, 10); // Convert to number
                                cy.log(`Count extracted: ${count}`); // Log the extracted count

                                // Check the condition and assert the error message
                                if (points < count) {
                                    // Check if the error message is displayed
                                    functions.getSingleShadowElement(selectors.shadowElement.shadowMainStepper, '.error-msg')
                                        .should('be.visible');
                                } else {
                                    cy.log('Error message element not found, no error expected'); // Log if not present
                                }
                            });
                    });

                // Optional: Click again to revert and prepare for the next iteration (if needed)
                cy.wrap($wrapper).click(); // Click again to reset if needed
            });

        functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowSelectPoints, '.content')
            .eq(0)
            .click();

        cy.document().then((doc) => {
            const errorElement = doc.querySelector(selectors.shadowElement.shadowMainStepper + ' .error-msg');

            if (errorElement) {
                // Check if the error message is visible
                cy.log("Error message exists, checking visibility.");
                cy.wrap(errorElement).should('be.visible').then(($errorMsg) => {
                    if ($errorMsg.is(':visible')) {
                        // If the error message is visible, close the modal
                        cy.log("Error message is visible, closing the modal.");

                        functions.getSingleShadowElement(selectors.shadowElement.shadowStepper, '.header-close')
                            .click();

                        cy.get(selectors.shadowElement.shadowStepper)
                            .should('not.exist');
                    }
                });
            } else {
                // If the error message does not exist, proceed with the steps
                cy.log("Error message does not exist, proceeding with the steps.");

                functions.getSingleShadowElement(selectors.shadowElement.shadowStepper, '.btn.active')
                    .click();

                functions.getSingleShadowElement(selectors.shadowElement.shadowStepper, '.btn')
                    .eq(1)
                    .should('be.disabled');

                let noteText = 'happy new year';

                functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowcreatepost, '#tiny-editor_ifr')
                    .should('be.visible')
                    .then(($iframe) => {
                        const body = $iframe[0].contentDocument.body;
                        cy.wrap(body).focus().type(noteText);
                    });

                functions.getSingleShadowElement(selectors.shadowElement.shadowStepper, '.btn')
                    .eq(1)
                    .should('be.enabled');

                functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowcreatepost, 'button.tox-tbtn[aria-label="Insert Background"]')
                    .should('exist')
                    .click();

                functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowcreatepost, 'div.select-bg')
                    .eq(12)
                    .should('be.visible')
                    .click();

                const backgroundColor = 'rgb(255, 160, 122)';

                functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowcreatepost, '#tiny-editor_ifr')
                    .then(($iframe) => {
                        const body = $iframe[0].contentDocument.body;
                        cy.wrap(body).should('have.css', 'background-color', backgroundColor);
                    });

                functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowcreatepost, '.select-bg.close-bg')
                    .eq(0)
                    .should('be.visible')
                    .click();

                functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowcreatepost, '#f_color-picker')
                    .should('not.be.visible');

                functions.getDoubleShadowElement(selectors.shadowElement.shadowStepper, selectors.shadowElement.shadowcreatepost, '#datepicker')
                    .should('be.visible')
                    .click();

                cy.get('.flatpickr-day.today')
                    .should('be.visible')
                    .click();

                functions.getSingleShadowElement(selectors.shadowElement.shadowMainStepper, '.btn')
                    .contains('Preview')
                    .click();

                functions.getTripleShadowElement(selectors.shadowElement.shadowMainStepper, selectors.shadowElement.shadowShowPost, selectors.shadowElement.shadowItemPost, '#f_text')
                    .should('have.text', noteText);

                functions.getTripleShadowElement(selectors.shadowElement.shadowMainStepper, selectors.shadowElement.shadowShowPost, selectors.shadowElement.shadowItemPost, '#f_text-container')
                    .should('have.css', 'background-color', backgroundColor);

                functions.getSingleShadowElement(selectors.shadowElement.shadowMainStepper, '.btn')
                    .contains('Send Award Now')
                    .click();

                cy.wait(config.waitTimes.pageLoad);

                functions.getSingleShadowElement(selectors.shadowElement.shadowPopup, '.popup-container')
                    .should('be.visible');

                functions.getSingleShadowElement(selectors.shadowElement.shadowPopup, '#f_primary-btn')
                    .contains('Close')
                    .click();

                cy.get(selectors.shadowElement.shadowPopup)
                    .should('not.exist');

            }

        });


    });



});

// Function to type in the employee search input
const typeInEmployeeSearch = (inputText) => {
    functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployeeManagement, '#f_employee_search')
        .type(inputText);
};



