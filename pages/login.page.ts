import { Page } from "@playwright/test";
import { Generics } from "@utils/generics";

export class LoginPage extends Generics {
  page: Page
  constructor(page: Page) {
    super(page)
    this.page = page
  }
  async login(email: string, password: string) {
    await this.fillOnInput({ findElementBy: 'locator', locatorOrLabel: "[name=email]", inputValue: email })
    await this.fillOnInput({ findElementBy: 'locator', locatorOrLabel: "[name=password]", inputValue: password })
    await this.clickOnButton("Login")
  }
}
