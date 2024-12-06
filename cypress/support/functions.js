import { config } from '../support/config';
import { selectors } from '../support/selectors';

function getSingleShadowElement(shadowRoot, selector) {
    return cy.get(shadowRoot)
        .shadow()
        .find(selector);
}

// Function to interact with two nested shadow DOM layers
function getDoubleShadowElement(outerShadowRoot, innerShadowRoot, selector) {
    return cy.get(outerShadowRoot)
        .shadow()
        .find(innerShadowRoot)
        .shadow()
        .find(selector);
}

function getTripleShadowElement(outerShadowRoot, middleShadowRoot, innerShadowRoot, selector) {
    return cy.get(outerShadowRoot)
        .shadow()
        .find(middleShadowRoot)
        .shadow()
        .find(innerShadowRoot)
        .shadow()
        .find(selector);
}


const rotateEmployeeList = (angle, direction) => {
    const action = direction === 'down' ? 'down' : 'up'; // fixed direction to use 'up'

    // Click the corresponding button based on the direction
    cy.get(selectors.shadowElement.shadowEmployeesList)
        .shadow()
        .find(`.polygon.polygon-${action}.f_polygon-${action}.f_clickable`)
        .click();

    cy.wait(config.waitTimes.pageLoad);

    // Assert the rotation has taken place
    cy.get(selectors.shadowElement.shadowEmployeesList)
        .shadow()
        .find('#f_employees-list')
        .should('have.attr', 'style', `transform: rotate(${angle}deg);`);
};


// Function to type in the employee search input
const typeInEmployeeSearch = (inputText) => {
    cy.get(selectors.shadowElement.shadowEmployeesList)
        .shadow()
        .find(selectors.shadowElement.shadowEmployeeManagement)
        .shadow()
        .find('#f_employee_search')
        .type(inputText);
};


function adjustQuantityOfProduct(inputSelector, plusBtnSelector, minusBtnSelector, number) {
    // Get the input field and store its initial value
    cy.get(inputSelector)
        .invoke('val')
        .then((initialValue) => {
            const currentValue = parseInt(initialValue, 10);

            // Click the plus button to increase the quantity
            cy.get(plusBtnSelector)
                .eq(number)
                .click();

            // Verify the value increased by 1
            cy.get(inputSelector)
                .should('have.value', currentValue + 1);

            // Click the minus button to decrease the quantity
            cy.get(minusBtnSelector)
                .eq(number)
                .click();

            // Verify the value decreased by 1
            cy.get(inputSelector)
                .should('have.value', currentValue); // It should be back to the initial value

            // Decrease until the value reaches 1
            let decreaseTimes = currentValue - 1; // Calculate how many times to click the minus button
            for (let i = 0; i < decreaseTimes; i++) {
                cy.get(minusBtnSelector)
                    .eq(number)
                    .click();
            }

        });
}


const verifyAwardsPage = (action) => {
    const targetText = action === 'given' ? 'Awards Given' : 'Awards Received';
    const urlFragment = action === 'given' ? '/user-account/user-activity/given' : '/user-account/user-activity/received';

    // Assert URL contains the correct fragment
    cy.url().should('include', urlFragment);

    // Assert the correct tab is active
    functions.getDoubleShadowElement(
        selectors.shadowElement.shadowUserAccount,
        selectors.shadowElement.shadowUserActivity,
        '.activity-tab'
    )
        .contains(targetText)
        .should('have.class', 'is_active');
};





const functions = {
    getSingleShadowElement,
    getDoubleShadowElement,
    rotateEmployeeList,
    typeInEmployeeSearch,
    getTripleShadowElement,
    adjustQuantityOfProduct,
    verifyAwardsPage
};

export default functions;