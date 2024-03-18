const puppeteer = require('puppeteer');



import { bootStrap, setAmbKeyStoreForLegacy, clickOnElement, typeText } from './functions.js';


describe('login', () => {
    let browser;
    let page;
    let extensionRootUrl;
    let options;
    let extensionId;

    beforeEach(async () => {

        options = {
            devtools: false,
            slowMo: 30,
        };

        const context = await bootStrap(page, browser, options)
        browser = context.browser
        extensionRootUrl = context.extensionRootUrl
        extensionId = context.extensionId

        page = await browser.newPage()
        const getStartedPage = `chrome-extension://${extensionId}/tab.html#/`
        await page.goto(getStartedPage, { waitUntil: 'load' })
        await new Promise((r) => {
            setTimeout(r, 1000)
        })
        await page.bringToFront();
        await page.reload();
    })

    afterEach(async () => {
        browser.close();
    })

    const enterSeedPhraseField = '[data-testid="enter-seed-phrase-field"]';


    //------------------------------------------------------------------------------------------------------
    it('login into legacy account with phrase', (async () => {

        await setAmbKeyStoreForLegacy(page, '[data-testid="button-Proceed"]');

        await page.waitForXPath('//div[contains(text(), "Enter your Seed Phrase")]');

        let passphraseWords = process.env.PHRASE_LEGACY_ACCOUNT;
        let wordArray = passphraseWords.split(' ');

        for (let i = 0; i < wordArray.length; i++) {
            const wordToType = wordArray[i];

            // Type the word into the input field using page.type
            const inputSelector = `[placeholder="Word ${i + 1}"]`;
            await page.type(inputSelector, wordToType);
        }

        /* Click on Import button. */
        await clickOnElement(page, '[data-testid="padding-button-Import"]')

        await page.waitForXPath('//div[contains(text(), "Import Accounts from Seed Phrase")]');

        await new Promise((r) => setTimeout(r, 2000))
        await clickOnElement(page, 'xpath///a[contains(text(), "Next")]')

        await new Promise((r) => setTimeout(r, 2000))
        await clickOnElement(page, 'xpath///a[contains(text(), "Got it")]')
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

    //------------------------------------------------------------------------------------------------------
    it('(-) login into legacy account with invalid private key', async () => {
        await setAmbKeyStoreForLegacy(page, '[data-testid="button-Import"]');

        const typeTextAndCheckValidity = async (privateKey, testName) => {
            let textContent;
            try {
                await typeText(page, enterSeedPhraseField, privateKey, { delay: 10 });

                /* Check whether text "Invalid private key." exists on the page */
                textContent = await page.$$eval('div[dir="auto"]', element => {
                    return element.find((item) => item.textContent === "Invalid private key.").textContent;
                });
                /* Check whether button is disabled */
                const isButtonDisabled = await page.$eval('[data-testid="padding-button-Import"]', (button) => {
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
        await setAmbKeyStoreForLegacy(page, '[data-testid="button-Proceed"]');

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
                const isButtonDisabled = await page.$eval('[data-testid="padding-button-Import"]', (button) => {
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
        await setAmbKeyStoreForLegacy(page, '[data-testid="button-Import"]');

        await page.waitForXPath('//div[contains(text(), "Import your Private Key")]');

        await typeText(page, '[data-testid="enter-seed-phrase-field"]', process.env.PRIVATE_KEY_LEGACY_ACCOUNT)

        /* Click on Import button. */
        await clickOnElement(page, '[data-testid="padding-button-Import"]')

        await page.waitForXPath('//div[contains(text(), "Import Accounts from Private Key")]');

        await new Promise((r) => setTimeout(r, 2000))
        await clickOnElement(page, 'xpath///a[contains(text(), "Next")]')

        await new Promise((r) => setTimeout(r, 2000))
        await clickOnElement(page, 'xpath///a[contains(text(), "Got it")]')
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

        await page.waitForSelector(`xpath///div[contains(text(), "Personalize your accounts")]`);

        let accountName1 = 'Test-Account-1'
        let accountName2 = 'Test-Account-2'

        const editAccountNameFields = await page.$$('[data-testid="penIcon-edit-name"]');

        await editAccountNameFields[0].click();
        await new Promise(r => setTimeout(r, 500))

        await typeText(page, '[data-testid="edit-name-field-0"]', accountName1)

        await editAccountNameFields[1].click();
        await new Promise(r => setTimeout(r, 500))

        await typeText(page, '[data-testid="edit-name-field-1"]', accountName2)

        /* Click on "Save and Continue" button*/
        await clickOnElement(page, '[data-testid="padding-button-Save-and-Continue"]')

        await page.waitForFunction(() => {
            return window.location.href.includes('/onboarding-completed');
        }, { timeout: 60000 });

        await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load' });


        /* Verify that selected accounts exist on the page */
        const selectedLegacyAccount = await page.$$eval('[data-testid="account"]', el => el[0].innerText);
        expect(selectedLegacyAccount).toContain(accountName1);

        const selectedSmartAccount = await page.$$eval('[data-testid="account"]', el => el[1].innerText);
        expect(selectedSmartAccount).toContain(accountName2);

    }));
});
