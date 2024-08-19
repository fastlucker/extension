import { clickOnElement } from './clickOnElement'

export async function selectMaticToken(page) {
  await clickOnElement(page, '[data-testid="tokens-select"]')
  await clickOnElement(
    page,
    '[data-testid="option-0x0000000000000000000000000000000000000000.polygon.matic.false."]'
  )
}
