const puppeteer = require('puppeteer');

import { bootStrap, typeText, clickOnElement, typeSeedPhrase } from './functions.js';


describe('balance', () => {
    let browser;
    let page;
    let extensionRootUrl;

    beforeEach(async () => {
        /* Initialize browser and page using bootStrap */
        const context = await bootStrap({ headless: false, slowMo: 10 });
        browser = context.browser;
        extensionRootUrl = context.extensionRootUrl
        page = await browser.newPage();

        // Navigate to a specific URL if necessary
        await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load' });

        // Please note the following:
        // 1. I've added a waiting timeout in backgrounds.ts because it was not possible to predefine the storage before the app initializing process starts.
        // 2. Before that, we were trying to set the storage, but the controllers were already initialized, and their storage was empty.
        await page.evaluate(() => {
            let parsedKeystoreAccounts, parsedKeystoreUID, parsedKeystoreKeys, parsedKeystoreSecrets, envOnboardingStatus, envPermission, envSelectedAccount, envTermState, parsedPreviousHints;
            parsedKeystoreAccounts = JSON.parse(process.env.KEYSTORE_ACCOUNTS)
            parsedKeystoreUID = (process.env.KEYSTORE_KEYSTORE_UID)
            parsedKeystoreKeys = JSON.parse(process.env.KEYSTORE_KEYS)
            parsedKeystoreSecrets = JSON.parse(process.env.KEYSTORE_SECRETS)
            envOnboardingStatus = (process.env.KEYSTORE_ONBOARDING_STATUS)
            envPermission = (process.env.KEYSTORE_PERMISSION)
            envSelectedAccount = (process.env.KEYSTORE_SELECTED_ACCOUNT)
            envTermState = (process.env.KEYSTORE_TERMSTATE)
            parsedPreviousHints = (process.env.KEYSTORE_PREVIOUSHINTS)
            chrome.storage.local.set({
                accounts: parsedKeystoreAccounts,
                keyStoreUid: parsedKeystoreUID,
                keystoreKeys: parsedKeystoreKeys,
                keystoreSecrets: parsedKeystoreSecrets,
                onboardingStatus: envOnboardingStatus,
                permission: envPermission,
                selectedAccount: envSelectedAccount,
                termsState: envTermState,
                previousHints: parsedPreviousHints
            });
        })

        // Please note the following:
        // 1. Every time beforeEach is invoked, we are loading a specific page, i.e., await page.goto(${extensionRootUrl}/tab.html#/keystore-unlock, { waitUntil: 'load' }).
        // 2. But at the same time, the extension onboarding page is also shown automatically.
        // 3. During these page transitions (new tabs being opened), we should wait a bit and avoid switching between or closing tabs because the extension background process is being initialized, and it will only initialize if the current tab is visible.
        // If it's not visible (when we are transitioning), the initialization fails.
        // Later, we will check how we can deal with this better.
        await new Promise((r) => {
            setTimeout(r, 1000)
        })

        // Please note that:
        // 1. We are no longer closing any tabs.
        // 2. Instead, we simply switch back to our tab under testing.
        await page.bringToFront();
        await page.reload();

        await typeSeedPhrase(page, process.env.KEYSTORE_PASS_PHRASE)
    })

    afterEach(async () => {
        await browser.close();
    });

    //--------------------------------------------------------------------------------------------------------------
    it('check if networks Ethereum, USDC and Polygon exist in the account  ', (async () => {

        await page.waitForSelector('[data-testid="full-balance"]')

        await new Promise((r) => setTimeout(r, 2000))

        /* Verify that USDC, ETH, WALLET */
        const text = await page.$eval('*', el => el.innerText);

        expect(text).toMatch(/\bUSDC\b/);
        console.log('USDC exists on the page');

        expect(text).toMatch(/\bETH\b/);
        console.log('ETH exists on the page');

        expect(text).toMatch(/\bWALLET\b/);
        console.log('WALLET exists on the page');
    }));

    //--------------------------------------------------------------------------------------------------------------
    it('check if item exist in Collectibles tab', (async () => {

        /* Click on "Collectibles" button */
        await clickOnElement(page, '[data-testid="tab-nfts"]')
        await new Promise((r) => setTimeout(r, 1000))

        const collectionItem = '[data-testid="collection-item"]';
        await page.waitForSelector(collectionItem)

        /* Get the text content of the first item */
        let firstCollectiblesItem = await page.$$eval(collectionItem, element => {
            return element[0].textContent
        });


        const colectiblPicture = '[data-testid="collectible-picture"]'
        /* Click on the first item */
        await page.waitForSelector(colectiblPicture, { visible: true });
        const element = await page.$(colectiblPicture);
        await element.click();


        /* Get the text of the modal and verify that the name of the first collectible item is included*/
        const modalText = await page.$eval('[data-testid="rows"]', el => {
            return el.textContent
        });

        expect(modalText).toContain(firstCollectiblesItem);

    }));
})


