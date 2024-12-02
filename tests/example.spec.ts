import { test, expect } from '@playwright/test';
import { createMachine } from "xstate";
import { createTestModel, createTestMachine } from "@xstate/test";


const machine = createTestMachine({
  id: 'documentSearch',
  initial: 'onHomePage',
  states: {
    onHomePage: {
      on: {
        CLICK_GET_STARTED: 'introPage',
        CLICK_DOCS: 'apiPage',
      },
    },
    introPage: {
      on : {
      CLICK_DOCS: 'apiPage'
      }
    },
    apiPage: {}
  },
});

test.describe("My app", () => {
  createTestModel(machine)
    .getSimplePaths()
    .forEach((path) => {
      test(path.description, async ({ page }) => {
        await path.test({
          states: {
            onHomePage: async () => {
              await page.goto('https://playwright.dev/');
              await expect(page).toHaveTitle(/Playwright/);
            },
            introPage: async () => {
              await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
            },
            apiPage: async () => {
              await expect(page.getByRole('heading', { name: 'Playwright Library' })).toBeVisible();
            }
          },
          events: {
            CLICK_GET_STARTED: async () => {
              page.getByRole("link", {name: "Get started"}).click()
            },
            CLICK_DOCS: async () => {
              page.getByRole("link", {name: /^API$/}).click()
            }
          },
          
        });
      });
    });
});