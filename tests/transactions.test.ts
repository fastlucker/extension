const puppeteer = require('puppeteer');

import { bootstrap, typeText, clickOnElement, confirmTransaction, typeSeedPhrase } from './functions.js';
import { parse, stringify } from '../src/ambire-common/src/libs/richJson/richJson'

describe('transactions', () => {

    let browser;
    let page;
    let extensionRootUrl;

    let recipientField = '[data-testid="recepient-address-field"]';
    let amountField = '[data-testid="amount-field"]'

    beforeEach(async () => {
        /* Initialize browser and page using bootstrap */
        const context = await bootstrap({ headless: false, slowMo: 10 });
        browser = context.browser;
        extensionRootUrl = context.extensionRootUrl
        page = await browser.newPage();

        // Navigate to a specific URL if necessary
        await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load' });

        /*  interact with chrome.storage.local in the context of the extension's background page */
        await page.evaluate(({
            accounts,
            keyStoreUid,
            keystoreKeys,
            keystoreSecrets,
            onboardingStatus,
            permission,
            selectedAccount,
            termsState,
            previousHints
        }) => {
            chrome.storage.local.set({
                accounts,
                keyStoreUid,
                keystoreKeys,
                keystoreSecrets,
                onboardingStatus,
                permission,
                selectedAccount,
                termsState,
                previousHints
            });

            // Force a reload of the extension in order to restart the background
            // script with the new state from the storage
            chrome.runtime.reload()
        }, {
            accounts: stringify(parse(process.env.KEYSTORE_ACCOUNTS_1)),
            keyStoreUid: process.env.KEYSTORE_KEYSTORE_UID_1,
            keystoreKeys: stringify(parse(process.env.KEYSTORE_KEYS_1)),
            keystoreSecrets: stringify(parse(process.env.KEYSTORE_SECRETS_1)),
            onboardingStatus: process.env.KEYSTORE_ONBOARDING_STATUS_1,
            permission: process.env.KEYSTORE_PERMISSION_1,
            selectedAccount: process.env.KEYSTORE_SELECTED_ACCOUNT_1,
            termsState: process.env.KEYSTORE_TERMSTATE_1,
            previousHints: process.env.KEYSTORE_PREVIOUSHINTS_1
          })

        // By reloading the extension, the `chrome.runtime.reload()` command
        // closes all extension pages. So re-open the page after the reload.
        page = await browser.newPage();
        await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load' });

        await new Promise((r) => {
            setTimeout(r, 1000)
        })

        await page.bringToFront();
        await page.reload();

        await typeSeedPhrase(page, process.env.KEYSTORE_PASS_PHRASE_1)
    })

    afterEach(async () => {
        await browser.close();
    });

    //--------------------------------------------------------------------------------------------------------------
    it('Make valid transaction', (async () => {
        await new Promise((r) => setTimeout(r, 2000))

        await page.waitForSelector('[data-testid="full-balance"]')
        /* Get the available balance */
        const availableAmmount = await page.evaluate(() => {
            const balance = document.querySelector('[data-testid="full-balance"]')
            return balance.innerText
        })

        let availableAmmountNum = availableAmmount.replace(/\n/g, "");
        availableAmmountNum = availableAmmountNum.split('$')[1]
        /* Verify that the balance is bigger than 0 */
        expect(parseFloat(availableAmmountNum) > 0).toBeTruthy();

        /* Click on "Send" button */
        await clickOnElement(page, '[data-testid="dashboard-button-send"]')

        await page.waitForSelector(amountField)


        /* Check if selected network is Polygon */
        const textExists = await page.evaluate(() => {
            return document.body.innerText.includes('MATIC');
        });

        if (!textExists) {
            /* If "MATIC" text does not exist, select network Polygon */
            await clickOnElement(page, 'xpath///div[contains(text(), "on")]')
            await clickOnElement(page, 'xpath///div[contains(text(), "MATIC")]')
        }

        /* Type the amount */
        await typeText(page, amountField, "0.0001")

        /* Type the adress of the recipient  */
        await typeText(page, recipientField, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C')
        await page.waitForXPath(`//div[contains(text(), "You're trying to send to an unknown address. If you're really sure, confirm using the checkbox below.")]`);
        await page.waitForSelector('[data-testid="checkbox"]')

        /* Check the checkbox "I confirm this address is not a Binance wallets...." */
        await clickOnElement(page, '[data-testid="confirm-address-checkbox"]')

        /* Check the checkbox "Confirm sending to a previously unknown address" */
        await clickOnElement(page, '[data-testid="checkbox"]')

        /* Click on "Send" button and cofirm transaction */
        await confirmTransaction(page, extensionRootUrl, browser, '[data-testid="padding-button-Send"]')
    }));


    //--------------------------------------------------------------------------------------------------------------
    it('(-) Send matics greater than the available balance ', (async () => {
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
        }, {}, targetText)
    }));



    //--------------------------------------------------------------------------------------------------------------
    it('Send sign message ', (async () => {

        /* Allow permissions for read and write in clipboard */
        context = browser.defaultBrowserContext();
        context.overridePermissions('https://sigtool.ambire.com', ['clipboard-read', 'clipboard-write']);

        await new Promise((r) => setTimeout(r, 2000))
        await page.goto('https://sigtool.ambire.com/#dummyTodo', { waitUntil: 'load', })

        /* Click on 'connect wallet' button */
        await clickOnElement(page, 'button[class="button-connect"]')
        /* Select 'MetaMask' */
        await page.click('>>>[class^="name"]')

        // Wait for the new window to be created and switch to it
        const newTarget2 = await browser.waitForTarget(target => target.url() === `${extensionRootUrl}/notification.html#/dapp-connect-request`);
        const newPage2 = await newTarget2.page();



        /* Click on 'Connect' button */
        await clickOnElement(newPage2, '[data-testid="padding-button-Connect"]')
        /* Type message in the 'Message' field */
        let textMessage = 'text message'
        await typeText(page, '[placeholder="Message (Hello world)"]', textMessage)
        await new Promise((r) => setTimeout(r, 500))
        /* Click on "Sign" button */
        await clickOnElement(page, 'xpath///span[contains(text(), "Sign")]')

        // Wait for the new window to be created and switch to it
        const newTarget = await browser.waitForTarget(target => target.url() === `${extensionRootUrl}/notification.html#/sign-message`);
        const newPage = await newTarget.page();
        /* Click on "Sign" button */
        await clickOnElement(newPage, '[data-testid="padding-button-Sign"]')
        await page.waitForSelector('.signatureResult-signature')
        /* Get the Message signature text */
        const messageSignature = await page.evaluate(() => {
            const message = document.querySelector('.signatureResult-signature')
            return message.textContent
        })

        /* !THIS IS NOT WORKING WITH PUPPETEER. IT CAN'T BE COPIED IN CLIPBOARD. THAT'S WHY copiedAddress
        IS TAKEN FROM selectedAccount OBJECT IN LOCAL STORAGE! */
        /* Click on a button that triggers a copy to clipboard. */
        await page.click('.copyButton');

        let copiedAddress = process.env.KEYSTORE_SELECTED_ACCOUNT_1
        /* Click on "Verify" tab */
        await clickOnElement(page, 'xpath///a[contains(text(), "Verify")]')
        /* Fill copied address in the Signer field */
        await typeText(page, '[placeholder="Signer address (0x....)"]', copiedAddress)
        /* Fill copied address in the Message field */
        await typeText(page, '[placeholder="Message (Hello world)"]', textMessage)
        /* Fill copied address in the Hexadecimal signature field */
        await typeText(page, '[placeholder="Hexadecimal signature (0x....)"]', messageSignature)

        /* Click on "Verify" button */
        await clickOnElement(page, '#verifyButton')

        /* Verify that sign message is valid*/
        const validateMessage = 'Signature is Valid';
        /* Wait until the 'Signature is Valid' text appears on the page */
        await page.waitForFunction((text) => {
            const element = document.querySelector('body');
            return element && element.textContent.includes(text);
        }, {}, validateMessage);
    }));



    //--------------------------------------------------------------------------------------------------------------
    it('Make valid swap ', (async () => {

        await new Promise((r) => setTimeout(r, 2000))
        await page.goto('https://app.uniswap.org/swap', { waitUntil: 'load', })

        /* Click on 'connect' button */
        await clickOnElement(page, '[data-testid="navbar-connect-wallet"]')
        /* Select 'MetaMask' */
        await clickOnElement(page, '[data-testid="wallet-option-EIP_6963_INJECTED"]')
        /* Click on 'Select token' and type 'USDC' and select 'USDC' token */
        await clickOnElement(page, 'xpath///span[contains(text(), "Select token")]')
        // await typeText(page, '[data-testid="token-search-input"]', 'USDC')
        await new Promise((r) => setTimeout(r, 500))
        await clickOnElement(page, '[data-testid="common-base-USDC"]')

        await new Promise((r) => setTimeout(r, 500))

        await typeText(page, '#swap-currency-output', '0.0001')

        const selector = '[data-testid="swap-button"]';
        await page.waitForSelector(selector);

        let isClickable = false;
        let hasInsufficientBalanceText = false;

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
        } else {
            hasInsufficientBalanceText = await page.evaluate(() => {
                const element = document.querySelector('[data-testid="swap-button"]');
                return element && element.textContent.includes('Insufficient MATIC balance');
            });
            if (hasInsufficientBalanceText) {
                throw new Error('Insufficient MATIC balance');
            }
        }
        await new Promise((r) => setTimeout(r, 500))
        /* Click on 'Confirm Swap' button and confirm transaction */
        await confirmTransaction(page, extensionRootUrl, browser, '[data-testid="confirm-swap-button"]')
    }));


    //--------------------------------------------------------------------------------------------------------------
    it('Add View-only account', (async () => {
        /* Click on "Account"  */
        await clickOnElement(page, '[data-testid="account-select"]')

        /* Click on "+ Add Account"  */
        await clickOnElement(page, '[data-testid="padding-button-Add-Account"]')

        /* Seleck "Watch an address" */
        // await clickOnElement(page, '[data-testid="watch-an-address"]')
        // TODO: the above testid is missing and not attached to any React component.
        // When we fix it, then we can remove the above Promise and selector
        await new Promise((r) => setTimeout(r, 500))
        clickOnElement(page, 'xpath///div[contains(text(), "Watch an address")]')

        let viewOnlyAddress = '0xC254b41BE9582E45a8Ace62D5ADD3f8092D4ea6c'

        await typeText(page, '[data-testid="view-only-address-field"]', viewOnlyAddress)
        await new Promise((r) => setTimeout(r, 500))

        /* Click on "Import View-Only Accounts" button*/
        await clickOnElement(page, '[data-testid="padding-button-Import"]')

        /* Click on "Account"  */
        await clickOnElement(page, '[data-testid="padding-button-Save-and-Continue"]')

        await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load' });

        /* Find the element containing the specified address */
        const addressElement = await page.$x(`//*[contains(text(), '${viewOnlyAddress}')]`);

        if (addressElement.length > 0) {
            /* Get the parent element of the element with the specified address */
            const parentElement = await addressElement[0].$x('..');

            if (parentElement.length > 0) {
                /* Get the text content of the parent element and all elements within it */
                const parentTextContent = await page.evaluate(element => {
                    const elements = element.querySelectorAll('*');
                    return Array.from(elements, el => el.textContent).join('\n');
                }, parentElement[0]);

                /* Verify that somewhere in the content there is the text 'View-only' */
                const containsViewOnly = parentTextContent.includes('View-only');

                if (containsViewOnly) {
                } else {
                    throw new Error('The content does not contain the text "View-only".');
                }
            }
        }
    }))

})
