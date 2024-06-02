import { Page } from "@playwright/test";
import { Generics } from "@utils/generics";

export class PlaywrightPage extends Generics {
  page: Page
  constructor(page: Page) {
    super(page)
    this.page = page
  }
  async verifyNavigation() {
    await this.clickElement('link', 'Get started')
    await this.waitForSelector('h1:has-text("Installation")', "Installation Header")
    await this.clickElement('text', 'Search')
    await this.fillOnInput({ findElementBy: 'placeholder', locatorOrLabel: 'Search docs', inputValue: 'Xpath' });
    await this.clickElement('link', 'XPath locator Other locators');
    await this.clickElement('link', 'Test configuration');
    await this.clickElement('label', 'Switch between dark and light');
    await this.clickElement('link', 'Command line');
    await this.clickElement('link', 'Writing test');
  }
}
