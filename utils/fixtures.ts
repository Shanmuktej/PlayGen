import { LoginPage } from '@pages/login.page';
import test, { Page, Locator, Response } from '@playwright/test';
export let page: Page

type FixtureTypes = {
  page: Page,
  login: LoginPage
}
export const scenario = test.extend<FixtureTypes>({
  page: async ({ page: basePage }, use) => {
    page = basePage
    await page.goto('/')
    await use(page);
  },
  login: async ({ page: basePage }, use) => {
    page = basePage
    await page.goto('/')
    let loginPage = new LoginPage(page)
    // Do login actions
    await loginPage.login()
    await use(loginPage);
  }
});

export const expect = scenario.expect
export const step = scenario.step
export type LocatorType = Locator
export type ResponseType = Response