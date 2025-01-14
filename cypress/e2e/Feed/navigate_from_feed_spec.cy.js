import { config } from '../../support/config';
import { selectors } from '../../support/selectors';
import functions from '../../support/functions';

describe('Navigations from Points System User Feed', () => {
    const awardsGiven = 'given';
    const awardsReceived = 'received';

    const employeesUrl = '/employees';
    const postsUrl = '/posts';

    beforeEach(() => {
        // Use the custom command to login and visit the page
        cy.loginAuthentication(config.urls.loginUrl, config.authCredentials.username, config.authCredentials.password);
        cy.wait(config.waitTimes.pageLoad); // Wait for elements to load

        cy.loginToPage(config.loginCredentials.username, config.loginCredentials.password);
        cy.wait(config.waitTimes.pageLoad);

        cy.viewport(1920, 980);
    });

    it('page navigations from user feed', () => {
        functions.getSingleShadowElement(selectors.shadowElement.shadowListPosts, '.btn.recognize.medium')
            .click();

        cy.url().should('include', employeesUrl);

        cy.wait(config.waitTimes.pageLoad);

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.image-box.header-logo')
            .click();

        cy.url().should('include', postsUrl);

        functions.getSingleShadowElement(selectors.shadowElement.shadowListPosts, '.btn.redeem')
            .should('be.visible')
            .click();

        cy.url().should('not.include', postsUrl);

        cy.get('.header-link')
            .eq(0)
            .click();

        cy.wait(config.waitTimes.pageLoad);

        functions.getSingleShadowElement(selectors.shadowElement.shadowListPosts, '.ad-info')
            .eq(0)
            .click();

        cy.url().should('not.include', postsUrl);


    });


    it('navigate to my community', () => {

        cy.visit('https://pointssystem.armdev.am/employees');

        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowSwitcher, '.tab')
            .eq(1)
            .should('be.visible')
            .click();

        cy.wait(config.waitTimes.pageLoad);


        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.btn.cursor-pointer')
            .click();

        cy.wait(config.waitTimes.pageLoad);

        functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.employee-data.bold.small')
            .should('be.visible') // Ensure the elements are visible
            .then(($elements) => {

                // Click on the first three items
                $elements.slice(0, 3).each((index, element) => {
                    cy.wrap(element).click();
                });
            });

        cy.wait(config.waitTimes.pageLoad);

        functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.edit-btn.btn.save.medium1.cursor-pointer')
            .click();

        cy.wait(config.waitTimes.pageLoad);

        functions.getDoubleShadowElement(
            selectors.shadowElement.shadowEmployeesList,
            selectors.shadowElement.shadowEmployee,
            '.border-outer'
        )
            .should('exist') // Ensure the elements exist in the DOM
            .then(($elements) => {
                // Log the count of elements
                let employeeCount = $elements.length;
                cy.log(`Count of .border-outer elements: ${employeeCount}`);

                if (employeeCount > 5) {
                    employeeCount = 5;
                }

                functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.header-logo')
                    .click();

                functions.getDoubleShadowElement(
                    selectors.shadowElement.shadowListPosts,
                    selectors.shadowElement.shadowCommunity,
                    '.image-box.employee'
                )
                    .should('be.visible')
                    .then(($elements) => {

                        expect($elements.length).to.equal(employeeCount);
                    });

                functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowCommunity, '.see-all-btn')
                    .click();

                cy.wait(config.waitTimes.pageLoad);

                cy.url().should('include', employeesUrl);


                functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.btn.cursor-pointer')
                    .click();

                cy.wait(config.waitTimes.pageLoad);

                functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.employee-data.bold.small')
                    .should('be.visible') // Ensure the elements are visible
                    .then(($elements) => {

                        // Click on the first three items
                        $elements.slice(0, 3).each((index, element) => {
                            cy.wrap(element).click();
                        });
                    });

                cy.wait(config.waitTimes.pageLoad);

                functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.edit-btn.btn.save.medium1.cursor-pointer')
                    .click();

                cy.wait(config.waitTimes.pageLoad);

                functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.header-logo')
                    .click();

                cy.wait(config.waitTimes.pageLoad);

                functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowCommunity, '#f_employees')
                    .should('exist')
                    .find('.small.light')
                    .each(($child) => {
                        // Assert that each child contains the expected text
                        cy.wrap($child).should('contain.text', "You don't have members yet");
                    });

                functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowCommunity, '.see-all-btn')
                    .click();

                cy.wait(config.waitTimes.pageLoad);

                cy.url().should('include', employeesUrl);

            });
    });

    it('awards given navigation via Awards Given', () => {
        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowUserInfo, '.awards.cursor-pointer')
            .contains('Awards Given')
            .click();

        // Verify the result
        functions.verifyAwardsPage(awardsGiven);
    });

    it('awards received navigation via Awards Received', () => {
        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowUserInfo, '.awards.cursor-pointer')
            .contains('Awards Received')
            .click();

        // Verify the result
        functions.verifyAwardsPage(awardsReceived);
    });

    it('awards given navigation via Points to redeem', () => {
        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowUserInfo, '.points-wrapper')
            .contains('.points-desc', 'Points to redeem')
            .click();

        // Verify the result
        functions.verifyAwardsPage(awardsGiven);
    });

    it('awards received navigation via Points to reward', () => {
        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowUserInfo, '.points-wrapper.cursor-pointer')
            .contains('.points-desc', 'Points to award')
            .click();

        // Verify the result
        functions.verifyAwardsPage(awardsReceived);
    });

    it('awards given navigation via header', () => {
        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.points-wrapper')
            .eq(0)
            .click();

        // Verify the result
        functions.verifyAwardsPage(awardsGiven);
    });

    it('awards received navigation via header', () => {
        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.points-wrapper')
            .eq(1)
            .click();

        // Verify the result
        functions.verifyAwardsPage(awardsReceived);
    });

    it('awards given navigation via header points to redeem', () => {

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.profile-info')
            .find(selectors.myAccount.profileImage)
            .trigger('mouseover');

        cy.get(selectors.shadowElement.shadowHeader)
            .shadow()
            .find('.points-total.redeem')
            .eq(0)
            .click();

        // Verify the result
        functions.verifyAwardsPage(awardsGiven);
    });

    it('awards received navigation via header points to award', () => {

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.profile-info')
            .find(selectors.myAccount.profileImage)
            .trigger('mouseover');

        cy.get(selectors.shadowElement.shadowHeader)
            .shadow()
            .find('.points-total')
            .eq(1)
            .click();

        // Verify the result
        functions.verifyAwardsPage(awardsReceived);
    });

    // it('check community wall', () => {

    //     cy.visit('https://pointssystem.armdev.am/employees');

    //     functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowSwitcher, '.tab')
    //         .eq(1)
    //         .should('be.visible')
    //         .click();

    //     cy.wait(config.waitTimes.pageLoad);


    //     functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.cursor-pointer')
    //         .click();

    //     cy.wait(config.waitTimes.pageLoad);

    //     functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.employee-data.bold.small')
    //         .first()
    //         .should('be.visible') // Ensure the element is visible
    //         .invoke('text') // Get the text content of the element
    //         .then((employeeName) => {

    //             cy.log('Extracted Text:', employeeName); // Log the text for debugging

    //             functions.getDoubleShadowElement(selectors.shadowElement.shadowEmployeesList, selectors.shadowElement.shadowEmployee, '.employee-data.bold.small')
    //                 .first()
    //                 .click();

    //             cy.wait(config.waitTimes.pageLoad);

    //             functions.getSingleShadowElement(selectors.shadowElement.shadowEmployeesList, '.edit-btn.btn.save.medium1.cursor-pointer')
    //                 .click();

    //             cy.wait(config.waitTimes.pageLoad);

    //             functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.header-logo')
    //                 .click();

    //             cy.wait(config.waitTimes.pageLoad);

    //             functions.getSingleShadowElement(selectors.shadowElement.shadowListPosts, '.organization-item')
    //                 .click();

    //             functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '.emp-name')
    //                 .should('contain', employeeName);




    //         });
   // });

   
});
