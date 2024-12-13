import { config } from '../../support/config';
import { selectors } from '../../support/selectors';
import functions from '../../support/functions';


describe('Recognize home page tests', () => {
    beforeEach(() => {
        // Use the custom command to login and visit the page
        cy.loginAuthentication(config.urls.loginUrl, config.authCredentials.username, config.authCredentials.password);
        cy.wait(config.waitTimes.pageLoad); // Wait for elements to load

        cy.loginToPage(config.loginCredentials.username, config.loginCredentials.password);
        cy.wait(config.waitTimes.pageLoad);

        cy.viewport(1920, 980);

        cy.get(selectors.shadowElement.shadowHeader)
            .shadow()
            .find('.header-btn.recognize.medium1')
            .eq(0)
            .click();

        cy.wait(config.waitTimes.pageLoad);

    });

    it('My community interactions', () => {

        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowSwitcher, '.tab')
            .eq(1)
            .should('be.visible')
            .click();

        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowSwitcher, '.tab.active')
            .should('be.visible');

        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.community-circle.cursor-pointer')
            .contains('Add members');

        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.community-circle.cursor-pointer')
            .click();


        functions.typeInEmployeeSearch('user test');

        cy.wait(config.waitTimes.pageLoad);

        // Check if the employee data is visible after the search
        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.employee-data.bold.small')
            .should('be.visible')
            .within(() => {
                // Confirm that the text 'user' and 'test' are visible
                cy.contains('div', 'user').should('be.visible');
                cy.contains('div', 'test').should('be.visible');
            });


        // Rotate down by 36 degrees
        functions.rotateEmployeeList(36, 'down');

        // Rotate back up to 0 degrees
        functions.rotateEmployeeList(0, 'up');;


        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.border-outer')
            .eq(0)
            .click();

        // After clicking, check that the total count text changes to '1'
        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.total-count')
            .should('be.visible') // Ensure the total count element is visible
            .invoke('text') // Get the text of the total count element
            .should('eq', '1'); // Assert that the text is '1'


        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.edit-btn.btn.save.medium1.cursor-pointer')
            .click();

        cy.wait(config.waitTimes.pageLoad);

        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.members-edit-buttons')
            .should('be.visible')
            .click();

        cy.wait(config.waitTimes.pageLoad);


        functions.typeInEmployeeSearch('user test');


        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.f_clickable.employee-content.cursor-pointer.selected-community')
            .should('be.visible')
            .click();

        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.edit-btn.btn.save.medium1.cursor-pointer')
            .click();


    });

});
