const puppeteer = require('puppeteer');
const path = require('path')


let puppeteerArgs = [
    `--disable-extensions-except=${__dirname}/../webkit-prod/`,
    `--load-extension=${__dirname}/webkit-prod/`,
    '--disable-features=DialMediaRouteProvider',
    // ' --runInBand'    
    // '--enable-automation'
    // '--detectOpenHandles',
    // '--start-maximized'
];

export async function bootStrap(page, browser, options= {}) {
    const { devtools = false, slowMo = 10 } = options

     browser = await puppeteer.launch({
        headless: false,
        devtools,
        args: puppeteerArgs,
        defaultViewport: null,
        ...(slowMo && { slowMo })
    })


    const targets = await browser.targets()

    await new Promise((r) => setTimeout(r, 500))

    const extensionTarget = targets.find((target) => {
        return target.url().includes('chrome-extension')
    })
    const partialExtensionUrl = extensionTarget.url() || ''
    const [, , extensionId] = partialExtensionUrl.split('/')

 
    // const page = (await browser.pages())[0];

    // const createVaultUrl = `chrome-extension://${extensionId}/tab.html#/get-started`
    // await page.goto(createVaultUrl, { waitUntil: 'load' })


    // const pages = await browser.pages()
    // // pages[0].close() // blank tab
    // pages[1].close() // tab always opened after extension installation
    // // pages[2].close() // tab always opened after extension installation

    return {
        browser,
        page,
        // pages,
        extensionRootUrl: `chrome-extension://${extensionId}`,
        extensionId,
        targets
    }
}

export async function setAmbKeyStoreForLegacy(page) {

    await page.waitForXPath('//*[contains(text(), "Welcome to Ambire")]')

    /* Check the checkbox "I agree...".  */
    const importLegacyButton = await page.waitForSelector('xpath///div[contains(text(), "Import Legacy Account")]');
    await importLegacyButton.click();

    await page.waitForXPath('//div[contains(text(), "Terms Of Service")]');

    /* Check the checkbox "I agree...". */
    const iAgreeCheckbox = await page.waitForSelector('xpath///div[contains(text(), "I agree to the Terms of Service and Privacy Policy.")]');
    await iAgreeCheckbox.click();
    /* Click on "Continue" button */
    const ContinueButton = await page.waitForSelector('xpath///div[contains(text(), "Continue")]');
    await ContinueButton.click();

    //type message 
    const phrase = 'Password'
    await page.waitForSelector('[placeholder="Enter Passphrase"]');
    const phraseField = await page.$('[placeholder="Enter Passphrase"]');
    await phraseField.type(phrase);


    await page.waitForSelector('[placeholder="Repeat Passphrase"]');
    const repeatPhrase = await page.$('[placeholder="Repeat Passphrase"]');
    await repeatPhrase.type(phrase);

    const setupAmbireKeyStoreButton = await page.waitForSelector('xpath///div[contains(text(), "Setup Ambire Key Store")]');
    await setupAmbireKeyStoreButton.click();

    const continueToAccountButton = await page.waitForSelector('xpath///div[contains(text(), "Continue")]');
    await continueToAccountButton.click();

    await page.waitForXPath('//div[contains(text(), "Import Legacy Account")]');
}

