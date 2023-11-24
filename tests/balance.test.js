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

    


    })


    beforeAll(async () => {

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
        await keyStorePassField.type(process.env.KEYSTORE_PASS_PHRASE);

        // await new Promise((r) => setTimeout(r, 1000))

        const keyStoreUnlokeButton = await page.waitForSelector('xpath///div[contains(text(), "Unlock")]');
        await keyStoreUnlokeButton.click();

        await new Promise((r) => setTimeout(r, 2000))

    })

    afterAll(async () => {
        await browser.close();
    });

    //--------------------------------------------------------------------------------------------------------------
    // the login is only in the first test, the next tests don't include it, if the first one  fails the other will fail too
    it('check the balance in account ', (async () => {

        /* Get the available balance */
        const availableAmmount = await page.evaluate(() => {
            const balance = document.querySelector('[data-testid="full-balance"]')
            return balance.innerText
        })

        let availableAmmountNum = availableAmmount.replace(/\n/g, "");
        availableAmmountNum = availableAmmountNum.split('$')[1]

        /* Verify that the balance is bigger than 0 */
        expect(parseFloat(availableAmmountNum) > 0).toBeTruthy();
    }));


    //--------------------------------------------------------------------------------------------------------------
    it('check if networks Ethereum, USDC and Polygon exist in the account  ', (async () => {

        await new Promise((r) => setTimeout(r, 2000))

        /* Verify that USDC, ETH, WALLET */
        const text = await page.$eval('*', el => el.innerText);

        expect(text).toContain('USDC');
        console.log('USDC exist on the page')
        expect(text).toContain('ETH');
        console.log('ETH exist on the page')
        expect(text).toContain('WALLET');
        console.log('WALLET exist on the page')

    }));




    //--------------------------------------------------------------------------------------------------------------
    it('check if item exist in Collectibles tab', (async () => {

        await new Promise((r) => setTimeout(r, 2000))

        /* Click on "Collectibles" button */
        const collectiblesButton = await page.waitForSelector('xpath///div[contains(text(), "Collectibles")]');
        await collectiblesButton.click()

        /* Get the text content of the first item */
        let firstCollectiblesItem = await page.$$eval('[data-testid="collection-item"]', element => {
            return element[0].textContent
        });

        let firstCollectiblesItemCut = firstCollectiblesItem.split(' ')[0]

        /* Click on the first item */
        let elements = await page.$$('[data-testid="collection-item"]');

        // loop trough items          
        for (let i = 0; i < elements.length; i++) {

            let text = await page.evaluate(el => el.innerText, elements[i]);
            if (text.indexOf(firstCollectiblesItemCut) > -1) {
                await elements[i].click();
            }
        }
        /* Verify that the correct url os loaded */
        const url = page.url()
        expect(url).toContain('collection');


        /* Verify that selected item exist on the page */
        const text = await page.$eval('*', el => el.innerText);
        expect(text).toContain(firstCollectiblesItemCut);
    }));
})