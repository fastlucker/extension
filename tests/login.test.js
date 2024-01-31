const puppeteer = require('puppeteer');



import { bootStrap, setAmbKeyStoreForLegacy, clickOnElement, typeText, generateEthereumPrivateKey } from './functions.js';


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

        await new Promise((r) => setTimeout(r, 2000))

        const pages = await browser.pages()
        // pages[0].close() // blank tab
        pages[1].close() // tab always opened after extension installation

        // await page.evaluate(() => {
        //     location.reload(true)
        // })

        await setAmbKeyStoreForLegacy(page, '[data-testid="button-Proceed"]');
    })

    afterEach(async () => {
        browser.close();
    })

    const enterSeedPhraseField = '[data-testid="enter-seed-phrase-field"]';
    const accountCheckbox = '[data-testid="account-checkbox"]';


    //------------------------------------------------------------------------------------------------------
    it('login into legacy account with phrase', (async () => {

        await page.waitForXPath('//div[contains(text(), "Enter your Seed Phrase")]');

        let passphraseWords = process.env.PHRASE_LEGACY_ACCOUNT;
        let wordArray = passphraseWords.split(' ');

        for (let i = 0; i < wordArray.length; i++) {
            const wordToType = wordArray[i];

            // Type the word into the input field using page.type
            const inputSelector = `[placeholder="Word ${i + 1}"]`;
            await page.type(inputSelector, wordToType);
        }

        await clickOnElement(page, '[data-testid="button"]');
        await page.waitForSelector('xpath///div[contains(text(), "Pick Accounts To Import")]');

        await page.waitForSelector(accountCheckbox);

        await new Promise((r) => setTimeout(r, 1000))

        /* Select one Legacy account and one Smart account */
        await page.$$eval('div', element => {
            element.find((item) => item.textContent === "Smart Account").click()
        })
        await page.$$eval(accountCheckbox, element => {
            element[0].click()
        })

        /* Click on Import Accounts button*/
        await clickOnElement(page, 'xpath///div[contains(text(), "Import Accounts")]')

        /* Click on Save and Continue button */
        await clickOnElement(page, 'xpath///div[contains(text(), "Save and Continue")]')

        /* Check whether text "How To Use Ambire Wallet" exists on the page  */
        const textContent = await page.$$eval('div[dir="auto"]', element => {
            return element.find((item) => item.textContent === "How To Use Ambire Wallet").textContent
        });
        if (textContent) {
            console.log('login into legasy account with phrase --- Test is passed');
        }
    }));

    //------------------------------------------------------------------------------------------------------
    it('(-) login into legacy account with invalid private key', async () => {
        const typeTextAndCheckValidity = async (privateKey, testName) => {
            let textContent;
            try {
                await typeText(page, enterSeedPhraseField, privateKey, { delay: 10 });

                /* Check whether text "Invalid private key." exists on the page */
                textContent = await page.$$eval('div[dir="auto"]', element => {
                    return element.find((item) => item.textContent === "Invalid private key.").textContent;
                });
                /* Check whether button is disabled */
                const isButtonDisabled = await page.$eval('[data-testid="button-ext-signer-login-screen"]', (button) => {
                    return button.getAttribute('aria-disabled');
                });

                if (isButtonDisabled === 'true') {
                    console.log('Button is disabled');
                } else {
                    throw new Error('Button is NOT disabled');
                }

            } catch (error) {
                console.error(`Error when trying to login with private key: ${privateKey}. Test failed: ${testName}`);
                throw error;
            }
        };

        /* Test cases with different private keys */
        await typeTextAndCheckValidity('0000000000000000000000000000000000000000000000000000000000000000', 'Test 1');
        await page.$eval(enterSeedPhraseField, (el) => (el.value = ''));
        console.log('Test 1 passed for privateKey: 0000000000000000000000000000000000000000000000000000000000000000');



        await typeTextAndCheckValidity('', 'Test 2');
        await page.$eval(enterSeedPhraseField, (el) => (el.value = ''));
        console.log('Test 2 passed for privateKey: Empty');

        await typeTextAndCheckValidity('00390ce7b96835258b010e25f9196bf4ddbff575b7c102546e9e40780118018', 'Test 3');
        await new Promise((r) => setTimeout(r, 1000));
        await page.$eval(enterSeedPhraseField, (el) => (el.value = ''));
        console.log('Test 3 passed for privateKey: 00390ce7b96835258b010e25f9196bf4ddbff575b7c102546e9e40780118018');

        await typeTextAndCheckValidity('03#90ce7b96835258b019e25f9196bf4ddbff575b7c102546e9e40780118018', 'Test 4');
        console.log('Test 4 passed for privateKey: 03#90ce7b96835258b019e25f9196bf4ddbff575b7c102546e9e40780118018');
    });


    //--------------------------------------------------------------------------------------------------------------
    it('(-) Login into legacy account with invalid phrase', async () => {

        await page.waitForXPath('//div[contains(text(), "Enter your Seed Phrase")]');

        /* This function types words in the passphrase fields and checks if the button is disabled. */
        async function typeWordsAndCheckButton(passphraseWords) {
            try {
                let wordArray = passphraseWords.split(' ');

                for (let i = 0; i < wordArray.length; i++) {
                    const wordToType = wordArray[i];

                    /* Type the word into the input field using page.type */
                    const inputSelector = `[placeholder="Word ${i + 1}"]`;
                    await page.type(inputSelector, wordToType);
                }
                /* Check whether button is disabled */
                const isButtonDisabled = await page.$eval('[data-testid="button"]', (button) => {
                    return button.getAttribute('aria-disabled');
                });

                if (isButtonDisabled === 'true') {
                    console.log(`Button is disabled when try to login with phrase ${passphraseWords}`);
                } else {
                    throw new Error('Button is NOT disabled');
                }

            } catch (error) {
                console.error(`Error when trying to login with phrase: ${passphraseWords}. Test failed`);
                throw error;
            }
        }
        /* This function waits until an error message appears on the page.  */
        async function waitUntilError(validateMessage) {
            await page.waitForFunction((text) => {
                const element = document.querySelector('body');
                return element && element.textContent.includes(text);
            }, { timeout: 8000 }, validateMessage);
            console.log(`ERROR MESSAGE: ${validateMessage} EXIST ON THE PAGE.`)
        }

        /* Try to login with empty phrase fields */
        let passphraseWords = '';
        await typeWordsAndCheckButton(passphraseWords)

        /* Test cases with different phrases keys */
        passphraseWords = '00000 000000 00000 000000 00000 000000 00000 000000 00000 000000 00000 000000'
        await typeWordsAndCheckButton(passphraseWords)

        const errorMessage = 'Invalid Seed Phrase. Please review every field carefully.';
        /* Wait until the error message appears on the page */
        await waitUntilError(errorMessage);

        /* Clear the passphrase fields before write the new phrase */
        let wordArray = passphraseWords.split(' ');
        for (let i = 0; i < wordArray.length; i++) {
            const wordToType = wordArray[i];
            const inputSelector = `[placeholder="Word ${i + 1}"]`;
            await page.click(inputSelector, { clickCount: 3 }); // Select all content
            await page.keyboard.press('Backspace'); // Delete the selected content          
        }

        passphraseWords = 'allow survey play weasel exhibit helmet industry bunker fish step garlic ababa'
        await typeWordsAndCheckButton(passphraseWords)
        /* Wait until the error message appears on the page */
        await waitUntilError(errorMessage);
    });

    //--------------------------------------------------------------------------------------------------------------
    it('change selected account name', (async () => {

        const privateKey = await generateEthereumPrivateKey();

        await page.waitForSelector(enterSeedPhraseField);
        const repeatPhrase = await page.$(enterSeedPhraseField);
        await repeatPhrase.type(privateKey, { delay: 10 });

        /* Click on Import Legacy account button. */
        await page.click('[data-testid="button-ext-signer-login-screen"]')
        await page.waitForSelector('xpath///div[contains(text(), "Pick Accounts To Import")]');
        await page.waitForSelector(accountCheckbox);

        await new Promise((r) => setTimeout(r, 1000))

        /* Select one Legacy account and one Smart account */
        let firstSelectedLegacyAccount = await page.$$eval(accountCheckbox, element => {
            element[0].click()
        })


        let firstSelectedSmartAccount = await page.$$eval(accountCheckbox, element => {
            element[1].click()
        })

        /* Click on Import Accounts button*/
        const Button = await page.waitForSelector('xpath///div[contains(text(), "Import Accounts")]');
        await Button.click();

        let accountName1 = 'Test-Account-1'
        let accountName2 = 'Test-Account-2'

        /* Change the names of the chosen accounts */
        await typeText(page, '[value="Account 1 (Legacy from Private Key)"]', accountName1)
        await typeText(page, '[value="Account 2 (Legacy from Private Key)"]', accountName2)

        /* Click on Save and Continue button */
        const SaveButton = await page.waitForSelector('xpath///div[contains(text(), "Save and Continue")]');
        await SaveButton.click();

        /* Move to account select page */
        await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load', })

        /* Verify that selected accounts exist on the page */
        const text = await page.$eval('*', el => el.innerText);
        expect(text).toContain(accountName1);
        expect(text).toContain(accountName2);
    }));
});
