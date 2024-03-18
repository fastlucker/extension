const puppeteer = require('puppeteer');

import { bootstrap, typeSeedPhrase, clickOnElement } from './functions.js';

describe('balance', () => {
    let browser;
    let page;
    let extensionRootUrl;

    beforeEach(async () => {
        /* Initialize browser and page using bootstrap */
        const context = await bootstrap({ headless: false, slowMo: 10 });
        browser = context.browser;
        extensionRootUrl = context.extensionRootUrl
        page = await browser.newPage();

        // Navigate to a specific URL if necessary
        await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load' });

        /*  interact with chrome.storage.local in the context of the extension's background page */
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

        await new Promise((r) => {
            setTimeout(r, 1000)
        })

        await page.bringToFront();
        await page.reload();

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
});
