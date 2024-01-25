const puppeteer = require('puppeteer');


let puppeteerArgs = [
    `--disable-extensions-except=${__dirname}/../webkit-prod/`,
    `--load-extension=${__dirname}/webkit-prod/`,
    '--disable-features=DialMediaRouteProvider',
    
    // '--disable-features=ClipboardContentSetting',
    // '--clipboard-write: granted', 
    // '--clipboard-read: prompt',  

    // '--detectOpenHandles',
    // '--start-maximized'
];


export async function bootStrap(options = {}) {
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
export async function setAmbKeyStoreForLegacy(page) {
    try {
        await new Promise((r) => setTimeout(r, 1000));
        const importLegacyAccoutButton = '[data-testid="Import Legacy Account"]'

        let attempts = 0;
        let element = null;

        while (attempts < 5) {
            element = await page.$(importLegacyAccoutButton)
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

        /* Select Tab 'Import Legacy Account' */
        await clickOnElement(page, importLegacyAccoutButton)

        await page.waitForXPath('//div[contains(text(), "Terms Of Service")]');

        /* Check the checkbox "I agree...". */
        await clickOnElement(page, '[data-testid="checkbox"]')

        /* Click on "Continue" button */
        await clickOnElement(page, '[data-testid="button"]')

        /* type phrase */
        const phrase = 'Password'
        await typeText(page, '[data-testid="enter-pass-field"]', phrase)
        await typeText(page, '[data-testid="repeat-pass-field"]', phrase)

        /* Click on "Set up Ambire Key Store" button */
        await clickOnElement(page, '[data-testid="button"]')

        const modalSelector = '[aria-modal="true"]'; // Selector for the modal
        const buttonSelector = `${modalSelector} [data-testid="button"]`;

        await page.waitForSelector(modalSelector); // Wait for the modal to appear
        await page.waitForSelector(buttonSelector); // Wait for the button inside the modal
        await page.click(buttonSelector);

        await page.waitForXPath('//div[contains(text(), "Import Legacy Account")]');
    } catch (error) {
        throw new Error(' Failed when try to set Ambire key store for legacy account ')
    }
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
export async function clickWhenClickable(page, selector) {

    let isClickable = false;
    // Check every 500ms if the button is clickable for up to 4 seconds
    for (let i = 0; i < 8; i++) {
        isClickable = await page.evaluate(selector => {
            const element = document.querySelector(selector);
            return element && !element.disabled;
        }, selector);
        if (isClickable) break;
        await page.waitForTimeout(500); // Wait for 500ms before checking again
    }
    if (isClickable) {
        await page.click(selector);
    }
    else {
        throw new Error(`Element ${selector} is not clickable`);
    }
}
//----------------------------------------------------------------------------------------------
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
        await newPage.$$eval('[data-testid="button"]', (buttons) => {
            const button = buttons.find(btn => btn.textContent.includes("Sign"))
            button.click();
        });

        /* Set up a promise to await on the new page being created */
        const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));

        /* Perform the click that opens the new window or tab */
        await newPage.$$eval('[data-testid="button"]', (buttons) => {
            const button = buttons.find(btn => btn.textContent.includes("Sign"))
            button.click();
        });
        /* Wait for the new page to be created */
        const newPage2 = await newPagePromise;
        const two = await newPage2.waitForFunction(() => {
            const pageText = document.documentElement.innerText;
            const occurrences = (pageText.match(/Timestamp/g) || []).length;
            return occurrences >= 2;
        }, {})

        const doesFailedExist = await newPage2.evaluate(() => {
            return document.documentElement.innerText.includes('Failed');
        });

        await new Promise((r) => setTimeout(r, 300))
        expect(doesFailedExist).toBe(false); // This will fail the test if 'Failed' exists

    } catch (error) {
        throw new Error(`Can not sign the transaction`)
    }
}
//----------------------------------------------------------------------------------------------
export async function generateEthereumPrivateKey() {
    try {
        let key = '0x';
        const characters = '0123456789abcdef';
        for (let i = 0; i < 64; i++) {
            key += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return key;
    } catch (error) {
        throw new Error(`Can't generate ethereum private key`)
    }
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
    await clickOnElement(page, '[data-testid="button"]')
}
