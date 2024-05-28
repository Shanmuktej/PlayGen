import { scenario } from "@utils/fixtures";
import { clickElement, fillInput, getElementText, goto, waitForSelector } from "@utils/generics";

scenario.describe('Basic usage of the framework', () => {
  scenario('To use click element', async ({ login }) => {
    await goto("https://playwright.dev/")
    let text = await getElementText('.getStarted_Sjon')
    console.log(text)
    await clickElement('link', 'Get Started')
  });
  scenario('Waiting for selector', async ({ page }) => {
    await goto("/")
    await goto("/docs/intro")
    await waitForSelector('h1:has-text("Installation")', 2000)
  });
  scenario('Testing Links, Labels, Placeholders', async ({ page }) => {
    await clickElement('link', 'Get started')
    await clickElement('label', 'Search')
    await fillInput({ findElementBy: 'placeholder', locatorOrLabel: 'Search docs', inputValue: 'Xpath' });
    await clickElement('link', 'XPath locator​ Other locators');
    await clickElement('link', 'Test configuration');
    await clickElement('label', 'Switch between dark and light');
    await clickElement('link', 'Command line');
    await clickElement('link', 'Writing test');
  });
})