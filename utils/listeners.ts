
import { expect, page } from "@utils/fixtures";
export async function testListeners() {
  let severeErrors: number[] = [500, 501, 502, 503, 584]
  page.on('console', message => {
    console.log(`Message: ${message.type().toUpperCase()}: ${message.text()}`);
  });
  page.on('pageerror', error => {
    console.log(`Error: ${error.message}`)
  });
  page.on('response', async response => {
    const contentType = response.headers()['content-type'] || ''
    if (contentType.includes('application/json')) {
      let api: string = response.url()
      if (severeErrors.includes(response.status())) {
        //* Adding hard assertion for immediate failure on 500 series response errors
        console.log(api)
        expect(
          severeErrors.includes(response.status()), `Server Error on API: ${api} with message: ${await response.body()}`
        ).toBeFalsy();
      }
      if (response.status() >= 400) {
        //* Adding soft assertion failures on 400 response
        console.log(api)
        expect.soft(
          response.status() >= 400, `Client Error on API: $(api) with message: ${await response.body()}`
        ).toBeFalsy();
      }
    }
  })
}
