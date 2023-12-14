const puppeteer = require('puppeteer');
const path = require('path')

import { bootStrap, typeText, clickOnElement } from './functions.js';


describe('transactions', () => {


    let browser
    let page
    let pages
    let extensionRootUrl

    let recipientField = '[data-testid="recepient-address-field"]';
    let amountField = '[data-testid="amount-field"]'


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

        await new Promise((r) => setTimeout(r, 500));

        let pages = await browser.pages()
        pages[0].close() // blank tab
        pages[1].close() // tab always opened after extension installation
        // pages[2].close() // tab always opened after extension installation

        await new Promise((r) => setTimeout(r, 2000));
        /*Open the page again to load the browser local storage */
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(6000)
        await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load', })

        await new Promise((r) => setTimeout(r, 2000));

        pages = await browser.pages()
        // pages[0].close()
        pages[1].close()
        await page.reload({ waitUntil: 'load', });

        /*Type keystore password */
        await typeText(page, '[placeholder="Passphrase"]', process.env.KEYSTORE_PASS_PHRASE_1)
        await clickOnElement(page, 'xpath///div[contains(text(), "Unlock")]')

        await new Promise((r) => setTimeout(r, 2000))
    })

    // afterAll(async () => {
    //     await browser.close();
    // });

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
        await typeText(page, amountField, "0.0001")

        /* Type the adress of the recipient  */
        await typeText(page, recipientField, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C')

        /* Check the checkbox "Confirm sending to a previously unknown address" */
        await clickOnElement(page, '[data-testid="checkbox"]')


        /* Check the checkbox "I confirm this address is not a Binance wallets...." */
        await clickOnElement(page, '[data-testid="confirm-address-checkbox"]')

        /* Click on "Send" button */
        await clickOnElement(page, 'xpath///div[contains(text(), "Send")]')
        
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
    }));


    //--------------------------------------------------------------------------------------------------------------
    it('(-) Send matics greater than the available balance ', (async () => {

        await new Promise((r) => setTimeout(r, 2000))

        await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load', })

        await page.waitForSelector('[data-testid="max-available-ammount"]')
        /* Get the available balance */
        let maxAvailableAmmount = await page.evaluate(() => {
            const balance = document.querySelector('[data-testid="max-available-ammount"]')
            return balance.textContent
        })
        const balance1 = 1 + maxAvailableAmmount;

        /* Type the amount bigger than balance */
        await typeText(page, amountField, balance1)

        /* Verify that the message "The amount is greater than the asset's balance:" exist on the page */
        const targetText = "The amount is greater than the asset's balance:";
        // Wait until the specified text appears on the page
        await page.waitForFunction((text) => {
            const element = document.querySelector('body');
            return element && element.textContent.includes(text);
        }, {}, targetText);

    }));

    //--------------------------------------------------------------------------------------------------------------
    it('(-) Send matics to smart contract ', (async () => {

        await new Promise((r) => setTimeout(r, 2000))

        await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load', })

       /* Type the amount */
       await typeText(page, amountField, "0.0001")

        /* Type the adress of smart contract in the "Add Recipient" field */
        await typeText(page, recipientField, '0x4e15361fd6b4bb609fa63c81a2be19d873717870')

        /* Verify that the message "The amount is greater than the asset's balance:" exist on the page */
        const targetText = "You are trying to send tokens to a smart contract. Doing so would burn them.";
        // Wait until the specified text appears on the page
        await page.waitForFunction((text) => {
            const element = document.querySelector('body');
            return element && element.textContent.includes(text);
        }, {}, targetText);

    }));

})