import { Page } from "@playwright/test";
import { Generics } from "@utils/generics";

export type FruitDataType = { name: string, id: number };

export class APIPage extends Generics {
  page: Page
  constructor(page: Page) {
    super(page)
    this.page = page
  }
  async verifyMockedDataIsVisible(json: FruitDataType) {
    await this.mockAPI('/api/v1/fruits', [json])
    await this.goto('https://demo.playwright.dev/api-mocking');
    await this.verifyIfTextIsVisible(json.name)
  }
}
