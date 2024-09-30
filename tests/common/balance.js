import { clickOnElement } from '../common-helpers/clickOnElement'
import { SELECTORS } from './selectors/selectors'

//--------------------------------------------------------------------------------------------------------------
export async function checkBalanceInAccount(page) {
  await page.waitForFunction(() => window.location.href.includes('/dashboard'))
  await page.waitForSelector(SELECTORS.fullBalance)

  // Get the available balance
  const availableAmount = await page.evaluate((selector) => {
    const balance = document.querySelector(selector)
    return balance.innerText
  }, SELECTORS.fullBalance)

  let availableAmountNum = availableAmount.replace(/\n/g, '')
  availableAmountNum = availableAmountNum.split('$')[1]

  // Verify that the balance is bigger than 0
  expect(parseFloat(availableAmountNum)).toBeGreaterThan(0)
}

//--------------------------------------------------------------------------------------------------------------
export async function checkNetworks(page) {
  await page.waitForFunction(() => window.location.href.includes('/dashboard'))
  await page.waitForSelector(SELECTORS.fullBalance)

  // Verify that USDC, ETH, WALLET
  const text = await page.$eval('*', (el) => el.innerText)

  expect(text).toMatch(/\bUSDC\b/)
  expect(text).toMatch(/\bETH\b/)
  expect(text).toMatch(/\bWALLET\b/)
}

//--------------------------------------------------------------------------------------------------------------
export async function checkCollectibleItem(page) {
  await page.waitForFunction(() => window.location.href.includes('/dashboard'))
  // Click on "Collectibles" button
  await clickOnElement(page, '[data-testid="tab-nft"]')
  await page.waitForSelector('[data-testid="collection-item"]')

  // Get the text content of the first item
  const firstCollectiblesItem = await page.$$eval(
    '[data-testid="collection-item"]',
    (element) => element[0].textContent
  )

  // Click on the first item
  await page.waitForSelector('[data-testid="collectible-picture"]', {
    visible: true
  })
  const collectiblePicture = await page.$('[data-testid="collectible-picture"]')
  await collectiblePicture.click()

  // Get the text of the modal and verify that the name of the first collectible item is included
  const modalText = await page.$eval('[data-testid="collectible-row"]', (el) => el.textContent)

  expect(modalText).toContain(firstCollectiblesItem)
}
