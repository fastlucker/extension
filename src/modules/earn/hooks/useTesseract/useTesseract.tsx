import ERC20ABI from 'adex-protocol-eth/abi/ERC20.json'
import { Contract } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import i18n from '@config/localization/localization'
import TesseractLogo from '@modules/common/assets/svg/icons/TesseractLogo'
import TesseractVaultABI from '@modules/common/constants/YearnTesseractVaultABI'
import useToast from '@modules/common/hooks/useToast'

const POLYGON_SCAN_IMAGES = 'https://polygonscan.com/token/images'
const VAULTS: any = [
  [
    'tvUSDC',
    '0x57bDbb788d0F39aEAbe66774436c19196653C3F2',
    `${POLYGON_SCAN_IMAGES}/centre-usdc_32.png`
  ],
  ['tvDAI', '0x4c8C6379b7cd039C892ab179846CD30a1A52b125', `${POLYGON_SCAN_IMAGES}/mcdDai_32.png`],
  ['tvWBTC', '0x6962785c731e812073948a1f5E181cf83274D7c6', `${POLYGON_SCAN_IMAGES}/wBTC_32.png`],
  ['tvWETH', '0x3d44F03a04b08863cc8825384f834dfb97466b9B', `${POLYGON_SCAN_IMAGES}/wETH_32.png`],
  ['tvWMATIC', '0xE11678341625cD88Bb25544e39B2c62CeDcC83f1', `${POLYGON_SCAN_IMAGES}/wMatic_32.png`]
]

const TESR_API_ENDPOINT = 'https://prom.tesr.finance/api/v1'

const useTesseract = ({ tokens, provider, networkId, currentNetwork }: any) => {
  const { addToast } = useToast()

  const [vaults, setVaults] = useState<any>([])
  const [tokensItems, setTokensItems] = useState<any>([])
  const [details, setDetails] = useState<any>([])

  const toTokensItems = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (type, vaults) => {
      return vaults.map(({ vaultAddress, token, tToken, icon, apy }: any) => {
        const { address, symbol, decimals } = type === 'deposit' ? token : tToken
        const portfolioToken = tokens.find(
          (t: any) => t.address.toLowerCase() === address.toLowerCase()
        )
        return {
          type,
          vaultAddress,
          tokenAddress: address,
          symbol,
          decimals,
          icon,
          apy,
          label: `${symbol} (${apy}% APY)`,
          value: vaultAddress,
          balance: portfolioToken ? portfolioToken.balance : 0,
          balanceRaw: portfolioToken ? portfolioToken.balanceRaw : '0'
        }
      })
    },
    [tokens]
  )

  const fetchVaultAPY = useCallback(
    async (ticker) => {
      try {
        const response = await fetch(
          `${TESR_API_ENDPOINT}/query?query=deriv(price{network="matic",ticker="${ticker}",version="0.4.3.1"}[10d])*60*60*24*365`
        )
        const { data, status } = await response.json()
        if (!data || status !== 'success' || !data.result.length) return 0
        // eslint-disable-next-line no-unsafe-optional-chaining
        return (data.result[0]?.value[1] * 100).toFixed(2)
      } catch (e: any) {
        console.error(e)
        addToast(i18n.t('Failed to fetch {{ticker}} Vault APY', { ticker }) as string, {
          error: true
        })
      }
    },
    [addToast]
  )

  const loadVaults = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const vaults = (
      await Promise.all(
        VAULTS.map(async ([ticker, address, icon]: any) => {
          try {
            const tesseractVaultContract = new Contract(address, TesseractVaultABI, provider)
            const tokenAddress = await tesseractVaultContract.token()

            const tokenContract = new Contract(tokenAddress, ERC20ABI, provider)
            const [symbol, decimals] = await Promise.all([
              await tokenContract.symbol(),
              await tokenContract.decimals()
            ])

            const apy = await fetchVaultAPY(ticker)

            return {
              vaultAddress: address,
              token: {
                address: tokenAddress,
                decimals,
                symbol
              },
              tToken: {
                address,
                decimals,
                symbol: `tv${symbol}`
              },
              icon,
              apy
            }
          } catch (e: any) {
            console.error(e)
            addToast(
              i18n.t('Fetch Tesseract Vaults: {{error}}', { error: e.message || e }) as string,
              { error: true }
            )
            return null
          }
        })
      )
    ).filter((v) => v)

    if (networkId !== currentNetwork.current) return
    setVaults(vaults)
  }, [networkId, currentNetwork, fetchVaultAPY, provider, addToast])

  const onTokenSelect = useCallback(
    (address) => {
      const selectedToken = tokensItems.find((t: any) => t.tokenAddress === address)
      if (selectedToken)
        setDetails([
          ['Annual Percentage Yield (APY)', `${selectedToken.apy}%`],
          ['Lock', 'No Lock'],
          ['Type', 'Variable Rate']
        ])
    },
    [tokensItems]
  )

  useEffect(() => {
    const depositTokenItems = toTokensItems('deposit', vaults)
    const withdrawTokenItems = toTokensItems('withdraw', vaults)

    setTokensItems([...depositTokenItems, ...withdrawTokenItems])
  }, [vaults, toTokensItems])

  return {
    Icon: TesseractLogo,
    loadVaults,
    tokensItems,
    details,
    onTokenSelect
  }
}

export default useTesseract
