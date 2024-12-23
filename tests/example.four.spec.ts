import { expect, Page } from '@playwright/test';
import { createMachine } from "xstate";
import { createTestModel } from "@xstate/graph";
import { test } from './fixtures';

// This leads to weird failures.

const machine = createMachine({
  id: 'documentSearch',
  initial: 'onHomePage',
  states: {
    onHomePage: {
      on: {
        CLICK_GET_STARTED: 'introPage',
        CLICK_DOCS: 'apiPage',
      },
      meta: {
        test: async (page: Page) => {
          await expect(page).toHaveTitle(/Playwright/);
        },
      },
    },
    introPage: {
      on : {
        CLICK_DOCS: 'apiPage',
        CLICK_HOME: 'onHomePage'
      },
      meta: {
        test: async (page: Page) => {
          await expect(page).toHaveTitle(/Playwright/);
        },
      },
    },
    apiPage: {
      // this breaks the tests, except when in ui mode
      on: {
        CLICK_HOME: 'onHomePage'
      },
      meta: {
        test: async (page: Page) => {
          await expect(page).toHaveTitle(/Playwright/);
        },
      },
    }
  },
});

test.describe("My app", () => {
  createTestModel(machine)
    .getSimplePaths()
    .forEach((path) => {
      test(path.description, async ({ page, homePage }) => {
        await path.test({
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