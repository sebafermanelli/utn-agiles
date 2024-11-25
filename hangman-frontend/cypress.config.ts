import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://utn-agiles-tp.vercel.app/",
    video: false,
    screenshotOnRunFailure: false,
    supportFile: false,
  },
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
});
