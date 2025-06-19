import { expect, Page } from '@playwright/test'
import { baParams, BA_ADDRESS } from 'constants/env'
import { test } from 'fixtures/pageObjects'

test.describe('signMessage', () => {
  test.beforeEach(async ({ signMessagePage }) => {
    await signMessagePage.init(baParams)
  })

  test('should sign plain message', async ({ signMessagePage }) => {
    const page = signMessagePage.page

    await page.goto('https://sigtool.ambire.com/')

    const connect = page.getByRole('button', { name: 'connect wallet' })
    await connect.click()

    // Dapp Request action window
    const context = page.context()
    const actionWindowPagePromise = new Promise<Page>((resolve) => {
      context.once('page', (p) => {
        resolve(p)
      })
    })

    const ambire = page.getByRole('button', { name: 'MetaMask' })
    await ambire.click()

    // Connect
    const actionWindowPage = await actionWindowPagePromise
    const dappConnect = actionWindowPage.getByTestId('dapp-connect-button')
    await dappConnect.click()

    // Type plain text message
    const textbox = page.getByRole('textbox', { name: 'Message (Hello world)' })
    await textbox.fill('Hello, Ambire!')

    // Sign
    const signContext = page.context()
    const signActionWindowPagePromise = new Promise<Page>((resolve) => {
      signContext.once('page', (p) => {
        resolve(p)
      })
    })
    const sign = page.getByRole('button', { name: 'Sign' })
    await sign.click()

    const signActionWindowPage = await signActionWindowPagePromise
    const signMessageButton = signActionWindowPage.getByTestId('button-sign')
    await signMessageButton.click()

    const signature = await page.locator('.signatureResult-signature').first().innerText()

    // Verify
    const verifyTab = page.getByRole('link', { name: 'Verify' })
    await verifyTab.click()

    const signerAddress = page.getByRole('textbox', { name: 'Signer address (0x....)' })
    await signerAddress.fill(BA_ADDRESS)

    const messageTextbox = page.getByRole('textbox', { name: 'Message (Hello world)' })
    await messageTextbox.fill('Hello, Ambire!')

    const signatureTextbox = page.getByRole('textbox', { name: 'Hexadecimal signature (0x....)' })
    await signatureTextbox.fill(signature)

    const networkSelector = page.getByText('Select Network')
    await networkSelector.click()

    const polygon = page.locator('.networkName', { hasText: 'Polygon' })
    await polygon.click()

    const verifyButton = page.getByRole('button', { name: 'Verify' })
    await verifyButton.click()

    await expect(page.locator('.verifyFeedback-text')).toHaveText('Signature is Valid')
  })
})
