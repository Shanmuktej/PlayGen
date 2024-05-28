import { page, step, expect, LocatorType, ResponseType } from '@utils/fixtures';
let tableHeaderSelector = "thead>tr>th:visible"
let tableRecordsSelector = "tbody>tr:visible"

export type InputType = {
  findElementBy: 'label' | 'placeholder' | 'locator'
  locatorOrLabel: string
  inputValue: string
}
export type SelectType = {
  selector: string
  selectBy: 'label' | 'value' | 'index'
  option: string
}
export type ToastType = {
  title: string
  message: string
}
export type HeadersType = {
  [key: string]: string;
} | undefined;
export async function pause() {
  await page.pause()
}
export async function goto(url: string, timeout?: number, waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit") {
  await step(`Go to URL: ${url} and wait until ${waitUntil ?? 'load'} for ${timeout ?? 5000} ms`, async () => {
    await page.goto(url, { waitUntil: 'load', timeout: timeout ?? 5000 })
  })
}
export async function reload() {
  await step('Reloading the page', async () => {
    await page.reload({ waitUntil: 'load' })
  })
}
export async function hover(selector: string, options?: {
  force?: boolean | undefined;
  modifiers?: ("Alt" | "Control" | "Meta" | "Shift")[] | undefined;
  noWaitAfter?: boolean | undefined;
  position?: {
    x: number;
    y: number;
  } | undefined;
  strict?: boolean | undefined;
  timeout?: number | undefined;
  trial?: boolean | undefined;
}) {
  await step('Hover the element', async () => {
    await page.hover(selector, options)
  })
}
export async function clickButtonOnModal(buttonName: string, exactName?: 'exact' | 'non-exact', timeout?: number) {
  await step(`Click on Modal Button: ${buttonName}`, async () => {
    let strict = exactName === 'exact'
    await page.locator('.modal').getByRole('button', { name: buttonName, exact: strict }).first().click({ timeout: timeout })
  })
}
export async function clickButton(buttonName: string, exactName?: 'exact' | 'non-exact', timeout?: number) {
  await step(`Click on Button: ${buttonName}`, async () => {
    let strict = exactName === 'exact'
    await page.getByRole('button', { name: buttonName, exact: strict }).click({ timeout: timeout })
  })
}
export async function clickLink(link: string, exactName?: 'exact' | 'non-exact', timeout?: number) {
  await step(`Click on Link: ${link}`, async () => {
    let strict = exactName === 'exact'
    await page.getByRole('link', { name: link, exact: strict }).click({ timeout: timeout ?? 5000 })
  })
}
export async function clickTab(tab: string) {
  await step(`Click on Tab: ${tab}`, async () => {
    await page.getByRole('tab', { name: tab }).click()
  })
}
export async function clickText(text: string) {
  await step(`Click on Text: ${text}`, async () => {
    await page.locator(`:has-text('${text}')`).first().click()
  })
}
export async function clickAndUpload(locator: string, files: string[]) {
  await step(`Clicking on locator:${locator} and uploading ${files} files`, async () => {
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator(locator).click(),
    ]);
    await fileChooser.setFiles(files);
  })
}
export async function clickAndUploadAllFiles(locator: string, folderPath: string) {
  await step(`Clicking on locator:${locator} and uploading all files under folder: ${folderPath}`, async () => {
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator(locator).click(),
    ]);
    const fs = require('fs').promises;
    const path = require('path');
    const filesToUpload = await fs.readdir(folderPath);
    let files: string[] = []
    for (const fileName of filesToUpload) {
      files.push(path.join(folderPath, fileName));
    }
    await fileChooser.setFiles(files);
  })
}
export async function clickElement(selectorType: 'link' | 'button' | 'text' | 'label', identifier: string) {
  const stepMessage = `Click on ${selectorType}: ${identifier}`;
  await step(stepMessage, async () => {
    switch (selectorType) {
      case 'text':
        await page.getByText(identifier).first().click();
        break;
      case 'label':
        await page.getByLabel(identifier).first().click();
        break;
      default:
        await page.getByRole(selectorType, { name: identifier }).first().click();
        break;
    }
  });
}
export async function submit() {
  await step('Submit the form', async () => {
    await page.locator('[type=submit]:visible').first().click()

  })
}
export async function selectOptionBy(selectOption: SelectType) {
  await step(`Select option by ${selectOption.selectBy}: ${selectOption.option}`, async () => {
    let element = page.locator(selectOption.selector)
    if (selectOption.selectBy == 'label') await element.selectOption({ label: selectOption.option });
    if (selectOption.selectBy == 'value') await element.selectOption({ value: selectOption.option });
    if (selectOption.selectBy == 'index') await element.selectOption({ index: Number(selectOption.option) });
  })
}
export async function typeInput(input: InputType, exactName?: 'exact'): Promise<LocatorType> {
  let loc: LocatorType
  let isExact = exactName === 'exact'
  await step(`Type: ${input.inputValue} on input found by ${input.findElementBy}: ${input.locatorOrLabel}`, async () => {
    switch (input.findElementBy) {
      case 'label':
        loc = page.getByLabel(input.locatorOrLabel, { exact: isExact })
        break;
      case 'placeholder':
        loc = page.getByPlaceholder(input.locatorOrLabel, { exact: isExact })
        break;
      default:
        loc = page.locator(input.locatorOrLabel)
        break;
    }
    await loc.pressSequentially(input.inputValue)
  })
  return loc!
}
export async function fillInput(input: InputType, exactName?: 'exact'): Promise<LocatorType> {
  let loc: LocatorType
  let isExact = exactName === 'exact'
  await step(`Fill: ${input.inputValue} on input found by ${input.findElementBy}: ${input.locatorOrLabel}`, async () => {
    switch (input.findElementBy) {
      case 'label':
        loc = page.getByLabel(input.locatorOrLabel, { exact: isExact })
        break;
      case 'placeholder':
        loc = page.getByPlaceholder(input.locatorOrLabel, { exact: isExact })
        break;
      default:
        loc = page.locator(input.locatorOrLabel)
        break;
    }
    await loc.fill(input.inputValue)
  })
  return loc!
}
export async function fillInputByLabel(label: string, input: string, exactName: 'exact'): Promise<LocatorType> {
  let loc: LocatorType
  await step(`Fill: ${input} on input, found by label: ${label}`, async () => {
    loc = page.getByLabel(label, { exact: exactName === 'exact' })
    await loc.fill(input)
  })
  return loc!
}
export async function fillInputByPlaceholder(placeholder: string, input: string, exactName: 'exact'): Promise<LocatorType> {
  let loc: LocatorType
  await step(`Fill: ${input} on input, found by placeholder: ${placeholder}`, async () => {
    loc = page.getByPlaceholder(placeholder, { exact: exactName === 'exact' })
    await loc.fill(input)
  })
  return loc!
}
export async function fillInputByLocator(locator: string, input: string): Promise<LocatorType> {
  let loc: LocatorType
  await step(`Fill: ${input} on input, found by locator: ${locator}`, async () => {
    loc = page.locator(locator)
    await loc.fill(input)
  })
  return loc!
}
export async function getElementText(locator: string): Promise<string | null> {
  let text: string | null = null
  await step(`Get Text content of locator: ${locator}`, async () => {
    let loc = page.locator(locator)
    text = await loc.textContent()
  })
  return text
}
export async function getTableHeaders(onPopup?: 'On popup'): Promise<string[]> {
  let headers: string[] = []
  await step(`Fetching table headers ${onPopup ?? ''}`, async () => {
    if (onPopup) {
      headers = await page.locator('.modal').locator(tableHeaderSelector).allInnerTexts()
    } else {
      headers = await page.locator(tableHeaderSelector).allInnerTexts()
    }
  })
  return headers
}
export async function getTableRecords(onPopup?: 'On popup'): Promise<LocatorType[]> {
  let records: LocatorType[] = []
  await step(`Fetching table records ${onPopup ?? ''}`, async () => {
    if (onPopup) {
      records = await page.locator('.modal').locator('table').nth(0).locator(tableRecordsSelector).all()
    } else {
      records = await page.locator('table').nth(0).locator(tableRecordsSelector).all()
    }
  })
  return records
}
export async function getFilteredTableRecords(filterText: string): Promise<LocatorType[]> {
  let records: LocatorType[] = []
  await step('Fetching table records', async () => {
    records = await page.locator('table').nth(0).locator(tableRecordsSelector).filter({ hasText: filterText }).all()
  })
  return records
}
export async function getColumnValues(columnName: string): Promise<string[]> {
  let columnValues: string[] = []
  let columnIndex = (await getTableHeaders()).indexOf(columnName)
  await step('Fetching column values', async () => {
    let records = await getTableRecords()
    for await (const record of records) {
      let recordValues: string[] = await record.locator('td').allTextContents()
      try {
        let recordValue = recordValues.at(columnIndex)!
        columnValues.push(recordValue)
      } catch (error) {
        throw new Error(`Unable to find the column: ${columnName}`)
      }
    }
  })
  return columnValues
}
export async function getToastMessage(type: 'success' | 'error' | 'info'): Promise<ToastType> {
  let toastData: ToastType = { title: '', message: '' }
  await step(`Read toast error title and message`, async () => {
    let toastLoc = page.locator(`.toast-${type}`).first()
    toastData.title = await toastLoc.locator('.toast-title').textContent() ?? ""
    toastData.message = await toastLoc.locator('.toast-message').textContent() ?? ""
  })
  return toastData
}
export async function verify_PopupToBe(toBe: 'visible' | 'hidden') {
  await step(`Verify that popup to be ${toBe}`, async () => {
    toBe == 'visible' ?
      await expect(page.locator('.modal')).toBeVisible()
      : await expect(page.locator('.modal')).toBeHidden()
  })
}
export async function verify_URL(text: string) {
  await step(`Expecting URL to have text:${text}`, async () => {
    let url = page.url()
    expect(url).toContain(text)
  })
}
export async function verify_SelectorIsVisible(selector: string, elementName: string) {
  await step(`Verifying that ${elementName} with LocatorType: ${selector} is visible`, async () => {
    await expect(page.locator(selector), `Expected ${elementName} to be visible`).toBeVisible()
  })
}
export async function verify_SelectorIsHidden(selector: string, elementName: string) {
  await step(`Verifying that ${elementName} with LocatorType: ${selector} is visible`, async () => {
    await expect(page.locator(selector), `Expected ${elementName} to be hidden but is not`).toBeHidden()
  })
}
export async function verify_ButtonIsVisible(buttonName: string, exactName?: 'exact' | 'non-exact', onPopup?: 'onPopup') {
  await step(`Verifying that ${buttonName} button is visible`, async () => {
    if (onPopup === 'onPopup') {
      await expect(page.locator('.modal').getByRole('button', { name: buttonName, exact: exactName === 'exact' }).first(), `Expected ${buttonName} to be visible on popup`).toBeVisible()
    } else {
      await expect(page.getByRole('button', { name: buttonName, exact: exactName === 'exact' }), `Expected ${buttonName} to be visible`).toBeVisible()
    }
  })
}
export async function verify_ButtonIsHidden(buttonName: string, exactName?: 'exact' | 'non-exact', onPopup?: 'onPopup') {
  await step(`Verifying that ${buttonName} button is visible`, async () => {
    if (onPopup === 'onPopup') {
      await expect(page.locator('.modal').getByRole('button', { name: buttonName, exact: exactName === 'exact' }).first(), `Expected ${buttonName} not to be visible on popup`).toBeHidden()
    } else {
      await expect(page.getByRole('button', { name: buttonName, exact: exactName === 'exact' }), `Expected ${buttonName} not to be visible`).toBeHidden()
    }
  })
}
export async function verify_InputIsVisible(placeholder: string) {
  await step(`Verifying that Input with placeholder: ${placeholder} is visible`, async () => {
    await expect(page.getByPlaceholder(placeholder), `Expected Input with placeholder: ${placeholder} to be visible but is not`).toBeVisible()
  })
}
export async function verify_TextIsVisible(hasText: string, exactName?: 'exact' | 'non-exact', onPopup?: 'onPopup') {
  await step(`Verifying if element with text:${hasText}`, async () => {
    let textIsVisible = false
    if (onPopup === 'onPopup') {
      textIsVisible = await page.locator('.modal').getByText(hasText, { exact: exactName === 'exact' }).isVisible()
    } else {
      textIsVisible = await page.getByText(hasText, { exact: exactName === 'exact' }).isVisible()
    }
    expect(textIsVisible).toBeTruthy()
  })
}
export async function verify_TextIsHidden(hasText: string, exactName?: 'exact' | 'non-exact', onPopup?: 'onPopup') {
  await step(`Verifying if element with text:${hasText} should not be visible`, async () => {
    let textIsHidden = false
    if (onPopup === 'onPopup') {
      textIsHidden = await page.locator('.modal').getByText(hasText, { exact: exactName === 'exact' }).isHidden()
    } else {
      textIsHidden = await page.getByText(hasText, { exact: exactName === 'exact' }).isHidden()
    }
    expect(textIsHidden).toBeTruthy()
  })
}
export async function verify_LinkIsVisible(hasText: string, exactName?: 'exact' | 'non-exact', onPopup?: 'onPopup') {
  await step(`Verifying if element with Link:${hasText}`, async () => {
    let textIsVisible = false
    if (onPopup === 'onPopup') {
      textIsVisible = await page.locator('.modal').getByRole('link', { exact: exactName === 'exact', name: hasText }).isVisible()
    } else {
      textIsVisible = await page.getByRole('link', { exact: exactName === 'exact', name: hasText }).isVisible()
    }
    expect(textIsVisible).toBeTruthy()
  })
}
export async function verify_ElementHasText(locator: string, hasText: string): Promise<LocatorType> {
  let hasTextLocator = page.locator(`${locator}:has-text('${hasText}')`)
  await step(`Verifying if element with text:${hasText}`, async () => {
    await expect(hasTextLocator, `Expected element with ${hasText} to be visible but is not`).toBeVisible()
  })
  return hasTextLocator
}
export async function verify_ElementExists(locator: string, elementName: string) {
  await step(`Verifying that ${elementName} with LocatorType: ${locator} exists`, async () => {
    await expect(page.locator(locator), `Expected ${elementName} to exist in DOM`).toBeAttached()
  })
}
export async function verify_OptionIsSelected(locator: string, expectedValue: string, elementName: string) {
  await step(`Verifying that ${elementName} dropdown to have selected option: ${expectedValue}`, async () => {
    let actualValue = await page.locator(locator).inputValue()
    actualValue = await page.locator(`[value='${actualValue}']`).innerText()
    expect(actualValue, `Expected to have value: ${expectedValue} and found ${actualValue}`).toContain(expectedValue)
  })
}
export async function verify_DropdownHasLabels(locator: string, expectedValues: string[], elementName: string) {
  await step(`Verifying that ${elementName} dropdown to have expected values`, async () => {
    let options = await page.locator(locator + ">option").allTextContents()
    options = options.sort()
    expectedValues = expectedValues.sort()
    for (let index = 0; index < expectedValues.length; index++) {
      expect(options[index], `Expected to have value: ${expectedValues[index]} but found ${options[index]}`).toContain(expectedValues[index])
    }
  })
}
export async function verify_DropdownHasOptions(locator: string, elementName: string) {
  await step(`Verifying that ${elementName} dropdown to have options`, async () => {
    let options = await page.locator(locator + ">option").all()
    expect(options.length, `Expected to have options on dropdown: ${elementName}`).toBeGreaterThanOrEqual(2)
  })
}
export async function verify_RecordsExist() {
  await step('Verify that records should exist', async () => {
    const records = await getTableRecords()
    if (records.length == 1) {
      expect(await records[0].innerText(), `Expected Message: No records found, but found ${records.length} record`).not.toMatch(/Yes/) //No Rows/Records Found
    } else {
      expect(records.length, `Expected records to be found, but found none`).toBeGreaterThanOrEqual(1)
    }
  })
}
export async function waitForSeconds(timeoutInSeconds: number) {
  await step(`Waiting for ${timeoutInSeconds} seconds`, async () => {
    await page.waitForTimeout(timeoutInSeconds * 1000)
  })
}
export async function waitForSelector(selector: string, timeout?: number) {
  let element = page.locator(selector)
  await step(`Waiting for Selector: ${selector} to be visible`, async () => {
    await element.waitFor({ state: 'visible', timeout: timeout ?? 30000 })
  })
  return element
}
export async function waitForURL(url: string | RegExp, timeout?: number) {
  await step(`Waiting for url: ${url} to be visible`, async () => {
    await page.waitForURL(url, { timeout: timeout ?? 30000 })
  })
}
export async function waitForSuccessResponse(api: string, timeout?: number): Promise<ResponseType | undefined> {
  let response: ResponseType | undefined
  await step(`Waiting for success response: ${api}`, async () => {
    response = await page.waitForResponse(new RegExp(api), { timeout: timeout ?? 30000 })
    expect(response.status(), `Expected API: ${api} to be successful but found error: ${response.text}`).toBeLessThan(300)
  })
  return response
}
export async function postRequest(apiURL: string, APIName: string, APIData: Object, headers?: HeadersType) {
  await step(`Posting API request of API: ${APIName}`, async () => {
    const request = await page.request.post(apiURL, {
      data: APIData, headers: headers
    })
    expect(request.ok()).toBeTruthy()
  })
}