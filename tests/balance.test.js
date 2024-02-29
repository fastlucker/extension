const puppeteer = require('puppeteer');

import { bootStrap, typeText, clickOnElement, typeSeedPhrase } from './functions.js';


describe('balance', () => {
    let browser;
    let page;
    let extensionRootUrl;
    let extensionId;
    let parsedKeystoreAccounts, parsedKeystoreUID, parsedKeystoreKeys, parsedKeystoreSecrets, envOnboardingStatus, envPermission, envSelectedAccount, envTermState, parsedPreviousHints;

    beforeEach(async () => {
        /* Initialize browser and page using bootStrap */
        const context = await bootStrap({ headless: false, slowMo: 10 });
        browser = context.browser;
        page = context.page;
        extensionRootUrl = context.extensionRootUrl
        extensionId = context.extensionId
        extensionTarget = context.extensionTarget

        page = (await browser.pages())[0];
        let createVaultUrl = `chrome-extension://${extensionId}/tab.html#/keystore-unlock`
        await page.goto(createVaultUrl, { waitUntil: 'load' })

        parsedKeystoreAccounts = JSON.parse(process.env.KEYSTORE_ACCOUNTS)
        parsedKeystoreUID = (process.env.KEYSTORE_KEYSTORE_UID)
        parsedKeystoreKeys = JSON.parse(process.env.KEYSTORE_KEYS)
        parsedKeystoreSecrets = JSON.parse(process.env.KEYSTORE_SECRETS)
        envOnboardingStatus = (process.env.KEYSTORE_ONBOARDING_STATUS)
        envPermission = (process.env.KEYSTORE_PERMISSION)
        envSelectedAccount = (process.env.KEYSTORE_SELECTED_ACCOUNT)
        envTermState = (process.env.KEYSTORE_TERMSTATE)
        parsedPreviousHints = (process.env.KEYSTORE_PREVIOUSHINTS)

        const executionContext = await page.mainFrame().executionContext()
        const backgroundPage = await extensionTarget.page(); // Access the background page

        /*  interact with chrome.storage.local in the context of the extension's background page */
        await backgroundPage.evaluate(
            (
                parsedKeystoreAccounts,
                parsedKeystoreUID,
                parsedKeystoreKeys,
                parsedKeystoreSecrets,
                envOnboardingStatus,
                envPermission,
                envSelectedAccount,
                envTermState,
                parsedPreviousHints
            ) => {
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
            },
            parsedKeystoreAccounts,
            parsedKeystoreUID,
            parsedKeystoreKeys,
            parsedKeystoreSecrets,
            envOnboardingStatus,
            envPermission,
            envSelectedAccount,
            envTermState,
            parsedPreviousHints
        );


        await new Promise((r) => setTimeout(r, 2000));

        let pages = await browser.pages()
        pages[0].close() // blank tab
        pages[1].close() // tab always opened after extension installation

        await new Promise((r) => setTimeout(r, 2000));

        /*Open the page again to load the browser local storage */
        page = await browser.newPage();


        // Navigate to a specific URL if necessary
        await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load' });
        await new Promise((r) => setTimeout(r, 2000));

        pages = await browser.pages()
        // pages[0].close()
        pages[1].close()

        await page.evaluate(() => {
            location.reload(true)
        })
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


        const colectiblPicture = '[data-testid="colectible-picture"]'
        /* Click on the first item */
        await page.waitForSelector(colectiblPicture, { visible: true });
        const element = await page.$(colectiblPicture);
        await element.click();


        /* Get the text of the modal and verify that the name of the first collectible item is included*/
        const modalText = await page.$eval('[aria-modal="true"]', el => {
            return el.textContent
        });

        expect(modalText).toContain(firstCollectiblesItem);

    }));
})


