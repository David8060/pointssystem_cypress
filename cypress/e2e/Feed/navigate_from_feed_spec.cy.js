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

        // functions.getSingleShadowElement(selectors.shadowElement.shadowListPosts, '.btn.redeem')
        //     .should('be.visible')
        //     .click();

        // cy.url().should('not.include', postsUrl);

        cy.get('.header-link')
            .eq(0)
            .click();

        cy.wait(config.waitTimes.pageLoad);

        // functions.getSingleShadowElement(selectors.shadowElement.shadowListPosts, '.ad-info')
        //     .eq(0)
        //     .click();

        // cy.url().should('not.include', postsUrl);

        cy.get('.header-link-wrapper')
            .eq(0)
            .click();

        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowCommunity, '.add-text')
            .click();

        cy.url().should('include', employeesUrl);
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
            .contains('.points-desc', 'Points to reward')
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
        cy.get(selectors.shadowElement.shadowHeader)
            .shadow()
            .find('.profile-image')
            .eq(5)
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
        cy.get(selectors.shadowElement.shadowHeader)
            .shadow()
            .find('.profile-image')
            .eq(5)
            .trigger('mouseover');

        cy.get(selectors.shadowElement.shadowHeader)
            .shadow()
            .find('.points-total')
            .eq(1)
            .click();

        // Verify the result
        functions.verifyAwardsPage(awardsReceived);
    });
});
