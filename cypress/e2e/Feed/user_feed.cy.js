import { config } from '../../support/config';
import { selectors } from '../../support/selectors';
import functions from '../../support/functions';

describe('Points System User Feed', () => {
    beforeEach(() => {
        // Use the custom command to login and visit the page
        cy.loginAuthentication(config.urls.loginUrl, config.authCredentials.username, config.authCredentials.password);
        cy.wait(config.waitTimes.longWait); // Wait for elements to load

        cy.loginToPage(config.loginCredentials.username, config.loginCredentials.password);
        cy.wait(config.waitTimes.longWait);

        cy.viewport(1920, 980);
    });

    it('notification flow', () => {
        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.notification')
            .click();

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '#f_notification')
            .should('be.visible');

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.notification-content')
            .first()
            .click();

        functions.getSingleShadowElement(selectors.shadowElement.shadowShowPost, '.inner.modal-container')
            .should('be.visible')
            .contains('You’ve Earned Points!');

        functions.getSingleShadowElement(selectors.shadowElement.shadowShowPost, '.close-btn')
            .click();
    });

    it('notification’s mark all as read flow', () => {
        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.notification')
            .click();

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.options')
            .should('be.visible')
            .click()
            .contains('Mark all as read')
            .click();

        functions.getSingleShadowElement(selectors.shadowElement.shadowHeader, '.tooltip.extrasmall')
            .should('have.css', 'display', 'none');
    });


    it('check comment and like functionality with correct count expectations', () => {
    // Post a comment
    functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '#f_user-comment-input')
        .first()
        .should('be.visible');

    functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '#f_user-comment-input')
        .first()
        .should('be.visible')
        .type('test');

        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '.send-message')
            .first()
            .click();

        // Confirm comment is posted
        functions.getTripleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, selectors.shadowElement.shadowPostComment, '.comment-content')
            .should('contain.text', 'test');

        functions.getTripleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, selectors.shadowElement.shadowPostComment, '.actions')
            .first()
            .click();

        // Validate initial like count (should be 0 or not present)
        functions.getTripleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, selectors.shadowElement.shadowPostComment, '.comments-count')
            .first()
            .then(($likeCount) => {
                // Parse the like count text; set to 0 if not a valid number
                const initialCount = parseInt($likeCount.text().trim());
                const normalizedInitialCount = isNaN(initialCount) ? 0 : initialCount;
                expect(normalizedInitialCount).to.be.oneOf([0, 1]); // Handle no like state

                // Click the like button
                functions.getTripleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, selectors.shadowElement.shadowPostComment, '.react-section')
                    .first()
                    .click();

                // Check if the count is exactly 1 after liking
                functions.getTripleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, selectors.shadowElement.shadowPostComment, '.comments-count')
                    .first()
                    .should(($updatedLikeCount) => {
                        const newCount = parseInt($updatedLikeCount.text().trim());
                        const normalizedNewCount = isNaN(newCount) ? 0 : newCount;
                        expect(normalizedNewCount).to.equal(1); // Expect exactly 1 like
                    })
                    .then(() => {
                        // Unlike to revert to initial state
                        functions.getTripleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, selectors.shadowElement.shadowPostComment, '.actions')
                            .first()
                            .click();

                        // Validate it returns to 0
                        functions.getTripleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, selectors.shadowElement.shadowPostComment, '.comments-count')
                            .first()
                            .should('not.have.text', /\S/); // Confirm element is empty or only contains placeholder text
                    });
            });
    });



    it('check you may like interactions', () => {
        // Post a comment
        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowListProducts, '.products-ad')
            .first()
            .scrollIntoView()
            .should('be.visible');

        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowListProducts, '#f_swiper-button-prev')
            .should('be.visible') // Optional: Check visibility first
            .should('have.class', 'swiper-button-disabled');


        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowListProducts, '#f_swiper-button-next')
            .first()
            .click();

        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowListProducts, '#f_swiper-button-prev')
            .should('be.visible') // Optional: Check visibility first
            .should('not.have.class', 'swiper-button-disabled')
            .click()
            .should('have.class', 'swiper-button-disabled');

    });


    it('check liking post', () => {

        // Initial actions to navigate and reveal the react section
        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '.actions')
            .contains('.react-text', 'like')
            .first()
            .should('be.visible')
            .trigger('mouseover');


        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '.additional-reacts')
            .should('have.class', 'show');

        // Check the like count element before clicking
        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '.emoji-details')
            .first()
            .then(($likeCount) => {
                // Capture the initial count, or default to 0 if not present
                const initialCount = $likeCount.text().trim() ? parseInt($likeCount.text().trim()) : 0;

                // Click the 'like' button to like
                functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '.react-like')
                    .eq(0)
                    .click();

                // Validate the new count
                functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '.emoji-details')
                    .should(($updatedLikeCount) => {
                        const newCount = parseInt($updatedLikeCount.text().trim());

                        if (initialCount === 0) {
                            // If no likes existed, verify new count is 1
                            expect(newCount).to.equal(1);
                        } else {
                            // If a like already existed, verify it increments correctly
                            expect(newCount).to.equal(initialCount + 1);
                        }
                    })
                    .then(() => {

                        // Click again to unlike
                        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '.react-like')
                            .eq(0)
                            .click();

                        // Validate the count after unliking
                        functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '.emoji-details')
                            .first()
                            .should(($finalLikeCount) => {
                                // Parse the text content, trim, and set finalCount to 0 if the value is not a valid number
                                const finalCount = parseInt($finalLikeCount.text().trim());
                                const normalizedFinalCount = isNaN(finalCount) ? 0 : finalCount;

                                if (initialCount === 0) {
                                    // If it was the first like, the count should go back to zero
                                    expect(normalizedFinalCount).to.equal(0);
                                } else {
                                    // Otherwise, it should decrement back to the original count
                                    expect(normalizedFinalCount).to.equal(initialCount);
                                }
                            });

                    });
            });

    });


    it('my community and my organization check', () => {

        functions.getSingleShadowElement(selectors.shadowElement.shadowListPosts, '.organization-item')
            .eq(1)
            .should('not.have.class', 'is-active')
            .click()
            .should('have.class', 'is-active');


        functions.getSingleShadowElement(selectors.shadowElement.shadowListPosts, '.organization-item')
            .eq(0)
            .should('not.have.class', 'is-active')

    });


    it('check show more functionality', () => {

        for (let i = 1; i <= 7; i++) {
            const commentText = `testin`;

            writeComment(commentText);  // Call the writeComment function with the generated comment text

            // Optionally, wait for a short period before posting the next comment
            cy.wait(config.waitTimes.pageLoad);  
        }


        // Step 1: Get the count of visible comments
        functions.getDoubleShadowElement(
            selectors.shadowElement.shadowListPosts,
            selectors.shadowElement.shadowItemPost,
            '#f_post-comments'
        )
            .first()
            .scrollIntoView()
            .find(selectors.shadowElement.shadowPostComment)
            .shadow()
            .find('.user-comment:visible')
            .its('length') // Get the initial number of visible elements
            .then((initialVisibleCount) => {
                cy.log(`Initial visible count: ${initialVisibleCount}`); // Log initial count for debugging

                // Step 2: Find the first "Show more comments" button, ensure it's visible and click it
                functions.getDoubleShadowElement(
                    selectors.shadowElement.shadowListPosts,
                    selectors.shadowElement.shadowItemPost,
                    '.more-comments'
                )
                    .find('.cursor-pointer')
                    .each(($btn) => {
                        // Only click the button if it contains the text "Show more comments" and is visible
                        if ($btn.text().includes('Show more comments') && $btn.is(':visible')) {
                            cy.wrap($btn)
                                .scrollIntoView() // Ensure it is in the view
                                .click(); // Click the button
                            return false; // Exit the loop once the button is clicked
                        }
                    });

                // Step 3: Wait for comments to load (you can adjust this based on actual app behavior)
                cy.wait(config.waitTimes.pageLoad); // Wait for elements to load

                // Step 4: Verify the count of visible comments has increased
                functions.getDoubleShadowElement(
                    selectors.shadowElement.shadowListPosts,
                    selectors.shadowElement.shadowItemPost,
                    '#f_post-comments'
                )
                    .first()
                    .scrollIntoView()
                    .find(selectors.shadowElement.shadowPostComment)
                    .shadow()
                    .find('.user-comment:visible')
                    .its('length') // Get the updated number of visible elements
                    .then((updatedVisibleCount) => {
                        cy.log(`Updated visible count: ${updatedVisibleCount}`); // Log updated count for debugging

                        // Assert the count has increased
                        expect(updatedVisibleCount).to.be.gt(initialVisibleCount);
                    });
            });

    });


    it('reacting to the comment', () => {

        writeComment('tst');

        cy.wait(config.waitTimes.pageLoad); // Wait for page load or update

        const reactions = ['like', 'love', 'haha', 'sad', 'wow']; // Array with the reaction labels

        reactions.forEach((reaction, index) => {
            // Step 1: Trigger hover on the reactions
            functions.getTripleShadowElement(
                selectors.shadowElement.shadowListPosts,
                selectors.shadowElement.shadowItemPost,
                selectors.shadowElement.shadowPostComment,
                '.reaction'
            )
                .first()
                .trigger('mouseover');

            // Step 2: Ensure that the additional reactions are visible
            functions.getTripleShadowElement(
                selectors.shadowElement.shadowListPosts,
                selectors.shadowElement.shadowItemPost,
                selectors.shadowElement.shadowPostComment,
                '#f_additional-reacts'
            )
                .first()
                .should('have.class', 'show');

            // Step 3: Click the appropriate reaction based on the index (eq())
            functions.getTripleShadowElement(
                selectors.shadowElement.shadowListPosts,
                selectors.shadowElement.shadowItemPost,
                selectors.shadowElement.shadowPostComment,
                '#f_additional-reacts'
            )
                .find('span')
                .eq(index)  // Cycle through each reaction using the index
                .click();

            cy.wait(config.waitTimes.pageLoad); // Wait for page load or update

            // Step 4: Verify the first reaction text after clicking
            functions.getTripleShadowElement(
                selectors.shadowElement.shadowListPosts,
                selectors.shadowElement.shadowItemPost,
                selectors.shadowElement.shadowPostComment,
                '.reaction'
            )
                .first()
                .should('have.text', reaction); // Check that the reaction matches the clicked one


            functions.getTripleShadowElement(
                selectors.shadowElement.shadowListPosts,
                selectors.shadowElement.shadowItemPost,
                selectors.shadowElement.shadowPostComment,
                '#f_reacts'
            )
                .first()
                .within(() => {
                    cy.get('.comments-count').should('be.visible'); // Check that .comments-count exists
                    cy.get(`.emoji.${reaction}`).should('be.visible'); // Check that .emoji.like exists
                });




            // Step 5: Unclick the reaction (optional based on your test logic)
            functions.getTripleShadowElement(
                selectors.shadowElement.shadowListPosts,
                selectors.shadowElement.shadowItemPost,
                selectors.shadowElement.shadowPostComment,
                '.reaction'
            )
                .first()
                .click(); // Clicking back to the default state

            cy.wait(config.waitTimes.pageLoad); // Wait for the page to update again

            // Step 6: Verify that the reaction resets to "like" after unclicking
            functions.getTripleShadowElement(
                selectors.shadowElement.shadowListPosts,
                selectors.shadowElement.shadowItemPost,
                selectors.shadowElement.shadowPostComment,
                '.reaction'
            )
                .first()
                .should('have.text', 'like'); // Ensure the reaction is reset to "like"


        });


    });


});

function writeComment(commentText) {
    functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '#f_user-comment-input')
        .first()
        .should('be.visible');

    functions.getDoubleShadowElement(selectors.shadowElement.shadowListPosts, selectors.shadowElement.shadowItemPost, '#f_user-comment-input')
        .first()
        .should('be.visible')
        .type(commentText)
        .type('{enter}');
}
