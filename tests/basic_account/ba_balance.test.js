import { bootstrapWithStorage, baParams, clickOnElement, typeText } from '../functions.js'

describe('ba_balance', () => {
  let browser
  let page
  let recorder
  let extensionRootUrl

  beforeEach(async () => {
    const context = await bootstrapWithStorage('ba_balance', baParams)

    browser = context.browser
    page = context.page
    recorder = context.recorder
    extensionRootUrl = context.extensionRootUrl
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  it('check the balance in account ', async () => {
    await page.waitForSelector('[data-testid="full-balance"]')

    await new Promise((r) => setTimeout(r, 1000))

    // Get the available balance
    const availableAmmount = await page.evaluate(() => {
      const balance = document.querySelector('[data-testid="full-balance"]')
      return balance.innerText
    })

    let availableAmmountNum = availableAmmount.replace(/\n/g, '')
    availableAmmountNum = availableAmmountNum.split('$')[1]

    // Verify that the balance is bigger than 0
    expect(parseFloat(availableAmmountNum)).toBeGreaterThan(0)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('check if networks Ethereum, USDC and Polygon exist in the account  ', async () => {
    await page.waitForSelector('[data-testid="full-balance"]')

    await new Promise((r) => setTimeout(r, 2000))

    // Verify that USDC, ETH, WALLET
    const text = await page.$eval('*', (el) => el.innerText)

    expect(text).toMatch(/\bUSDC\b/)

    expect(text).toMatch(/\bETH\b/)

    expect(text).toMatch(/\bWALLET\b/)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('check if item exist in Collectibles tab', async () => {
    // Click on "Collectibles" button
    await clickOnElement(page, '[data-testid="tab-nft"]')
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000))

    const collectionItem = '[data-testid="collection-item"]'
    await page.waitForSelector(collectionItem)

    // Get the text content of the first item
    const firstCollectiblesItem = await page.$$eval(collectionItem, (element) => {
      return element[0].textContent
    })

    const colectiblPicture = '[data-testid="collectible-picture"]'
    // Click on the first item
    await page.waitForSelector(colectiblPicture, { visible: true })
    const element = await page.$(colectiblPicture)
    await element.click()

    // Get the text of the modal and verify that the name of the first collectible item is included
    const modalText = await page.$eval('[data-testid="collectible-row"]', (el) => {
      return el.textContent
    })

    expect(modalText).toContain(firstCollectiblesItem)
  })
})
