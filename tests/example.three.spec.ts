import { expect } from '@playwright/test';
import { createMachine } from "xstate";
import { createTestModel } from "@xstate/graph";
import { test } from './fixtures';


const machine = createMachine({
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
        CLICK_DOCS: 'apiPage',
        CLICK_HOME: 'onHomePage'
      }
    },
    apiPage: {
      on: {
        CLICK_HOME: 'onHomePage'
      }
    }
  },
});

test.describe("My app", () => {
  createTestModel(machine)
    .getSimplePaths()
    .forEach((path) => {
      test(path.description, async ({ page, homePage }) => {
        await path.test({
          states: {
            onHomePage: async () => {
              await expect(page).toHaveURL("https://playwright.dev/")
              await expect(page).toHaveTitle(/Playwright/);
            },
            introPage: async () => {
              await expect(page).toHaveURL("https://playwright.dev/docs/intro")
              await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
            },
            apiPage: async () => {
              await expect(page).toHaveURL("https://playwright.dev/docs/api/class-playwright")
              await expect(page.getByRole('heading', { name: 'Playwright Library' })).toBeVisible();
            }
          },
          events: {
            CLICK_GET_STARTED: async () => {
              page.getByRole("link", {name: "Get started"}).click()
            },
            CLICK_DOCS: async () => {
              page.getByRole("link", {name: /^API$/}).click()
            },
            CLICK_HOME: async () => {
              page.getByRole("link", {name: /^Playwright logo Playwright$/}).click()
            }
          },
          
        });
      });
    });
});