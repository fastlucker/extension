import { formatUnits } from 'ethers'

import { Account } from '@ambire-common/interfaces/account'
import { SelectedAccountPortfolio } from '@ambire-common/interfaces/selectedAccount'
import { TokenResult } from '@ambire-common/libs/portfolio'

const calculateTokenBalance = (token: TokenResult, type: keyof TokenResult) => {
  const amount = token[type]
  const { decimals, priceIn } = token
  const balance = parseFloat(formatUnits(amount, decimals))
  const price =
    priceIn.find(({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd')?.price || 0

  return balance * price
}

export const calculateGasTankBalance = (
  portfolio: SelectedAccountPortfolio,
  account: Account | null,
  isSA: boolean,
  key: 'usd' | 'cashback' | 'saved'
) => {
  const gasTankResult = portfolio?.latestStateByNetworks?.gasTank?.result

  if (!account?.addr || !gasTankResult || gasTankResult.tokens.length === 0 || !isSA) return 0

  const token = gasTankResult.tokens[0]

  return key === 'usd' ? Number(gasTankResult.total?.[key]) || 0 : calculateTokenBalance(token, key)
}
