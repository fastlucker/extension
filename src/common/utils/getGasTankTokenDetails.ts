import { Account } from '@ambire-common/interfaces/account'
import { Network } from '@ambire-common/interfaces/network'
import {
  SelectedAccountPortfolio,
  SelectedAccountPortfolioTokenResult
} from '@ambire-common/interfaces/selectedAccount'
import { GasTankTokenResult } from '@ambire-common/libs/portfolio'
import getAndFormatTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'

const parseGasTankToken = (token: GasTankTokenResult, type: keyof GasTankTokenResult) => {
  const amount = token[type]
  const { cashback, saved, availableAmount, ...rest } = token

  return { ...rest, amount } as SelectedAccountPortfolioTokenResult
}

export const getGasTankTokenDetails = (
  portfolio: SelectedAccountPortfolio,
  account: Account | null,
  hasGasTank: boolean,
  networks: Network[],
  key: 'amount' | 'cashback' | 'saved'
) => {
  const gasTankResult = portfolio?.latest?.gasTank?.result

  if (
    !account?.addr ||
    !gasTankResult ||
    !('gasTankTokens' in gasTankResult) ||
    !Array.isArray(gasTankResult.gasTankTokens) ||
    gasTankResult.gasTankTokens.length === 0 ||
    !hasGasTank
  ) {
    return { token: null, balanceFormatted: null }
  }

  const token = parseGasTankToken(gasTankResult.gasTankTokens[0], key)

  return {
    token,
    balanceFormatted: getAndFormatTokenDetails(token, networks).balanceFormatted
  }
}
