const puppeteer = require('puppeteer');


const puppeteerArgs = [
    `--disable-extensions-except=${__dirname}/../webkit-prod/`,
    `--load-extension=${__dirname}/webkit-prod/`,
    '--disable-features=DialMediaRouteProvider',

    // '--disable-features=ClipboardContentSetting',
    '--clipboard-write: granted',
    '--clipboard-read: prompt',

    // '--detectOpenHandles',
    // '--start-maximized'
];


export async function bootstrap(options = {}) {
    const { devtools = false, slowMo = 10, headless = false } = options;

    let browser = await puppeteer.launch({
        headless: headless,
        devtools: devtools,
        args: puppeteerArgs,
        defaultViewport: null,
        slowMo: slowMo,
    });


    // Extract the extension ID from the browser targets
    const targets = await browser.targets();
    const extensionTarget = targets.find(target => target.url().includes('chrome-extension'));
    const partialExtensionUrl = extensionTarget.url() || '';
    const [, , extractedExtensionId] = partialExtensionUrl.split('/');
    extensionId = extractedExtensionId;
    extensionRootUrl = `chrome-extension://${extensionId}`;


    return {
        browser,
        page,
        extensionRootUrl,
        extensionId,
        extensionTarget
    };
}
//----------------------------------------------------------------------------------------------
export async function setAmbKeyStoreForLegacy(page, privKeyOrPhraseSelector) {
    await new Promise((r) => setTimeout(r, 1000));
    
    const buttonNext = '[data-testid="stories-button-next"]'

    let attempts = 0;
    let element = null;

    while (attempts < 5) {
        element = await page.$(buttonNext)
        if (element) {
            break;
        } else {
            console.log(`Element not found. Reloading page (Attempt ${attempts + 1}/5)...`);
            await new Promise((r) => setTimeout(r, 1000));

            await page.reload();
            attempts++;
        }
    }
    if (!element) {
        console.log('Welcome to Ambire screen not displayed after 5 attempts.');
    }

    /* Click on "Next" button several times to finish the onboarding */
    await page.$eval(buttonNext, button => button.click());

    await page.waitForSelector('[data-testid="stories-button-previous"]')

    await page.$eval(buttonNext, button => button.click());
    await page.$eval(buttonNext, button => button.click());
    await page.$eval(buttonNext, button => button.click());
    await page.$eval(buttonNext, button => button.click());

    /* check the checkbox "I agree ..."*/
    await page.$eval('[data-testid="checkbox"]', button => button.click());
    /* Click on "Got it" */
    await page.$eval(buttonNext, button => button.click());

    await page.waitForXPath('//div[contains(text(), "Welcome to your Ambire Wallet")]');

    /*Click on "Import" button */
    await page.$eval('[data-testid="button-Import"]', button => button.click());

    await page.waitForFunction(() => {
        return window.location.href.includes('/import-hot-wallet');
    }, { timeout: 60000 });

    /* Click on "Import" private key*/
    await page.$eval(privKeyOrPhraseSelector, button => button.click());
    
    /* type phrase */
    const phrase = 'Password'
    await typeText(page, '[data-testid="enter-pass-field"]', phrase)
    await typeText(page, '[data-testid="repeat-pass-field"]', phrase)

    /* Click on "Set up Ambire Key Store" button */
    await clickOnElement(page, '[data-testid="padding-button-Create"]')

    await page.waitForSelector('[data-testid="padding-button-Continue"]');

    await page.$eval('[data-testid="padding-button-Continue"]', button => button.click());

}

//----------------------------------------------------------------------------------------------
export async function finishStoriesAndSelectAccount(page) {
    /* Click on Import button. */
    await clickOnElement(page, '[data-testid="padding-button-Import"]')
    
    await new Promise((r) => setTimeout(r, 2000))
    await clickOnElement(page, 'xpath///a[contains(text(), "Next")]')

    await new Promise((r) => setTimeout(r, 2000))
    await clickOnElement(page, 'xpath///a[contains(text(), "Got it")]')
    /* Select one Legacy and one Smart account and keep the addresses of the accounts */
    await page.waitForSelector('[data-testid="checkbox"]')

    /* Select one Legacy account and one Smart account */
    firstSelectedBasicAccount = await page.$$eval('[data-testid="add-account"]', element => {
        element[0].click()
        return element[0].textContent
    });
    firstSelectedSmartAccount = await page.$$eval('[data-testid="add-account"]', element => {
        element[1].click()
        return element[1].textContent
    });

    /* Click on Import Accounts button*/
    await clickOnElement(page, '[data-testid="padding-button-Import-Accounts"]');

    return {
        firstSelectedBasicAccount,
        firstSelectedSmartAccount
    };
}



//----------------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------------
export async function clickOnElement(page, selector) {
    try {
        let elementToClick = await page.waitForSelector(selector);
        await elementToClick.click();
    } catch (error) {
        throw new Error(`Could not click on selector: ${selector}`)
    }
}

//----------------------------------------------------------------------------------------------
export async function confirmTransaction(page, extensionRootUrl, browser, triggerTransactionSelector) {
    let elementToClick = await page.waitForSelector(triggerTransactionSelector);
    await elementToClick.click();

    await new Promise((r) => setTimeout(r, 1000));

    // Wait for the new page to be created
    const newTarget = await browser.waitForTarget(target => target.url() === `${extensionRootUrl}/notification.html#/sign-account-op`);
    const newPage = await newTarget.page();

    /* Click on "Medium" button */
    await clickOnElement(newPage, 'xpath///div[contains(text(), "Medium:")]')

    /* Click on "Sign" button */
    await clickOnElement(newPage, '[data-testid="padding-button-Sign"]')

    // Wait for the 'Timestamp' text to appear twice on the page
    await newPage.waitForFunction(() => {
        const pageText = document.documentElement.innerText;
        const occurrences = (pageText.match(/Timestamp/g) || []).length;
        return occurrences >= 2;
    });

    const doesFailedExist = await newPage.evaluate(() => {
        return document.documentElement.innerText.includes('Failed');
    });

    await new Promise((r) => setTimeout(r, 300));

    expect(doesFailedExist).toBe(false); // This will fail the test if 'Failed' exists
}

//----------------------------------------------------------------------------------------------
export async function typeSeedPhrase(page, seedPhrase) {
    await new Promise((r) => setTimeout(r, 2000));

    /* This loop check if Passphrase field exist on the page if not the page will be reloaded */
    let attempts = 0;
    let element = null;

    while (attempts < 5) {
        element = await page.$('[data-testid="passphrase-field"]');
        if (element) {
            break;
        } else {
            console.log(`Element not found. Reloading page (Attempt ${attempts + 1}/5)...`);
            await new Promise((r) => setTimeout(r, 1000));

            await page.reload();
            attempts++;
        }
    }
    if (!element) {
        console.log('Passphrase field not found after 5 attempts.');
    }
    /*Type keystore password */
    await typeText(page, '[data-testid="passphrase-field"]', seedPhrase)
    /* Click on "Unlock button" */
    await clickOnElement(page, '[data-testid="padding-button-Unlock"]')
}
