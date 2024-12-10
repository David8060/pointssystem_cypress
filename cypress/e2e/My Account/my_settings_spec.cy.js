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

        cy.viewport(1920, 1020);

        navigateToMyAccount();
    });

    it('navigate to my account and check My Settings', () => {
        let addressCount;

        functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserSettings, '.address-item')
            .then(items => {
                addressCount = items.length; // Set initial count
                cy.wrap(addressCount).as('initialCount'); // Save for sequential use
            });

        openAddressMenu();

        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.cancelButton)
            .scrollIntoView()
            .click();

        openAddressMenu();


        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.closeButton)
            .click();

        openAddressMenu();

        fillAddress(
            'Your First Name',
            'Your Last Name',
            'Leningradyan',
            '44/4',
            '2 street',
            'no zip code',
            'Yerevan',
            'Germany',
            '9999991',
        );


        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.primaryButton)
            .click();

        cy.wait(config.waitTimes.mediumWait);

        // Validate incremented count
        cy.get('@initialCount').then(initialCount => {

            functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserSettings, '.address-item')
                .should('have.length', initialCount + 1);
            addressCount = initialCount + 1; // Update count
        });

        deleteButton(1); // Edit button

        fillAddress(
            'Davit',
            'Vardapetyan',
            '',
            'Patriki',
            '',
            '',
            'Moscow',
        );

        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.primaryButton)
            .scrollIntoView()
            .click();

        cy.wait(config.waitTimes.pageLoad);

        deleteButton(4); // Delete button


        functions.getSingleShadowElement(selectors.shadowElement.shadowPopup, '.popup-container.popup-accepted')
            .should('be.visible');

        functions.getSingleShadowElement(selectors.shadowElement.shadowPopup, '.btn.primary-btn.btn-primary')
            .click();

        // Validate decremented count
        cy.get('@initialCount').then(() => {
            functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserSettings, '.address-item')
                .should('have.length', addressCount - 1);
            addressCount -= 1; // Update count
        });
    });


    it('Change password and revert it back', () => {
        editPassword();
        typeInPasswordFields('davit.vardapetyan', 'davit123');
        submitPasswordChange();

        functions.getSingleShadowElement(selectors.shadowElement.shadowPopup, selectors.myAccount.editPassword.confirmButton)
            .click();

        // Revert back to original password
        editPassword();
        typeInPasswordFields('davit123', 'davit.vardapetyan');
        submitPasswordChange();

        functions.getSingleShadowElement(selectors.shadowElement.shadowPopup, selectors.myAccount.editPassword.confirmButton)
            .click();
    });


    it('Change password with wrong current password', () => {
        editPassword();
        typeInPasswordFields('wrongpass', 'davit123');
        submitPasswordChange();


        functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, '.error-msg')
            .contains('Current password is wrong');
    });

    it('Change password with new passwords not matching', () => {

        editPassword();

        functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, selectors.myAccount.editPassword.currentPasswordInput)
            .type('davit.vardapetyan');

        functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, selectors.myAccount.editPassword.newPasswordInput)
            .type('newpass');

        functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, selectors.myAccount.editPassword.reTypePasswordInput)
            .type('newpasc');

        functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, '.error-text')
            .contains('New password is not matching');

        functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, '.btn.primary-btn')
            .should('be.disabled');

    });



});

// Function to navigate to My Account
const navigateToMyAccount = () => {

    functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.profile-image')
        .eq(5)
        .trigger('mouseover');


    functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, selectors.myAccount.container)
        .eq(0)
        .click();

    cy.wait(config.waitTimes.pageLoad);
    cy.url().should('include', '/user-account');
};

const editPassword = () => {
    // Click the Change Password link

    functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserSettings, '.morelink.change-link.cursor-pointer')
        .eq(1)
        .click({ force: true }); // Force click in case of any overlay

    // Verify that the password edit modal is visible
    functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, '.inner')
        .should('be.visible');
};

const typeInPasswordFields = (currentPassword, newPassword) => {

    functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, selectors.myAccount.editPassword.currentPasswordInput)
        .type(currentPassword);

    functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, selectors.myAccount.editPassword.newPasswordInput)
        .type(newPassword);

    functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, selectors.myAccount.editPassword.reTypePasswordInput)
        .type(newPassword);
};

const submitPasswordChange = () => {

    functions.getSingleShadowElement(selectors.shadowElement.shadowEditPassword, selectors.myAccount.editPassword.submitButton)
        .click();


};

// Function to fill address
const fillAddress = (firstName = '', lastName = '', streetName = '', addressLine1 = '', addressLine2 = '', zipCode = '', city = '', country = '', number = '', isDefaultBilling = false, isDefaultShipping = false) => {
    // Fill First Name if provided
    if (firstName) {

        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.firstNameInput)
            .clear()
            .type(firstName);
    }

    // Fill Last Name if provided
    if (lastName) {
        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.lastNameInput)
            .clear()
            .type(lastName);
    }

    // Fill Street Name if provided
    if (streetName) {
        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.streetNameInput)
            .clear()
            .type(streetName);
    }

    // Fill Address Line 1 if provided
    if (addressLine1) {
        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.addressLine1Input)
            .clear()
            .type(addressLine1);
    }

    // Fill Address Line 2 if provided
    if (addressLine2) {
        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.addressLine2Input)
            .clear()
            .type(addressLine2);
    }

    // Fill Zip Code if provided
    if (zipCode) {
        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.zipCodeInput)
            .clear()
            .type(zipCode);
    }

    // Fill City if provided
    if (city) {
        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.cityInput)
            .clear()
            .type(city);
    }

    // Fill Country if provided
    if (country) {
        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.countrySelect)
            .select(country);
    }

    // Fill Number if provided
    if (number) {
        functions.getSingleShadowElement(selectors.shadowElement.shadowAddedItAddress, selectors.myAccount.userSettings.numberInput)
            .clear()
            .type(number);
    }


};

const deleteButton = (index) => {
    functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserSettings, 'button')
        .filter(':has(svg)') // Filters buttons that contain an SVG
        .eq(index) // Uses the provided index to select the button
        .click();
};

const openAddressMenu = () => {
    functions.getDoubleShadowElement(selectors.shadowElement.shadowUserAccount, selectors.shadowElement.shadowUserSettings, selectors.myAccount.userSettings.addAddressButton)
        .click();
};
