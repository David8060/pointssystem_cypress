const { defineConfig } = require("cypress");

module.exports = defineConfig({
  experimentalSessionAndOrigin: true,
  e2e: {
    baseUrl: 'https://pointssystem.armdev.am',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Increase timeouts
    defaultCommandTimeout: 10000, // Set timeout for commands (in milliseconds)
    pageLoadTimeout: 10000, // Set timeout for full page loads (in milliseconds)
    video: false,
    screenshotOnRunFailure: true,
  },
});
