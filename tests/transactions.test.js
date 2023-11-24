const puppeteer = require('puppeteer');
const path = require('path')

import { bootStrap } from './functions.js';



describe('balance', () => {

    let browser
    let page
    let pages
    let extensionRootUrl

    beforeAll(async () => {
        const context = await bootStrap(page, browser)

        // page = context.page
        // pages = context.pages
        browser = context.browser
        extensionRootUrl = context.extensionRootUrl
        extensionId = context.extensionId


        page = (await browser.pages())[0];
        let createVaultUrl = `chrome-extension://${extensionId}/tab.html#/keystore-unlock`
        await page.goto(createVaultUrl, { waitUntil: 'load' })

        parsedKeystoreAccounts = JSON.parse(process.env.KEYSTORE_ACCOUNTS_1)
        parsedKeystoreUID = (process.env.KEYSTORE_KEYSTORE_UID_1)
        parsedKeystoreKeys = JSON.parse(process.env.KEYSTORE_KEYS_1)
        parsedKeystoreSecrets = JSON.parse(process.env.KEYSTORE_SECRETS_1)
        envOnboardingStatus = (process.env.KEYSTORE_ONBOARDING_STATUS_1)
        envPermission = (process.env.KEYSTORE_PERMISSION_1)
        envSelectedAccount = (process.env.KEYSTORE_SELECTED_ACCOUNT_1)
        envTermState = (process.env.KEYSTORE_TERMSTATE_1)
        parsedPreviousHints = (process.env.KEYSTORE_PREVIOUSHINTS_1)


        const executionContext = await page.mainFrame().executionContext()
        await executionContext.evaluate((parsedKeystoreAccounts, parsedKeystoreUID, parsedKeystoreKeys, parsedKeystoreSecrets, envOnboardingStatus, envPermission,
            envSelectedAccount, envTermState, parsedPreviousHints) => {
            browser.storage.local.set({
                accounts: parsedKeystoreAccounts,
                keyStoreUid: parsedKeystoreUID,
                keystoreKeys: parsedKeystoreKeys,
                keystoreSecrets: parsedKeystoreSecrets,
                onboardingStatus: envOnboardingStatus,
                permission: envPermission,
                selectedAccount: envSelectedAccount,
                termsState: envTermState,
                previousHints: parsedPreviousHints
            })
        }, parsedKeystoreAccounts, parsedKeystoreUID, parsedKeystoreKeys, parsedKeystoreSecrets, envOnboardingStatus, envPermission,
            envSelectedAccount, envTermState, parsedPreviousHints)


        let pages = await browser.pages()
        pages[0].close() // blank tab
        pages[1].close() // tab always opened after extension installation
        // pages[2].close() // tab always opened after extension installation


        await new Promise((r) => setTimeout(r, 1000));
        /*Open the page again to load the browser local storage */
        page = await browser.newPage();
        await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load', })
        pages = await browser.pages()



        await new Promise((r) => setTimeout(r, 500));
        // /*Open the page again to load the browser local storage */
        // page = await browser.newPage();
        // await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load', })
        // await new Promise((r) => setTimeout(r, 1000));

        pages = await browser.pages()
        pages[1].close()
        // pages[1].close()
        // /*Type keystore password */
        await page.waitForSelector('[placeholder="Passphrase"]');
        const keyStorePassField = await page.$('[placeholder="Passphrase"]');
        await keyStorePassField.type(process.env.KEYSTORE_PASS_PHRASE_1);

        // await new Promise((r) => setTimeout(r, 1000))

        const keyStoreUnlokeButton = await page.waitForSelector('xpath///div[contains(text(), "Unlock")]');
        await keyStoreUnlokeButton.click();

        await new Promise((r) => setTimeout(r, 2000))


    })

    afterAll(async () => {
        await browser.close();
    });

    //--------------------------------------------------------------------------------------------------------------
    it('Make valid transaction', (async () => {

        await new Promise((r) => setTimeout(r, 2000))


        /* Get the available balance */
        const availableAmmount = await page.evaluate(() => {
            const balance = document.querySelector('[data-testid="full-balance"]')
            return balance.innerText
        })

        let availableAmmountNum = availableAmmount.replace(/\n/g, "");
        availableAmmountNum = availableAmmountNum.split('$')[1]

        /* Verify that the balance is bigger than 0 */
        expect(parseFloat(availableAmmountNum) > 0).toBeTruthy();

        // await new Promise((r) => setTimeout(r, 1000))
        await page.waitForSelector('[data-testid="dashboard-button"]');


        /* Click on "Send" button */
        let buttons = await page.$$('[data-testid="dashboard-button"]');
        for (let i = 0; i < buttons.length; i++) {
            let text = await page.evaluate(el => el.innerText, buttons[i]);
            if (text.indexOf("Send") > -1) {
                await buttons[i].click();
            }
        }

        /* Type the amount */
        await page.waitForSelector('[placeholder="0"]');
        const amount = await page.$('[placeholder="0"]');
        await amount.click({ clickCount: 3 });
        await amount.press('Backspace');
        await amount.type("0.0001", { delay: 10 }); 



        
        /* Type the adress of the recipient  */
        const nthElementHandle = (await page.$$('[type="text"]'))[1];
        await nthElementHandle.type('0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C');

        /* Check the checkbox "Confirm sending to a previously unknown address" */
        await page.waitForSelector('[data-testid="checkbox"]');
        await page.click('[data-testid="checkbox"]')

        /* Check the checkbox "I confirm this address is not a Binance wallets...." */
        await page.waitForSelector('[data-testid="confirm-address-checkbox"]');
        await page.click('[data-testid="confirm-address-checkbox"]')

        /* Click on "Send" button */
        const sendButton = await page.waitForSelector('xpath///div[contains(text(), "Send")]');
        await sendButton.click();


        await page.goto(`${extensionRootUrl}/notification.html#/sign-account-op`, { waitUntil: 'load', })

        /* Click on "Medium" button */
        const keyStoreUnlokeButton = await page.waitForSelector('xpath///div[contains(text(), "Medium")]');
        await keyStoreUnlokeButton.click();

                // /* Click on "Medium" button */
                // const keyStoreUnlokeButton1 = await page.waitForSelector('xpath///div[contains(text(), "Sign")]');
                // await keyStoreUnlokeButton1.click();

                // await page.goto(`${extensionRootUrl}/tab.html#/dashboard`, { waitUntil: 'load', })
                // await page.goto(`${extensionRootUrl}/notification.html#/sign-account-op`, { waitUntil: 'load', })
    }));
})