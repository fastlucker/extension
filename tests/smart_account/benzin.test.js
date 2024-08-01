const puppeteer = require('puppeteer')

describe.skip('Standalone Benzin tests', () => {
  let browser
  let page
  let transactionID
  let networkID

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      defaultViewport: null
    })

    page = await browser.newPage()
  })

  afterAll(async () => {
    // await browser.close()
  })

  it('Check visible elements in valid transfer. Send MATIC on Polygon', async () => {
    transactionID = '0x6c906981d2b0cf8fd200ecee54f1c8e6aceda720281c6c5865c5b88447122386'
    networkID = 'polygon'

    await page.goto(`http://localhost:19006/?networkId=${networkID}&txnId=${transactionID}`, {
      waitUntil: 'networkidle0'
    })
    // Array of strings that are in  step "Signed"
    const stringsInSignedStep = [
      'Signed',
      'Timestamp',
      'Jun 18, 2024, 1:15 PM',
      'Transaction fee',
      '0.00073 MATIC ($0.00037)',
      'Sender',
      '0x339d346173Af02df312ab0a6fD6520DE0E101Ac0',
      'Transaction ID',
      transactionID
    ]
    // Array of strings that are in step "Transaction Details"
    const stringsInProgressStep = [
      'Transaction Details',
      'Send',
      '0.00010',
      'MATIC',
      'to',
      '0x66fE93c51726e6FD51668B0B0434ffcedD604d08'
    ]
    // Array of strings that are in step "Finalized Rows"
    const stringsInFinalizedRows = [
      'Timestamp',
      'Jun 18, 2024, 1:15 PM',
      'Block number',
      '58306576'
    ]
    // This function checks if an array of strings exists within an element
    async function checkStringsInElement(page, selector, strings) {
      return await page.evaluate(
        (selector, strings) => {
          const element = document.querySelector(selector)
          if (element) {
            const elementText = element.innerText
            return strings.every((str) => elementText.includes(str))
          }
          return false
        },
        selector,
        strings
      )
    }
    // Wait for the 'Timestamp' text to appear twice on the page
    await page.waitForFunction(
      () => {
        const pageText = document.documentElement.innerText
        const occurrences = (pageText.match(/Timestamp/g) || []).length
        return occurrences >= 2
      },
      { timeout: 250000 }
    )
    await page.waitForFunction('document.body.innerText.includes("Transaction Progress")')

    // Check if network name exist on the page
    const networkName = await page.$eval('[data-testid="network-name"]', (el) => el.textContent)
    expect(networkName.toLowerCase()).toContain(networkID.toLowerCase())

    // Check text in step "Signed"
    const foundInSignedStep = await checkStringsInElement(
      page,
      '[data-testid="signed-step"]',
      stringsInSignedStep
    )
    expect(foundInSignedStep).toBe(true)

    // Check text in step "Transaction Details"
    const foundInProgressStep = await checkStringsInElement(
      page,
      '[data-testid="txn-progress-step"]',
      stringsInProgressStep
    )
    expect(foundInProgressStep).toBe(true)

    // Check text in step "Confirmed"
    await page.waitForFunction('document.body.innerText.includes("Confirmed")')

    // Check text in finalized rows
    const foundInFinalizedRows = await checkStringsInElement(
      page,
      '[data-testid="finalized-rows"]',
      stringsInFinalizedRows
    )
    expect(foundInFinalizedRows).toBe(true)
  })

  //---------------------------------------------------------------------------------------------
  it('Check visible elements in valid batched transaction. Send MATIC and USDC on Polygon', async () => {
    transactionID = '0xde91488e02b9ab4a251439e3d73eee3fbebc3ba8542c90ee2a6f91fd98339e4f'
    networkID = 'polygon'

    await page.goto(`http://localhost:19006/?networkId=${networkID}&txnId=${transactionID}`, {
      waitUntil: 'networkidle0'
    })

    // Array of strings that are in  step "Signed"
    const stringsInSignedStep = [
      'Signed',
      'Timestamp',
      'Jul 19, 2024, 11:00 AM',
      'Transaction fee',
      '0.0030 MATIC ($0.0015)',
      'Sender',
      '0x6224438b995c2D49F696136B2cb3FcafB21bd1E7',
      'Originated from',
      '0x630fd7f359e483C28d2b0BabDE1a6F468a1d649e',
      'Transaction ID',
      transactionID
    ]
    // Array of strings that are in step "Transaction Details"
    const stringsInProgressStep = [
      'Transaction Details',
      'Send',
      '0.00010',
      'MATIC',
      'to',
      '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C',
      'Send',
      '0.00010',
      'USDC',
      'to',
      '0x630fd7f359e483C28d2b0BabDE1a6F468a1d649e'
    ]

    // Array of strings that are in step "Finalized Rows"
    const stringsInFinalizedRows = [
      'Timestamp',
      'Jul 19, 2024, 11:00 AM',
      'Block number',
      '59542785'
    ]
    // This function checks if an array of strings exists within an element
    async function checkStringsInElement(page, selector, strings) {
      return await page.evaluate(
        (selector, strings) => {
          const element = document.querySelector(selector)
          if (element) {
            const elementText = element.innerText
            return strings.every((str) => elementText.includes(str))
          }
          return false
        },
        selector,
        strings
      )
    }
    // Wait for the 'Timestamp' text to appear twice on the page
    await page.waitForFunction(
      () => {
        const pageText = document.documentElement.innerText
        const occurrences = (pageText.match(/Timestamp/g) || []).length
        return occurrences >= 2
      },
      { timeout: 250000 }
    )
    await page.waitForFunction('document.body.innerText.includes("Transaction Progress")')

    // Check if network name exist on the page
    const networkName = await page.$eval('[data-testid="network-name"]', (el) => el.textContent)
    expect(networkName.toLowerCase()).toContain(networkID.toLowerCase())

    // Check text in step "Signed"
    const foundInSignedStep = await checkStringsInElement(
      page,
      '[data-testid="signed-step"]',
      stringsInSignedStep
    )
    expect(foundInSignedStep).toBe(true)

    const textContent = await page.$eval(
      '[data-testid="txn-progress-step"]',
      (element) => element.textContent
    )
    console.log(textContent)

    // Check text in step "Transaction Details"
    const foundInProgressStep = await checkStringsInElement(
      page,
      '[data-testid="txn-progress-step"]',
      stringsInProgressStep
    )
    expect(foundInProgressStep).toBe(true)

    // Check text in step "Confirmed"
    await page.waitForFunction('document.body.innerText.includes("Confirmed")')

    // Check text in finalized rows
    const foundInFinalizedRows = await checkStringsInElement(
      page,
      '[data-testid="finalized-rows"]',
      stringsInFinalizedRows
    )
    expect(foundInFinalizedRows).toBe(true)
  })
})
