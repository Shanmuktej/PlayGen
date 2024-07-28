import { FruitDataType } from "@pages/api.page";
import { scenario } from "@utils/fixtures";

scenario.describe('Basic usage of the framework', () => {
  scenario('Testing Links, Labels, Placeholders', { tag: '@playwright' }, async ({ playwrightPage }) => {
    await playwrightPage.verifyNavigation()
  });
  scenario('Multi User Contexts', { tag: '@letcode' }, async ({ user1, user2 }) => {
    let user1Page = user1.page
    let user2Page = user2.page
    await user1Page.goto("https://playwright.dev/")
    await user2Page.goto("https://playwright.dev/")
    await user1Page.click('text=Get Started')
    await user2Page.click('text=Get Started')
  });
  scenario("mocks a fruit and doesn't call api", { tag: '@api' }, async ({ apiPage }) => {
    const json: FruitDataType = { name: 'Teja', id: 21 };
    await apiPage.verifyMockedDataIsVisible(json)
  });
})