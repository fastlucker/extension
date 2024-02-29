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

    it('check the balance in account ', (async () => {

        await page.waitForSelector('[data-testid="full-balance"]')
        /* Get the available balance */
        const availableAmmount = await page.evaluate(() => {
            const balance = document.querySelector('[data-testid="full-balance"]')
            return balance.innerText
        })

        let availableAmmountNum = availableAmmount.replace(/\n/g, "");
        availableAmmountNum = availableAmmountNum.split('$')[1]
        console.log(availableAmmountNum)
        /* Verify that the balance is bigger than 0 */
        expect(parseFloat(availableAmmountNum) > 0).toBeTruthy();
    }));
})


