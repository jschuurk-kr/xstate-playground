import { test as base } from '@playwright/test';


type MyFixtures = {
    homePage: void;
  };

export const test = base.extend<MyFixtures>({
    homePage: async ({page}, use) => {
        await page.goto('https://playwright.dev/');
        await use();
        }
    });