const puppeteer = require('puppeteer');
const path = require('path')


let puppeteerArgs = [
    `--disable-extensions-except=${__dirname}/../webkit-prod/`,
    `--load-extension=${__dirname}/webkit-prod/`,
    '--disable-features=DialMediaRouteProvider',
    // '--disable-features=ClipboardContentSetting',
    // '--clipboard-write: granted', 
    // '--clipboard-read: prompt',  

    // ' --runInBand'    
    // '--enable-automation'
    // '--detectOpenHandles',
    // '--start-maximized'
];

export async function bootStrap(page, browser, options = {}) {
    const { devtools = false, slowMo = 10 } = options

    browser = await puppeteer.launch({
        headless: false,
        devtools,
        args: puppeteerArgs,
        defaultViewport: null,
        slowMo: options.slowMo,
    })
    const targets = await browser.targets()

    await new Promise((r) => setTimeout(r, 500))

    const extensionTarget = targets.find((target) => {
        return target.url().includes('chrome-extension')
    })
    const partialExtensionUrl = extensionTarget.url() || ''
    const [, , extensionId] = partialExtensionUrl.split('/')

    return {
        browser,
        page,
        // pages,
        extensionRootUrl: `chrome-extension://${extensionId}`,
        extensionId,
        targets,
        options
    }
}

export async function setAmbKeyStoreForLegacy(page) {
    try {
        await page.waitForXPath('//*[contains(text(), "Welcome to Ambire")]')

        /* Select Tab 'Import Legacy Account' */
        await clickOnElement(page, '[data-testid="Import Legacy Account"]')

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

        // await typeText(page, '[placeholder="Enter Passphrase"]', phrase  )

        await page.waitForSelector('[placeholder="Repeat Passphrase"]');
        const repeatPhrase = await page.$('[placeholder="Repeat Passphrase"]');
        await repeatPhrase.type(phrase);

        const setupAmbireKeyStoreButton = await page.waitForSelector('xpath///div[contains(text(), "Set up Ambire Key Store")]');
        await setupAmbireKeyStoreButton.click();

        const continueToAccountButton = await page.waitForSelector('xpath///div[contains(text(), "Continue")]');
        await continueToAccountButton.click();

        await page.waitForXPath('//div[contains(text(), "Import Legacy Account")]');
    } catch (error) {
        throw new Error(' Failed when try to set Ambire key store for legacy account ')
    }
}


export async function typeText(page, selector, text) {
    try {
        await page.waitForSelector(selector);
        let whereToType = await page.$(selector);
        await whereToType.click({ clickCount: 3 });
        await whereToType.press('Backspace');
        await whereToType.type(text, { delay: 10 });
    } catch (error) {
        throw new Error(`Could not type text: ${text} 
        in the selector: ${selector}`)
    }
}


export async function clickOnElement(page, selector) {
    try {
        let elementToClick = await page.waitForSelector(selector);
        await elementToClick.click();
    } catch (error) {
        throw new Error(`Could not click on selector: ${selector}`)
    }
}

export async function confirmTransaction(page, extensionRootUrl, browser, triggerTransactionSelector) {
    try {
        let elementToClick = await page.waitForSelector(triggerTransactionSelector);
        await elementToClick.click();

        await new Promise((r) => setTimeout(r, 1000))

        // Wait for the new window to be created and switch to it 
        const newTarget = await browser.waitForTarget(target => target.url() === `${extensionRootUrl}/notification.html#/sign-account-op`);
        const newPage = await newTarget.page();

        /* Click on "Medium" button */
        await clickOnElement(newPage, 'xpath///div[contains(text(), "Medium:")]')

        /* Click on "Sign" button */
        await clickOnElement(newPage, 'xpath///div[contains(text(), "Sign")]')

        await page.goto(`${extensionRootUrl}/tab.html#/dashboard`, { waitUntil: 'load', })
        await new Promise((r) => setTimeout(r, 500))

        /* Verify that the transaction is signed and sent */
        const targetText = 'Transaction successfully signed and sent!';
        // Wait until the specified text appears on the page
        await page.waitForFunction((text) => {
            const element = document.querySelector('body');
            return element && element.textContent.includes(text);
        }, {}, targetText);
    } catch (error) {
        throw new Error(`Could not click on selector: ${selector}`)
    }

}