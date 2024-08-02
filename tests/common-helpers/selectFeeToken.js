import { clickOnElement } from './clickOnElement'

export async function selectFeeToken(actionWindowPage, feeToken) {
  // Click on the tokens select
  await clickOnElement(actionWindowPage, '[data-testid="tokens-select"]')

  // Select fee token
  await clickOnElement(actionWindowPage, feeToken)
}
