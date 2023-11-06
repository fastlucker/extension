const puppeteer = require('puppeteer');
const path = require('path')

import { bootStrap } from './functions.js';
import {  KEYSTORE_PASS_PHRASE, KEYSTORE, KEYSTORE1}from '@env';



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

    

        // KEYSTORE = KEYSTORE.replaceAll("\"", "&quot;")
        // KEYSTORE = KEYSTORE.replaceAll("'","\"");
        
        console.log('-----------====== ' + KEYSTORE1)
        console.log('-----------====== ' + KEYSTORE_PASS_PHRASE)
        // console.log('-0-0-0-0-0-0-' + JSON.parse(KEYSTORE))

        const executionContext = await page.mainFrame().executionContext()
        await executionContext.evaluate((KEYSTORE1) => {
            browser.storage.local.set(KEYSTORE1)    
        }, KEYSTORE1)

        let pages = await browser.pages()
        pages[0].close() // blank tab
        pages[1].close() // tab always opened after extension installation
        // pages[2].close() // tab always opened after extension installation


        await new Promise((r) => setTimeout(r, 500));
        /*Open the page again to load the browser local storage */
        page = await browser.newPage();
        await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load', })
        pages = await browser.pages()

    })


    beforeEach(async () => {
        // await new Promise((r) => setTimeout(r, 500));
        // /*Open the page again to load the browser local storage */
        // page = await browser.newPage();
        await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load', })
        pages = await browser.pages()
        // pages[1].close()
    })


    afterEach(async () => {
        // browser.close();
        const executionContext = await page.mainFrame().executionContext()

        await executionContext.evaluate(() => {
            browser.storage.local.clear()
        })
        let createVaultUrl = `chrome-extension://${extensionId}/tab.html#/get-started`
        await page.goto(createVaultUrl, { waitUntil: 'load' })

    })

    afterAll(async () => {
        await browser.close();
    });

    //--------------------------------------------------------------------------------------------------------------
    // the login is only in the first test, the next tests don't include it, if the first one  fails the other will fail too
    it.only('check the balance in account ', (async () => {
        await new Promise((r) => setTimeout(r, 500));
        pages[1].close()
        /*Type keystore password */
        await page.waitForSelector('[placeholder="Passphrase"]');
        const keyStorePassField = await page.$('[placeholder="Passphrase"]');
        await keyStorePassField.type( KEYSTORE_PASS_PHRASE);

        await new Promise((r) => setTimeout(r, 1000))

        const keyStoreUnlokeButton = await page.waitForSelector('xpath///div[contains(text(), "Unlock")]');
        await keyStoreUnlokeButton.click();

        await new Promise((r) => setTimeout(r, 2000))

        /* Get the available balance */
        const availableAmmount = await page.evaluate(() => {
            const balance = document.querySelectorAll('[class="css-175oi2r r-18u37iz"]')
            return balance[1].innerText
        })

        let availableAmmountNum = availableAmmount.replace(/\n/g, "");
        availableAmmountNum = availableAmmountNum.split('$')[1]

        /* Verify that the balance is bigger than 0 */
        expect(parseFloat(availableAmmountNum) > 0).toBeTruthy();
    }));


    //--------------------------------------------------------------------------------------------------------------
    it('check if networks Ethereum, USDC and Polygon exist in the account  ', (async () => {

        // /*Type keystore password */
        // const pass = 'test1234'
        // await page.waitForSelector('[placeholder="Passphrase"]');
        // const keyStorePassField = await page.$('[placeholder="Passphrase"]');
        // await keyStorePassField.type(keyStorePassphrase);

        // await new Promise((r) => setTimeout(r, 1000))

        // const keyStoreUnlokeButton = await page.waitForSelector('xpath///div[contains(text(), "Unlock")]');
        // await keyStoreUnlokeButton.click();

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

        // /*Type keystore password */
        // const pass = 'test1234'
        // await page.waitForSelector('[placeholder="Passphrase"]');
        // const keyStorePassField = await page.$('[placeholder="Passphrase"]');
        // await keyStorePassField.type(keyStorePassphrase);

        // await new Promise((r) => setTimeout(r, 1000))

        // const keyStoreUnlokeButton = await page.waitForSelector('xpath///div[contains(text(), "Unlock")]');
        // await keyStoreUnlokeButton.click();

        await new Promise((r) => setTimeout(r, 2000))

        /* Click on "Collectibles" button */
        const collectiblesButton = await page.waitForSelector('xpath///div[contains(text(), "Collectibles")]');



        await Promise.all([
            await collectiblesButton.click(),
            page.waitForNavigation()
        ]);


        /* Get the text content of the first item */
        let firstCollectiblesItem = await page.$$eval('[class="css-175oi2r r-1loqt21 r-1otgn73 r-1awozwy r-42olwf r-1q9bdsx r-rs99b7 r-18u37iz r-1wtj0ep r-1uu6nss"]', element => {
            return element[0].textContent
        });
        let firstCollectiblesItemCut = firstCollectiblesItem.split(' ')[0]

        /* Click on the first item */
        let elements = await page.$$('[class="css-175oi2r r-1loqt21 r-1otgn73 r-1awozwy r-42olwf r-1q9bdsx r-rs99b7 r-18u37iz r-1wtj0ep r-1uu6nss"]');

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