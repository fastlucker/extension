import { constants } from '../../constants/constants'
import { test } from '../../fixtures/pageObjects' // your extended test with authPage

test.describe('auth', () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.init()
  })

  test('should import view-only Basic account', async ({ authPage }) => {
    await authPage.importViewOnlyAccount(constants.addresses.basicAccount)
  })

  test('should import view-only Smart account', async ({ authPage }) => {
    await authPage.importViewOnlyAccount(constants.addresses.smartAccount)
  })

  test('create new basic account', async ({ authPage }) => {
    await authPage.createNewAccount()
  })

  test.skip('import basic account from private key', async ({ authPage }) => {
    // TODO: Implement the test
  })
})
