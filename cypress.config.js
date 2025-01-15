const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    "chromeWebSecurity": false,
    baseUrl: 'https://pointssystem.armdev.am',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Increase timeouts
    defaultCommandTimeout: 20000, // Set timeout for commands (in milliseconds)
    pageLoadTimeout: 20000, // Set timeout for full page loads (in milliseconds)
    video: false,
    screenshotOnRunFailure: true,
  },
});
