const puppeteer = require('puppeteer');


import { bootStrap, setAmbKeyStoreForLegacy, generateEthereumPrivateKey, clickOnElement, typeText } from './functions.js';


describe('login', () => {
    let browser;
    let page;
    let extensionRootUrl;
    let options;

    beforeEach(async () => {

        options = {
            devtools: false,
            slowMo: 30,
        };

        const context = await bootStrap(page, browser, options)
        // page = context.page
        // pages = context.pages
        browser = context.browser
        extensionRootUrl = context.extensionRootUrl
        extensionId = context.extensionId

        page = (await browser.pages())[0];
        const createVaultUrl = `chrome-extension://${extensionId}/tab.html#/get-started`
        await page.goto(createVaultUrl, { waitUntil: 'load' })

        await new Promise((r) => setTimeout(r, 1000))

        const pages = await browser.pages()
        // pages[0].close() // blank tab
        pages[1].close() // tab always opened after extension installation

        await setAmbKeyStoreForLegacy(page, '[data-testid="button-Import"]');
    })

    //   afterEach(async () => {
    //     browser.close();
    // })



    it('Create legacy account', (async () => {

        await page.waitForXPath('//div[contains(text(), "Import your Private Key")]');

        await typeText(page, '[data-testid="enter-seed-phrase-field"]', process.env.PRIVATE_KEY_LEGACY_ACCOUNT)

        /* Click on Import Legacy account button. */
        await clickOnElement(page, '[data-testid="button"]')

        await new Promise((r) => setTimeout(r, 1000))

        await page.waitForSelector('[data-testid="account-checkbox"]')
        /* Select one Legacy account and one Smart account */
        let firstSelectedLegacyAccount = await page.$$eval('[data-testid="account-checkbox"]', element => {
            element[0].click()
            return element[0].textContent
        })

        /* Keep the first and the last part of the address and use it later for verification later */
        firstSelectedLegacyAccount1 = firstSelectedLegacyAccount.slice(0, 15)
        firstSelectedLegacyAccount2 = firstSelectedLegacyAccount.slice(18, firstSelectedLegacyAccount.length)

        let firstSelectedSmartAccount = await page.$$eval('[data-testid="account-checkbox"]', element => {
            element[1].click()
            return element[1].textContent
        })

        firstSelectedSmartAccount1 = firstSelectedSmartAccount.slice(0, 15);
        firstSelectedSmartAccount2 = firstSelectedSmartAccount.slice(18, firstSelectedSmartAccount.length);

        /* Click on Import Accounts button*/
        await clickOnElement(page, '[data-testid="button"]')        
        
        await page.waitForSelector('xpath///div[contains(text(), "Personalize Your Accounts")]');

        /* Click on Save and Continue button */
        await clickOnElement(page, '[data-testid="button"]') 
        
        /* Move to account select page */
        await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load', })

        /* Verify that selected accounts exist on the page */
        const selectedLegacyAccount = await page.$$eval('[data-testid="account"]', el => el[0].innerText);
        expect(selectedLegacyAccount).toContain(firstSelectedLegacyAccount1);
        expect(selectedLegacyAccount).toContain(firstSelectedLegacyAccount2);

        const selectedSmartAccount = await page.$$eval('[data-testid="account"]', el => el[1].innerText);
        expect(selectedSmartAccount).toContain(firstSelectedSmartAccount1);
        expect(selectedSmartAccount).toContain(firstSelectedSmartAccount2);
    }));
});


