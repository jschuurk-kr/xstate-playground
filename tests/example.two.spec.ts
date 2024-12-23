import { expect, Page } from '@playwright/test';
import { createMachine } from "xstate";
// import { createTestModel } from "@xstate/graph"; // also in @xstate/test
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
      on: {
        CLICK_HOME: 'onHomePage'
      },
      meta: {
        test: async (page: Page) => {
          await expect(page).toHaveTitle(/Playwright/);
        },
      },
    },
}});

const model = createModel(machine).withEvents({
  CLICK_GET_STARTED: {
    exec: async (page: Page) => {
      page.getByRole("link", {name: "Get started"}).click();
    },
  },
  CLICK_DOCS: {
    exec: async (page: Page) => {
      page.getByRole("link", {name: /^API$/}).click();
    }
  },
  CLICK_HOME: {
    exec: async (page: Page) => {
      page.getByRole("link", {name: /^Playwright logo Playwright$/}).click();
    }
  }
});

// const model2 = createTestModel(machine, { events: {
//   CLICK_GET_STARTED: {
//     exec: async (page: Page) => {
//       page.getByRole("link", {name: "Get started"}).click();
//     },
//   },
//   CLICK_DOCS: {
//     exec: async (page: Page) => {
//       page.getByRole("link", {name: /^API$/}).click();
//     }
//   },
//   CLICK_HOME: {
//     exec: async (page: Page) => {
//       page.getByRole("link", {name: /^Playwright logo Playwright$/}).click();
//     }
//   }
// }});

test.describe("My app", () => {
  const testPlans = model.getShortestPathPlans();

  testPlans.forEach((plan) => {
    test.describe(plan.description, () => {
      plan.paths.forEach((path) => {
        test(path.description, async ({ page, homePage }) => {
          // fixture instead of:
          // do any setup, then...

          await path.test(page);
        });
      });
    });
  });

  test('should have full coverage', () => {
    return model.testCoverage();
  });
});