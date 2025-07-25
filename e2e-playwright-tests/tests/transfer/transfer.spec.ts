import { baParams } from 'constants/env'
import selectors from 'constants/selectors'
import tokens from 'constants/tokens'
import { test } from 'fixtures/pageObjects'
import { pages } from 'pages/utils/page_instances'

import { expect, Page } from '@playwright/test'

test.describe('transfer', () => {
  test.beforeEach(async () => {
    await pages.initWithStorage(baParams)
  })

  test.afterEach(async ({ context }) => {
    await context.close()
  })

  test('should send a transaction and pay with the current account gas tank', async () => {
    const sendToken = tokens.usdc.optimism
    // This address is derived from SA testing account seed phrase
    const recipientAddress = '0xc162b2F9f06143Cf063606d814C7F38ED4471F44'
    const feeToken = tokens.usdc.ethereum
    const payWithGasTank = true

    await test.step('assert no transaction on Activity tab', async () => {
      await pages.transferPage.checkNoTransactionOnActivityTab()
    })

    await test.step('start send transfer', async () => {
      await pages.transferPage.navigateToTransfer()
    })

    await test.step('add transfer amount', async () => {
      await pages.transferPage.fillAmount(sendToken)
    })

    await test.step('add recepient address', async () => {
      await pages.transferPage.fillRecipient(recipientAddress)
    })

    await test.step('send transaction', async () => {
      await pages.transferPage.signAndValidate(feeToken, payWithGasTank)
    })

    await test.step('assert new transaction on Activity tab', async () => {
      await pages.transferPage.checkSendTransactionOnActivityTab()
    })
  })

  test("should send a transaction and pay with the current account's ERC-20 token", async () => {
    const sendToken = tokens.usdc.optimism
    // This address is derived from SA testing account seed phrase
    const recipientAddress = '0xc162b2F9f06143Cf063606d814C7F38ED4471F44'
    const feeToken = tokens.usdc.optimism
    const payWithGasTank = false

    await test.step('assert no transaction on Activity tab', async () => {
      await pages.transferPage.checkNoTransactionOnActivityTab()
    })

    await test.step('start send transfer', async () => {
      await pages.transferPage.navigateToTransfer()
    })

    await test.step('add transfer amount', async () => {
      await pages.transferPage.fillAmount(sendToken)
    })

    await test.step('add recepient address', async () => {
      await pages.transferPage.fillRecipient(recipientAddress)
    })

    await test.step('send transaction', async () => {
      await pages.transferPage.signAndValidate(feeToken, payWithGasTank)
    })

    await test.step('assert new transaction on Activity tab', async () => {
      await pages.transferPage.checkSendTransactionOnActivityTab()
    })
  })

  test('should batch multiple transfer transactions', async () => {
    const page = pages.transferPage.page
    const sendToken = tokens.usdc.optimism
    const recipientAddress = '0xc162b2F9f06143Cf063606d814C7F38ED4471F44'

    await test.step('start monitoring requests', async () => {
      await pages.transferPage.monitorRequests()
    })

    await test.step('start send transfer', async () => {
      await pages.transferPage.navigateToTransfer()
    })

    await test.step('add first transaction', async () => {
      await pages.transferPage.fillAmount(sendToken)
      await pages.transferPage.fillRecipient(recipientAddress)
      await pages.transferPage.addToBatch()
    })

    await test.step('add more transaction', async () => {
      await pages.transferPage.click(selectors.addMoreButton)
    })

    await test.step('add second transaction', async () => {
      await pages.transferPage.fillAmount(sendToken)
      await pages.transferPage.fillRecipient(recipientAddress)
      await pages.transferPage.addToBatch()
    })

    await test.step('go to dashboard', async () => {
      await pages.transferPage.click(selectors.goDashboardButton)
    })

    await test.step('open AccountOp screen and sign', async () => {
      // New Page promise
      const context = page.context()
      const actionWindowPagePromise = new Promise<Page>((resolve) => {
        context.once('page', (p) => {
          resolve(p)
        })
      })

      // Open AccountOp screen
      await page.getByTestId(selectors.bannerButtonOpen).first().click()

      // Sign
      const actionWindowPage = await actionWindowPagePromise
      await actionWindowPage.getByTestId(selectors.signTransactionButton).click()

      // Expect the txn to be Confirmed.
      // Sometimes it takes a bit more time to be confirmed, that's why we increase the timeout.
      await expect(actionWindowPage.getByTestId(selectors.txnConfirmed)).toBeVisible({
        timeout: 20000
      })
    })

    await test.step('stop monitoring requests and expect no uncategorized requests to be made', async () => {
      const { uncategorized } = pages.transferPage.getCategorizedRequests()
      expect(uncategorized.length).toBeLessThanOrEqual(0)
    })
  })

  test('add contact in address book and send transaction to newly added contact', async () => {
    const newContactName = 'First Address'
    const newContactAddress = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'
    const sendToken = tokens.usdc.optimism
    const feeToken = tokens.usdc.optimism
    const payWithGasTank = false
    const isUnknownAddress = false

    await test.step('assert no transaction on Activity tab', async () => {
      await pages.transferPage.checkNoTransactionOnActivityTab()
    })

    await test.step('go to address book page', async () => {
      await pages.transferPage.openAddressBookPage()
    })

    await test.step('add new contact', async () => {
      await pages.transferPage.click(selectors.addContactFormButton)
      await pages.transferPage.entertext(selectors.contactNameField, newContactName)
      await pages.transferPage.entertext(selectors.addressEnsField, newContactAddress)
      await pages.transferPage.click(selectors.addToAddressBookButton)
    })

    await test.step('newly added address should be visible in Address book section', async () => {
      await pages.transferPage.assertAddedContact(newContactName, newContactAddress)
    })

    await test.step('go to dashboard', async () => {
      await pages.transferPage.navigateToDashboard()
    })

    await test.step('start send transfer', async () => {
      await pages.transferPage.navigateToTransfer()
    })

    await test.step('add transfer amount', async () => {
      await pages.transferPage.fillAmount(sendToken)
    })

    await test.step('add recepient address', async () => {
      await pages.transferPage.fillRecipient(newContactAddress, isUnknownAddress)
    })

    await test.step('send transaction', async () => {
      await pages.transferPage.signAndValidate(feeToken, payWithGasTank)
    })

    await test.step('assert new transaction on Activity tab', async () => {
      await pages.transferPage.checkSendTransactionOnActivityTab()
    })
  })

  test('Start transfer, add contact, send transaction to newly added contact', async () => {
    const newContactName = 'First Address'
    const newContactAddress = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'

    await test.step('assert no transaction on Activity tab', async () => {
      await pages.transferPage.checkNoTransactionOnActivityTab()
    })

    await test.step('start send transfer', async () => {
      await pages.transferPage.navigateToTransfer()
    })

    await test.step('add transfer amount', async () => {
      const feeToken = tokens.usdc.optimism

      await pages.transferPage.fillAmount(feeToken)
    })

    await test.step('add unknown recepient to address book', async () => {
      await pages.transferPage.addUnknownRecepientToAddressBook(newContactAddress, newContactName)
    })

    await test.step('send USCD to added contact', async () => {
      const feeToken = tokens.usdc.optimism
      const payWithGasTank = false

      await pages.transferPage.signAndValidate(feeToken, payWithGasTank)
    })

    await test.step('assert new transaction on Activity tab', async () => {
      await pages.transferPage.checkSendTransactionOnActivityTab()
    })
  })
})
