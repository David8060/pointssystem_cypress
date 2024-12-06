// cypress/support/selectors.js

export const selectors = {

    shadowElement: {
        shadowlogin: 'ngs-loads-login-login',
        shadowContainerForgotPassword: 'ngs-loads-user-password-forgot-forgotpassword',
        shadowHeader: 'ngs-loads-header-header',
        shadowUserAccount: 'ngs-loads-user-account-useraccount',
        shadowUserOrders: 'ngs-loads-user-orders-userorders',
        shadowUserActivity: 'ngs-loads-user-activity-useractivity',
        shadowUserSettings: 'ngs-loads-user-settings-usersettings',
        shadowAddedItAddress: 'ngs-loads-user-address-addeditaddress',
        shadowEditPassword: 'ngs-loads-user-password-edit-editpassword',
        shadowPopup: 'ngs-loads-popup-popup',
        shadowPersonalInfo: 'ngs-loads-user-personalinfo-personalinfo',
        shadowUserInfo: 'ngs-loads-user-info-userinfo',
        shadowEmployeesList: 'ngs-loads-employees-list-employeeslist',
        shadowEmployee: 'ngs-loads-employees-item-employee',
        shadowEmployeeManagement: 'ngs-loads-employees-management-management',
        shadowStepper: 'ngs-loads-stepper-main-stepper',
        shadowSendReward: 'ngs-loads-stepper-sendreward-sendreward',
        shadowSelectPoints: 'ngs-loads-stepper-selectpoints-selectpoints',
        shadowSwitcher: 'ngs-loads-switcher-switcher',
        shadowShowPost: 'ngs-loads-posts-show-showpost',
        shadowListPosts: 'ngs-loads-posts-list-posts',
        shadowItemPost: 'ngs-loads-posts-item-post',
        shadowPostComment: 'ngs-loads-posts-comment-postcomment',
        shadowListProducts: 'ngs-loads-products-list-products',
        shadowcreatepost: 'ngs-loads-stepper-createpost-createpost',
        shadowMainStepper: 'ngs-loads-stepper-main-stepper',
        shadowCommunity: 'ngs-loads-community-community',


    },

    login: {
        emailInput: '#email',
        passwordInput: '#password',
        lockIcon: '.lock-icon',
        primaryButton: '.primary-btn',
        errorMsg: '.error-msg',
        forgotPasswordLink: 'a.small',
    },
    forgotPassword: {
        inputField: 'input[type="text"]',
        errorText: '.error-text',
        digitInput: '.digit-input',
        innerForgotPassword: '.login-container.forgot-password-inner',
    },
    userForgotPassword: {
        primaryButton: '.btn.primary-btn',
    },
    myAccount: {
        profileImage: '.profile-image',
        profileInfo: '.profile-info',
        container: '.account-detail',
        personalInfo: 'ngs-loads-user-personalinfo',
        myOrders: '.my-item.medium1',
        viewMoreText: '.view-more-text',
        orderHeaderName: '.order-detail-content-header-cell.order-header-name',
        orderDetailHeaderCell: '.order-detail-content-header-cell',
        editButton: '.edit-button',
        userSettings: {
            addAddressButton: '.add-address.small',
            firstNameInput: 'input[placeholder="First Name"]',
            lastNameInput: 'input[placeholder="Last Name"]',
            streetNameInput: 'input[placeholder="Street Name"]',
            addressLine1Input: 'input[placeholder="Address Line 1"]',
            addressLine2Input: 'input[placeholder="Address Line 2"]',
            zipCodeInput: 'input[type="text"]:eq(4)',
            cityInput: 'input[type="text"]:eq(5)',
            countrySelect: '#country',
            numberInput: 'input[type="number"]',
            defaultBillingCheckbox: 'label[for="isDefaultBillingAddress"]',
            defaultShippingCheckbox: 'label[for="isDefaultShippingAddress"]',
            primaryButton: '.btn.primary-btn',
            cancelButton: 'button.btn:contains("Cancel")', 
            closeButton: '.close-btn', 
        },
        editPassword: { 
            currentPasswordInput: '#f-current-password',
            newPasswordInput: '#f-new-password',
            reTypePasswordInput: '#f-reType-password',
            submitButton: '.btn.primary-btn',
            confirmButton: '#f_primary-btn',
        },
    },
};
