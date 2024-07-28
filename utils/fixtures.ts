import { APIPage } from '@pages/api.page';
import { LoginPage } from '@pages/login.page';
import { PlaywrightPage } from '@pages/playwright.page';
import test, { Page, Locator, Response } from '@playwright/test';
export let page: Page

type FixtureTypes = {
  page: Page,
  playwrightPage: PlaywrightPage,
  apiPage: APIPage,
  user1: LoginPage
  user2: LoginPage
}
export const scenario = test.extend<FixtureTypes>({
  page: async ({ page: basePage }, use) => {
    page = basePage
    await page.goto('/')
    await use(page);
  },
  playwrightPage: async ({ page: basePage }, use) => {
    page = basePage
    await page.goto('/')
    let playwrightPage = new PlaywrightPage(page)
    // Do login actions
    await use(playwrightPage);
  },
  apiPage: async ({ page: basePage }, use) => {
    page = basePage
    await page.goto('/')
    let apiPage = new APIPage(page)
    // Do login actions
    await use(apiPage);
  },
  user1: async ({ browser }, use) => {
    let context = await browser.newContext({ storageState: 'user1.json' })
    let page = await context.newPage()
    await page.goto('/signin')
    let loginPage = new LoginPage(page)
    // Move the credentials to .env later
    await loginPage.login("teja1@testing.com", "teja1@testing.com")
    await context.storageState({ path: 'user1.json' });
    await use(loginPage);
  },
  user2: async ({ browser }, use) => {
    let context = await browser.newContext({ storageState: 'user2.json' })
    let page = await context.newPage()
    await page.goto('/signin')
    let loginPage = new LoginPage(page)
    // Move the credentials to .env later
    await loginPage.login("teja2@testing.com", "teja2@testing.com")
    await context.storageState({ path: 'state.json' });
    await use(loginPage);
  }
});

export const expect = scenario.expect
export const step = scenario.step
export type LocatorType = Locator
export type ResponseType = Response