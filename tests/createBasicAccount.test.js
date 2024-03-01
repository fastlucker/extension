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
    })

      afterEach(async () => {
        browser.close();
    })


    it('Create basic account with private key', (async () => {
        await setAmbKeyStoreForLegacy(page, '[data-testid="button-Import"]');
        await page.waitForXPath('//div[contains(text(), "Import your Private Key")]');

        await typeText(page, '[data-testid="enter-seed-phrase-field"]', process.env.PRIVATE_KEY_LEGACY_ACCOUNT)

        /* Click on Import button. */
        await clickOnElement(page, '[data-testid="padding-button-Import"]')

        await page.waitForXPath('//div[contains(text(), "Import Accounts from Private Key")]');

        await new Promise((r) => setTimeout(r, 2000))
        await clickOnElement(page,'xpath///a[contains(text(), "Next")]')

        await new Promise((r) => setTimeout(r, 2000))
        await clickOnElement(page,'xpath///a[contains(text(), "Got it")]')
        /* Select one Legacy and one Smart account and keep the addresses of the accounts */
        await page.waitForSelector('[data-testid="checkbox"]')
        /* Select one Legacy account and one Smart account */
        let firstSelectedLegacyAccount = await page.$$eval('[data-testid="add-account"]', element => {
            element[0].click()
            return element[0].textContent
        })
        let firstSelectedSmartAccount = await page.$$eval('[data-testid="add-account"]', element => {
            element[1].click()
            return element[1].textContent
        })
      
        /* Click on Import Accounts button*/
        await clickOnElement(page, '[data-testid="padding-button-Import-Accounts"]')

        /* Click on "Save and Continue" button*/
        await clickOnElement(page, '[data-testid="padding-button-Save-and-Continue"]')

        await page.waitForFunction(() => {
            return window.location.href.includes('/onboarding-completed');
        }, { timeout: 60000 });

        await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load' });

        /* Verify that selected accounts exist on the page */
        const selectedLegacyAccount = await page.$$eval('[data-testid="account"]', el => el[0].innerText);
        expect(selectedLegacyAccount).toContain(firstSelectedLegacyAccount);

        const selectedSmartAccount = await page.$$eval('[data-testid="account"]', el => el[1].innerText);
        expect(selectedSmartAccount).toContain(firstSelectedSmartAccount);
    }));
});


