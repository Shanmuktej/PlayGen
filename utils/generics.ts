import { Locator, Page, Response } from '@playwright/test';
import { expect, step } from '@utils/fixtures';
let tableHeaders = "thead>tr>td"
let tableRecords = "tbody>tr"
export type SelectType = {
    selector: string
    selectBy: 'label' | 'value' | 'index',
    option: string
}
export type InputType = {
    findElementBy: 'label' | 'placeholder' | 'locator'
    locatorOrLabel: string
    inputValue: string
}
export type ToastType = {
    title: string | null
    message: string | null
}
export class Generics {
    page: Page
    constructor(page: Page) {
        this.page = page;
    }
    protected async pause() {
        await this.page.pause()
    }
    protected async goto(url: string) {
        await step(`Go to url: ${url}`, async () => {
            await this.page.goto(url)
        })
    }
    protected async reload() {
        await step('Reloading the page', async () => {
            await this.page.reload({ waitUntil: 'load' })
        })
    }
    protected async hardReload() {
        await step('Hard reloading the page', async () => {
            await this.page.evaluate(() => {
                window.location.reload();
            });
        })
    }
    protected async waitForSeconds(timeoutInSeconds: number) {
        await step(`Waiting for ${timeoutInSeconds} seconds`, async () => {
            await this.page.waitForTimeout(timeoutInSeconds * 1000)
        })
    }
    protected async clickOnModalButton(buttonName: string, exact?: 'exact' | 'non-exact', timeout?: number) {
        await step(`Click on Modal Button: ${buttonName}`, async () => {
            let strict = exact === 'exact'
            await this.page.locator('.modal').getByRole('button', { name: buttonName, exact: strict }).first().click({ timeout: timeout })
        })
    }
    protected async clickOnButton(buttonName: string, exact?: 'exact' | 'non-exact', timeout?: number) {
        await step(`Click on Button: ${buttonName}`, async () => {
            let strict = exact === 'exact'
            await this.page.getByRole('button', { name: buttonName, exact: strict }).click({ timeout: timeout })
        })
    }
    protected async clickOnLink(link: string) {
        await step(`Click on Link: ${link}`, async () => {
            await this.page.getByRole('link', { name: link }).click()
        })
    }
    protected async clickOnTab(tab: string) {
        await step(`Click on Tab: ${tab}`, async () => {
            await this.page.getByRole('tab', { name: tab }).click()
        })
    }
    protected async clickOnText(text: string) {
        await step(`Click on Text: ${text}`, async () => {
            await this.page.locator(`:has-text('${text}')`).first().click()
        })
    }
    protected async typeOnInput(input: InputType) {
        await step(`Type: ${input.inputValue} on input found by ${input.findElementBy}: ${input.locatorOrLabel}`, async () => {
            if (input.findElementBy == 'label') await this.page.getByLabel(input.locatorOrLabel).pressSequentially(input.inputValue)
            if (input.findElementBy == 'placeholder') await this.page.getByPlaceholder(input.locatorOrLabel).pressSequentially(input.inputValue)
            if (input.findElementBy == 'locator') await this.page.locator(input.locatorOrLabel).pressSequentially(input.inputValue)
        })
    }
    protected async fillOnInput(input: InputType, exact?: 'exact') {
        await step(`Type: ${input.inputValue} on input found by ${input.findElementBy}: ${input.locatorOrLabel}`, async () => {
            if (input.findElementBy == 'label') await this.page.getByLabel(input.locatorOrLabel, { exact: exact === 'exact' }).fill(input.inputValue)
            if (input.findElementBy == 'placeholder') await this.page.getByPlaceholder(input.locatorOrLabel, { exact: exact === 'exact' }).fill(input.inputValue)
            if (input.findElementBy == 'locator') await this.page.locator(input.locatorOrLabel).fill(input.inputValue)
        })
    }
    protected async selectOptionBy(selectOption: SelectType) {
        await step(`Select option by ${selectOption.selectBy}: ${selectOption.option}`, async () => {
            let element = this.page.locator(selectOption.selector)
            if (selectOption.selectBy == 'label') await element.selectOption({ label: selectOption.option });
            if (selectOption.selectBy == 'value') await element.selectOption({ value: selectOption.option });
            if (selectOption.selectBy == 'index') await element.selectOption({ index: Number(selectOption.option) });
        })
    }
    protected async getTableHeaders(onPopup?: 'On popup'): Promise<string[]> {
        let headers: string[] = []
        await step(`Fetching table headers ${onPopup ?? ''}`, async () => {
            if (onPopup) {
                headers = await this.page.locator('.modal').locator(tableHeaders).allInnerTexts()
            } else {
                headers = await this.page.locator(tableHeaders).allInnerTexts()
            }
        })
        return headers
    }
    protected async getTableRecords(onPopup?: 'On popup'): Promise<Locator[]> {
        let records: Locator[] = []
        await step(`Fetching table records ${onPopup ?? ''}`, async () => {
            if (onPopup) {
                await this.pause()
                records = await this.page.locator('.modal').locator('table').nth(0).locator(tableRecords + ':visible').all()
            } else {
                records = await this.page.locator('table').nth(0).locator(tableRecords + ':visible').all()
            }
        })
        return records
    }
    protected async getFilteredTableRecords(filterText: string): Promise<Locator[]> {
        let records: Locator[] = []
        await step('Fetching table records', async () => {
            records = await this.page.locator('table').nth(0).locator(tableRecords + ':visible').filter({ hasText: filterText }).all()
        })
        return records
    }
    protected async getColumnValues(columnName: string): Promise<string[]> {
        let columnValues: string[] = []
        let columnIndex = (await this.getTableHeaders()).indexOf(columnName)
        await step('Fetching column values', async () => {
            let records = await this.getTableRecords()
            for await (const record of records) {
                let recordValues = await record.locator('td').allTextContents()
                columnValues.push(recordValues.at(columnIndex)!)
            }
        })
        return columnValues
    }
    protected async verifyPopup(displayed: 'should display' | 'should not display') {
        await step(`Verify that popup ${displayed}`, async () => {
            displayed == 'should display' ?
                await expect(this.page.locator('.modal')).toBeVisible()
                : await expect(this.page.locator('.modal')).toBeHidden()
        })
    }
    protected async verifyURLToHaveText(text: string) {
        await step(`Expecting URL to have text:${text}`, async () => {
            let url = this.page.url()
            expect(url).toContain(text)
        })
    }
    protected async verifyIfElementIsVisible(selector: string, elementName: string) {
        await step(`Verifying that ${elementName} with Locator: ${selector} is visible`, async () => {
            await expect(this.page.locator(selector), `Expected ${elementName} to be visible`).toBeVisible()
        })
    }
    protected async verifyIfElementIsHidden(selector: string, elementName: string) {
        await step(`Verifying that ${elementName} with Locator: ${selector} is visible`, async () => {
            await expect(this.page.locator(selector), `Expected ${elementName} to be hidden but is not`).toBeHidden()
        })
    }
    protected async verifyIfButtonIsVisible(buttonName: string, exact?: 'exact' | 'non-exact', onPopup?: 'onPopup') {
        await step(`Verifying that ${buttonName} button is visible`, async () => {
            if (onPopup === 'onPopup') {
                await expect(this.page.locator('.modal').getByRole('button', { name: buttonName, exact: exact === 'exact' }).first(), `Expected ${buttonName} to be visible on popup`).toBeVisible()
            } else {
                await expect(this.page.getByRole('button', { name: buttonName, exact: exact === 'exact' }), `Expected ${buttonName} to be visible`).toBeVisible()
            }
        })
    }
    protected async verifyIfButtonShouldNotBeVisible(buttonName: string, exact?: 'exact' | 'non-exact', onPopup?: 'onPopup') {
        await step(`Verifying that ${buttonName} button is visible`, async () => {
            if (onPopup === 'onPopup') {
                await expect(this.page.locator('.modal').getByRole('button', { name: buttonName, exact: exact === 'exact' }).first(), `Expected ${buttonName} not to be visible on popup`).toBeHidden()
            } else {
                await expect(this.page.getByRole('button', { name: buttonName, exact: exact === 'exact' }), `Expected ${buttonName} not to be visible`).toBeHidden()
            }
        })
    }
    protected async verifyIfInputIsVisible(placeholder: string) {
        await step(`Verifying that Input with placeholder: ${placeholder} is visible`, async () => {
            await expect(this.page.getByPlaceholder(placeholder), `Expected Input with placeholder: ${placeholder} to be visible but is not`).toBeVisible()
        })
    }
    protected async verifyIfTextIsVisible(hasText: string, exact?: 'exact' | 'non-exact', onPopup?: 'onPopup') {
        await step(`Verifying if element with text: ${hasText}`, async () => {
            let textIsVisible = false
            if (onPopup === 'onPopup') {
                textIsVisible = await this.page.locator('.modal').getByText(hasText, { exact: exact === 'exact' }).isVisible()
            } else {
                textIsVisible = await this.page.getByText(hasText, { exact: exact === 'exact' }).isVisible()
            }
            expect(textIsVisible).toBeTruthy()
        })
    }
    protected async verifyIfTextIsHidden(hasText: string, exact?: 'exact' | 'non-exact', onPopup?: 'onPopup') {
        await step(`Verifying if element with text:${hasText} should not be visible`, async () => {
            let textIsHidden = false
            if (onPopup === 'onPopup') {
                textIsHidden = await this.page.locator('.modal').getByText(hasText, { exact: exact === 'exact' }).isHidden()
            } else {
                textIsHidden = await this.page.getByText(hasText, { exact: exact === 'exact' }).isHidden()
            }
            expect(textIsHidden).toBeTruthy()
        })
    }
    protected async verifyIfLinkIsVisible(hasText: string, exact?: 'exact' | 'non-exact', onPopup?: 'onPopup') {
        await step(`Verifying if element with Link:${hasText}`, async () => {
            let textIsVisible = false
            if (onPopup === 'onPopup') {
                textIsVisible = await this.page.locator('.modal').getByRole('link', { exact: exact === 'exact', name: hasText }).isVisible()
            } else {
                textIsVisible = await this.page.getByRole('link', { exact: exact === 'exact', name: hasText }).isVisible()
            }
            expect(textIsVisible).toBeTruthy()
        })
    }
    protected async verifyIfElementHasText(locator: string, hasText: string): Promise<Locator> {
        let hasTextLocator = this.page.locator(`${locator}:has-text('${hasText}')`)
        await step(`Verifying if element with text:${hasText}`, async () => {
            await expect(hasTextLocator, `Expected element with ${hasText} to be visible but is not`).toBeVisible()
        })
        return hasTextLocator
    }
    protected async verifyIfElementExists(locator: string, elementName: string) {
        await step(`Verifying that ${elementName} with Locator: ${locator} exists`, async () => {
            await expect(this.page.locator(locator), `Expected ${elementName} to exist in DOM`).toBeAttached()
        })
    }
    protected async verifySelectedOption(locator: string, expectedValue: string, elementName: string) {
        await step(`Verifying that ${elementName} dropdown to have selected option: ${expectedValue}`, async () => {
            let actualValue = await this.page.locator(locator).inputValue()
            actualValue = await this.page.locator(`[value='${actualValue}']`).innerText()
            expect(actualValue, `Expected to have value: ${expectedValue} and found ${actualValue}`).toContain(expectedValue)
        })
    }
    protected async verifyIfDropdownHasLabels(locator: string, expectedValues: string[], elementName: string) {
        await step(`Verifying that ${elementName} dropdown to have expected values`, async () => {
            let options = await this.page.locator(locator + ">option").allTextContents()
            options = options.sort()
            expectedValues = expectedValues.sort()
            for (let index = 0; index < expectedValues.length; index++) {
                expect(options[index], `Expected to have value: ${expectedValues[index]} but found ${options[index]}`).toContain(expectedValues[index])
            }
        })
    }
    protected async verifyIfDropdownHasOptions(locator: string, elementName: string) {
        await step(`Verifying that ${elementName} dropdown to have options`, async () => {
            let options = await this.page.locator(locator + ">option").all()
            expect(options.length, `Expected to have options on dropdown: ${elementName}`).toBeGreaterThanOrEqual(2)
        })
    }
    protected async clickAndUpload(locator: string, files: string[]) {
        await step(`Clicking on locator:${locator} and uploading ${files} files`, async () => {
            const [fileChooser] = await Promise.all([
                this.page.waitForEvent('filechooser'),
                this.page.locator(locator).click(),
            ]);
            await fileChooser.setFiles(files);
        })
    }
    protected async clickAndUploadAllFiles(locator: string, folderPath: string) {
        await step(`Clicking on locator:${locator} and uploading all files under folder: ${folderPath}`, async () => {
            const [fileChooser] = await Promise.all([
                this.page.waitForEvent('filechooser'),
                this.page.locator(locator).click(),
            ]);
            const fs = require('fs').promises;
            const path = require('path');
            const filesToUpload = await fs.readdir(folderPath);
            let files = []
            for (const fileName of filesToUpload) {
                files.push(path.join(folderPath, fileName));
            }
            await fileChooser.setFiles(files);
        })
    }
    protected async getToastMessage(type: 'success' | 'error' | 'info'): Promise<ToastType> {
        let toastData: ToastType = { title: '', message: '' }
        await step(`Read toast error title and message`, async () => {
            let toastLoc = this.page.locator(`.toast-${type}`).first()
            toastData.title = await toastLoc.locator('.toast-title').textContent()
            toastData.message = await toastLoc.locator('.toast-message').textContent()
        })
        return toastData
    }
    protected async submit() {
        await step('Submit the form', async () => {
            await this.page.locator('[type=submit]:visible').first().click()
        })
    }
    protected async verifyIfRecordsExist() {
        await step('Verify that records should exist', async () => {
            const records = await this.getTableRecords()
            if (records.length == 1) {
                expect(await records[0].innerText(), `Expected Message: No records found, but found ${records.length} record`).not.toMatch(/Yes/) //No Rows/Records Found
            } else {
                expect(records.length, `Expected records to be found, but found none`).toBeGreaterThanOrEqual(1)
            }
        })
    }
    protected async postRequest(APIName: string, APIData: Object) {
        await step(`Posting API request of API: ${APIName}`, async () => {
            const headers = {
                'Content-Type': 'application/json', // Add or modify headers as needed
            };
            const request = await this.page.request.post(`/api/ + ${APIName}`, {
                data: APIData, headers: headers
            })
            expect(request.ok()).toBeTruthy()
        })
    }
    protected async waitForSelector(selector: string, name: string) {
        await step(`Waiting for Selector: ${name} to be visible`, async () => {
            await this.page.waitForSelector(selector)
        })
    }
    protected async clickElement(selectorType: 'link' | 'button' | 'text' | 'label', identifier: string) {
        const stepMessage = `Click on ${selectorType}: ${identifier}`;
        await step(stepMessage, async () => {
            switch (selectorType) {
                case 'text':
                    await this.page.getByText(identifier).first().click();
                    break;
                case 'label':
                    await this.page.getByLabel(identifier).first().click();
                    break;
                default:
                    await this.page.getByRole(selectorType, { name: identifier }).first().click();
                    break;
            }
        });
    }
    protected async waitForURL(url: string | RegExp, timeout?: number) {
        await step(`Waiting for url: ${url} to be visible`, async () => {
            await this.page.waitForURL(url, { timeout: timeout ?? 30000 })
        })
    }
    protected async waitForSuccessResponse(api: string, timeout?: number): Promise<Response> {
        let response: Response
        await step(`Waiting for success response: ${api}`, async () => {
            response = await this.page.waitForResponse(new RegExp(api), { timeout: timeout ?? 30000 })
            expect(response.status(), `Expected API: ${api} to be successful but found error: ${response.text}`).toBeLessThan(300)
        })
        return response!
    }
    protected async mockAPI(api: string, json: Array<Object>) {
        let response: Response
        await step(`Mocking Data for API: ${api}`, async () => {
            await this.page.route(new RegExp(api), async route => {
                await route.fulfill({ json });
            })
        })
        return response!
    }
}