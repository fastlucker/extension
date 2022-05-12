import networks from 'ambire-common/src/constants/networks'
import { Interface, parseUnits } from 'ethers/lib/utils'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useTranslation } from '@config/localization'
import { getDefaultProvider } from '@ethersproject/providers'
import YEARN_TESSERACT_VAULT_ABI from '@modules/common/constants/YearnTesseractVaultABI'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import approveToken from '@modules/common/services/approveToken/approveToken'
import Card from '@modules/earn/components/Card'
import { CARDS } from '@modules/earn/contexts/cardsVisibilityContext'
import useTesseract from '@modules/earn/hooks/useTesseract'
import useYearn from '@modules/earn/hooks/useYearn'

const VaultInterface = new Interface(YEARN_TESSERACT_VAULT_ABI)

const YearnTesseractCard = () => {
  const currentNetwork = useRef()
  const [loading, setLoading] = useState<any>([])

  const { t } = useTranslation()
  const { addToast } = useToast()
  const { network }: any = useNetwork()
  const { selectedAcc } = useAccounts()
  const { addRequest } = useRequests()
  const { tokens } = usePortfolio()

  const unavailable = !(
    network.id === 'ethereum' ||
    network.id === 'polygon' ||
    network.id === 'fantom'
  )
  const name = network.id === 'ethereum' ? 'Yearn' : 'Tesseract'
  const networkDetails: any = networks.find(({ id }) => id === network.id)
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
    networkId: network.id,
    currentNetwork
  })

  const { Icon, loadVaults, tokensItems, details, onTokenSelect } = useMemo(
    () => (network.id === 'polygon' ? tesseract : yearn),
    [network.id, yearn, tesseract]
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
        network.id,
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
    currentNetwork.current = network.id
    if (!unavailable) setLoading(true)
  }, [network.id, unavailable])

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

export default YearnTesseractCard
