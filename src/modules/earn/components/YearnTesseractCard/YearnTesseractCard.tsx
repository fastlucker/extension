import YEARN_TESSERACT_VAULT_ABI from 'ambire-common/src/constants/abis/YearnTesseractVaultABI'
import networks from 'ambire-common/src/constants/networks'
import { UseToastsReturnType } from 'ambire-common/src/hooks/toasts/'
import approveToken from 'ambire-common/src/services/approveToken'
import { Interface, parseUnits } from 'ethers/lib/utils'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'

import { useTranslation } from '@config/localization'
import { getDefaultProvider } from '@ethersproject/providers'
import Card from '@modules/earn/components/Card'
import { CARDS } from '@modules/earn/contexts/cardsVisibilityContext'
import useTesseract from '@modules/earn/hooks/useTesseract'
import useYearn from '@modules/earn/hooks/useYearn'

const VaultInterface = new Interface(YEARN_TESSERACT_VAULT_ABI)

interface Props {
  tokens: any[]
  networkId?: string
  selectedAcc: string
  addRequest: (req: any) => any
  addToast: UseToastsReturnType['addToast']
}

const YearnTesseractCard = ({ tokens, networkId, selectedAcc, addRequest, addToast }: Props) => {
  const currentNetwork: any = useRef()
  const [loading, setLoading] = useState<any>([])

  const { t } = useTranslation()

  const unavailable = !(
    networkId === 'ethereum' ||
    networkId === 'polygon' ||
    networkId === 'fantom'
  )
  const name = networkId === 'ethereum' ? 'Yearn' : 'Tesseract'
  const networkDetails: any = networks.find(({ id }) => id === networkId)
  const addRequestTxn = (id: any, txn: any, extraGas = 0) =>
    addRequest({
      id,
      type: 'eth_sendTransaction',
      chainId: networkDetails.chainId,
      account: selectedAcc,
      txn,
      extraGas
    })
  const provider = useMemo(() => getDefaultProvider(networkDetails.rpc), [networkDetails.rpc])

  const yearn = useYearn({
    tokens,
    provider,
    networkDetails,
    currentNetwork
  })

  const tesseract = useTesseract({
    tokens,
    provider,
    networkId,
    currentNetwork
  })

  const { Icon, loadVaults, tokensItems, details, onTokenSelect } = useMemo(
    () => (networkId === 'polygon' ? tesseract : yearn),
    [networkId, yearn, tesseract]
  )

  const onValidate = async (type: any, value: any, amount: any) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const item = tokensItems.find((t: any) => t.type === type.toLowerCase() && t.value === value)
    if (!item) return

    const { vaultAddress, decimals } = item
    const parsedAmount = amount.slice(0, amount.indexOf('.') + Number(decimals) + 1)
    const bigNumberAmount = parseUnits(parsedAmount, decimals)

    if (type === 'Deposit') {
      await approveToken(
        name,
        networkId,
        selectedAcc,
        vaultAddress,
        item.tokenAddress,
        addRequestTxn,
        addToast
      )

      try {
        addRequestTxn(`${name.toLowerCase()}_vault_deposit_${Date.now()}`, {
          to: vaultAddress,
          value: '0x0',
          data: VaultInterface.encodeFunctionData('deposit', [
            bigNumberAmount.toHexString(),
            selectedAcc
          ])
        })
      } catch (e: any) {
        console.error(e)
        addToast(
          t('{{name}} Deposit Error: {{message}}', { name, message: e.message || e }) as string,
          {
            error: true
          }
        )
      }
    } else if (type === 'Withdraw') {
      try {
        addRequestTxn(`${name.toLowerCase()}_vault_withdraw_${Date.now()}`, {
          to: vaultAddress,
          value: '0x0',
          data: VaultInterface.encodeFunctionData('withdraw', [
            bigNumberAmount.toHexString(),
            selectedAcc
          ])
        })
      } catch (e: any) {
        console.error(e)
        addToast(
          t('{{name}} Withdraw Error: {{message}}', { name, message: e.message || e }) as string,
          {
            error: true
          }
        )
      }
    }
  }

  useEffect(() => {
    if (unavailable) {
      setLoading(false)
      return
    }
    async function load() {
      await loadVaults()
      setLoading(false)
    }
    load()
  }, [unavailable, loadVaults])

  useEffect(() => {
    currentNetwork.current = networkId
    if (!unavailable) setLoading(true)
  }, [networkId, unavailable])

  return (
    <Card
      name={CARDS.YearnTesseract}
      loading={loading}
      icon={Icon}
      unavailable={unavailable}
      tokensItems={tokensItems}
      details={details}
      onTokenSelect={onTokenSelect}
      onValidate={onValidate}
    />
  )
}

export default React.memo(YearnTesseractCard, isEqual)
