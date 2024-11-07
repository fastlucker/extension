import { clickOnElement } from '../../common-helpers/clickOnElement'
import { SELECTORS } from '../../common/selectors/selectors'
import { TOKEN_SYMBOLS } from './constants'

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

export async function checkIfTokensExist(page) {
  await page.waitForFunction(() => window.location.href.includes('/dashboard'))
  await page.waitForSelector(SELECTORS.fullBalance)

  const innerTextOfTheWholePage = await page.$eval('*', (el) => el.innerText)

  TOKEN_SYMBOLS.forEach((symbol) => {
    expect(innerTextOfTheWholePage).toMatch(new RegExp(`\\b${symbol}\\b`))
  })
}

export async function checkCollectibleItem(page) {
  await page.waitForFunction(() => window.location.href.includes('/dashboard'))
  // Click on "Collectibles" button
  await clickOnElement(page, SELECTORS.tabNft)
  await page.waitForSelector(SELECTORS.collectionItem)

  // Get the text content of the first item
  const firstCollectiblesItem = await page.$$eval(
    SELECTORS.collectionItem,
    (element) => element[0].textContent
  )

  // Click on the first item
  await page.waitForSelector(SELECTORS.collectiblePicture, {
    visible: true
  })
  const collectiblePicture = await page.$(SELECTORS.collectiblePicture)
  await collectiblePicture.click()

  // Get the text of the modal and verify that the name of the first collectible item is included
  const modalText = await page.$eval(SELECTORS.collectibleRow, (el) => el.textContent)

  expect(modalText).toContain(firstCollectiblesItem)
}
