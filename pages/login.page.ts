import { Page } from "@playwright/test";
import { GenericMethods } from "@utils/genericMethods";

export class LoginPage extends GenericMethods {
  page: Page
  constructor(page: Page) {
    super(page)
    this.page = page
  }
  async login() {
  }
}
