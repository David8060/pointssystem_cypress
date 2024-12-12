const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Increase timeouts
    defaultCommandTimeout: 250000, // Set timeout for commands (in milliseconds)
    pageLoadTimeout: 250000, // Set timeout for full page loads (in milliseconds)
    video: false, 
  },
});
