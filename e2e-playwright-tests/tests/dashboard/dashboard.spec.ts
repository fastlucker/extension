import { saParams } from 'constants/env'
import selectors from 'constants/selectors'
import tokens from 'constants/tokens'
import { test } from 'fixtures/pageObjects'

test.describe('dashboard', () => {
  test.beforeEach(async ({ pages }) => {
    await pages.initWithStorage(saParams)
  })

  test.afterEach(async ({ context }) => {
    await context.close()
  })

  test('should have balance on the dashboard', async ({ pages }) => {
    await pages.dashboard.checkBalanceInAccount()
  })

  test('should test if expected tokens are visible on the dashboard', async ({ pages }) => {
    await pages.dashboard.checkIfTokensExist()
  })

  test('should test if expected NFTs are visible on the dashboard', async ({ pages }) => {
    await pages.dashboard.checkCollectibleItem()
  })

  test('import whale account via ENS from Dashboard', async ({ pages }) => {
    await test.step('open add account modal from dashboard', async () => {
      await pages.basePage.click(selectors.accountSelectBtn)
      await pages.basePage.click(selectors.buttonAddAccount)
    })

    await test.step('import vitalik.eth account', async () => {
      await pages.settings.addReadOnlyAccount('vitalik.eth')
    })

    await test.step('naigate to dashboard and check view-only account', async () => {
      await pages.dashboard.navigateToDashboard()

      // assert account name
      await pages.basePage.compareText(selectors.accountSelectBtn, 'vitalik.eth')
    })
  })

  test('Filter Tokens by Network', async ({ pages }) => {
    await test.step('search Tokens by network - Base', async () => {
      await pages.dashboard.search('Base', 'tokens')
    })

    await test.step('assert search result', async () => {
      // SA should have 5 tokens on Base network - wallet, usdc, usdt, eth, clBtc
      await pages.basePage.expectItemsVisible(selectors.dashboard.tokenTitleText)
    })
  })

  test('Filter Tokens by token name', async ({ pages }) => {
    await test.step('search Tokens by token name - USDC', async () => {
      await pages.dashboard.search('USDC', 'tokens')
    })

    await test.step('assert search result', async () => {
      // SA should have 4 tokens containing USDC - base/optimism/polygon, USDCe - optimism
      await pages.basePage.expectItemsVisible(selectors.dashboard.tokenTitleText)
    })
  })

  test('Filter Token using network dropdown', async ({ pages }) => {
    await test.step('select Base network via dropdown', async () => {
      await pages.dashboard.searchByNetworkDropdown('Base', 'tokens')
    })

    await test.step('assert search result', async () => {
      // SA should have 5 tokens on Base network - wallet, usdc, usdt, eth, clBtc
      await pages.basePage.expectItemsVisible(selectors.dashboard.tokenTitleText)
    })
  })

  test('Search for non existing Token returns appropriate message', async ({ pages }) => {
    await test.step('search for non existing Token name - Test', async () => {
      await pages.dashboard.search('Test', 'tokens')
    })

    await test.step('assert no search result', async () => {
      await pages.dashboard.compareText(selectors.dashboard.noTokensText, 'No tokens match "Test".')
    })
  })

  test('Filter NFTs by Network', async ({ pages }) => {
    await test.step('navigate to tab NFTs', async () => {
      await pages.basePage.click(selectors.dashboard.nftTabButton)
    })

    await test.step('search NFTs by network - Base', async () => {
      await pages.dashboard.search('Base', 'collectibles')
    })

    await test.step('assert search result are visible', async () => {
      await pages.basePage.expectItemsVisible(selectors.dashboard.nftsTitle)
    })
  })

  test('Filter NFTs by token name', async ({ pages }) => {
    await test.step('navigate to tab NFTs', async () => {
      await pages.basePage.click(selectors.dashboard.nftTabButton)
    })

    const noCollectiblesText = await pages.basePage.isVisible(
      selectors.dashboard.noCollectiblesText
    )

    // in case there are no collectibles message is visible on NFTs tab
    if (noCollectiblesText) {
      await test.step('if no collectibles appropriate message should be visible', async () => {
        await pages.basePage.compareText(
          selectors.dashboard.noCollectiblesText,
          "You don't have any collectibles (NFTs) yet."
        )
      })
    } else {
      await test.step('search by NFT name - Ambire Legends', async () => {
        await pages.dashboard.search('Ambire Legends', 'collectibles')
      })

      await test.step('assert search result', async () => {
        // 1 item should be visible for SA
        await pages.basePage.expectItemsVisible(selectors.dashboard.nftsTitle)

        // assert nft title
        await pages.basePage.compareText(selectors.dashboard.nftTitle, 'Ambire Legends')
      })
    }
  })

  test('Filter NFTs using network dropdown', async ({ pages }) => {
    await test.step('navigate to tab NFTs', async () => {
      await pages.basePage.click(selectors.dashboard.nftTabButton)
    })

    const noCollectiblesText = await pages.basePage.isVisible(
      selectors.dashboard.noCollectiblesText
    )

    // in case there are no collectibles message is visible on DeFi tab
    if (noCollectiblesText) {
      await test.step('if no collectibles appropriate message should be visible', async () => {
        await pages.basePage.compareText(
          selectors.dashboard.noCollectiblesText,
          "You don't have any collectibles (NFTs) yet."
        )
      })
    } else {
      await test.step('select Base network via dropdown', async () => {
        await pages.dashboard.searchByNetworkDropdown('Base', 'collectibles')
      })

      await test.step('assert search result', async () => {
        // 8 NFTs should be visible for SA
        await pages.basePage.expectItemsVisible(selectors.dashboard.nftsTitle)
      })
    }
  })

  test('Search for non existing NFT returns appropriate message', async ({ pages }) => {
    await test.step('navigate to tab NFTs', async () => {
      await pages.basePage.click(selectors.dashboard.nftTabButton)
    })

    await test.step('search by NFT name - Test', async () => {
      await pages.dashboard.search('Test', 'collectibles')
    })

    await test.step('assert no search result', async () => {
      await pages.dashboard.compareText(
        selectors.dashboard.noCollectiblesText,
        'No collectibles (NFTs) match "Test".'
      )
    })
  })

  // TODO: add tests and assertions once we have protocols on FE
  test('Search Protocol by network dropdown', async ({ pages }) => {
    // await pages.auth.pause()
    await test.step('navigate to tab DeFi', async () => {
      await pages.basePage.click(selectors.dashboard.defiTabButton)
    })

    const noProtocolText = await pages.basePage.isVisible(selectors.dashboard.noProtocolsText)

    if (noProtocolText) {
      await test.step('if no protocols appropriate message should be visible', async () => {
        await pages.basePage.compareText(
          selectors.dashboard.noProtocolsText,
          'No known protocols detected.'
        )
      })
    } else {
      await test.step('select Base network via dropdown', async () => {
        await pages.dashboard.searchByNetworkDropdown('Base', 'defi')
      })

      // TODO: ATM there are no protocols for SA; uncomment when we have protocols
      // await test.step('assert search result', async () => {
      //   await pages.basePage.expectItemsCount(selectors.dashboard.protocolTitle, 1)
      // })
    }
  })

  test('Search for non existing Defi Protocol returns appropriate message', async ({ pages }) => {
    await test.step('navigate to tab DeFi', async () => {
      await pages.basePage.click(selectors.dashboard.defiTabButton)
    })

    await test.step('search Protocol by name - Test', async () => {
      await pages.dashboard.search('Test', 'defi')
    })

    await test.step('assert no search result', async () => {
      await pages.basePage.compareText(
        selectors.dashboard.noProtocolsText,
        'No known protocols match "Test".'
      )
    })

    await test.step('assert suggestion - open a ticket page', async () => {
      await pages.dashboard.checkOpenTicketPage()
    })
  })
})
