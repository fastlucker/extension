const puppeteer = require('puppeteer');

import { bootstrap, setLocalStorage, clickOnElement, typeSeedPhrase } from './functions.js';


describe('balance', () => {
    let browser;
    let page;
    let extensionRootUrl;

    beforeEach(async () => {
        const { browser: newBrowser, page: newPage, extensionRootUrl: newExtensionRootUrl } = await setLocalStorage();
        browser = newBrowser;
        extensionRootUrl = newExtensionRootUrl;
        page = newPage;
    })
    

    afterEach(async () => {
        await browser.close();
    });

    //--------------------------------------------------------------------------------------------------------------
    it.only('check the balance in account ', (async () => {
        
        console.log('The test starts----->>>>>');

        await page.waitForSelector('[data-testid="full-balance"]');
        
        /* Get the available balance */
        const availableAmmount = await page.evaluate(() => {
            const balance = document.querySelector('[data-testid="full-balance"]');
            return balance.innerText;
        });
        
        let availableAmmountNum = availableAmmount.replace(/\n/g, "");
        availableAmmountNum = availableAmmountNum.split('$')[1];
        
        console.log('Balance: ' + availableAmmountNum);
        
        /* Verify that the balance is bigger than 0 */
        expect(parseFloat(availableAmmountNum)).toBeGreaterThan(0);
        
        console.log('The test ends----->>>>>');
    }));


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


        const colectiblPicture = '[data-testid="collectible-picture"]'
        /* Click on the first item */
        await page.waitForSelector(colectiblPicture, { visible: true });
        const element = await page.$(colectiblPicture);
        await element.click();


        /* Get the text of the modal and verify that the name of the first collectible item is included*/
        const modalText = await page.$eval('[data-testid="collectible-row"]', el => {
            return el.textContent
        });

        expect(modalText).toContain(firstCollectiblesItem);

    }));
})


