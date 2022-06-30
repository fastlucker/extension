import erc20Abi from 'adex-protocol-eth/abi/ERC20.json'
import accountPresets from 'ambire-common/src/constants/accountPresets'
import { validateSendTransferAmount } from 'ambire-common/src/services/validations'
import { ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import NumberInput from '@modules/common/components/NumberInput'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import TokenIcon from '@modules/common/components/TokenIcon'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const ERC20 = new Interface(erc20Abi)

type DepositTokenContextData = {
  openDepositToken: (tokenToDeposit: any) => void
}

const DepositTokenContext = React.createContext<DepositTokenContextData>({
  openDepositToken: () => {}
})

const DepositTokenProvider = ({ children, networkId }: any) => {
  const { t } = useTranslation()

  const [token, setToken] = useState<any>(null)
  const [amount, setAmount] = useState<number | string>('')
  const [bigNumberHexAmount, setBigNumberHexAmount] = useState('')
  const { selectedAcc } = useAccounts()
  const { network } = useNetwork()
  const { addRequest } = useRequests()
  const { addToast } = useToast()

  const { sheetRef, openBottomSheet, closeBottomSheet, isOpen } = useBottomSheet()

  const onAmountChange = useCallback(
    (value: any) => {
      if (value) {
        const bigNumberAmount = ethers.utils.parseUnits(value, token.decimals).toHexString()
        setBigNumberHexAmount(bigNumberAmount)
      }

      setAmount(value)
    },
    [token]
  )

  const openDepositToken = useCallback(
    (tokenToDeposit) => {
      setToken(tokenToDeposit)
      openBottomSheet()
    },
    [openBottomSheet]
  )

  const maxAmount = useMemo(() => {
    if (!token) return 0

    return ethers.utils.formatUnits(token.balanceRaw, token.decimals)
  }, [token])

  const setMaxAmount = useCallback(() => onAmountChange(maxAmount), [onAmountChange, maxAmount])

  const isValidSendTransferAmount = useMemo(
    () => validateSendTransferAmount(amount, token),
    [token, amount]
  )

  const handleDepositToken = useCallback(() => {
    try {
      const recipientAddress = accountPresets.feeCollector

      const txn = {
        to: token.address,
        value: '0',
        data: ERC20.encodeFunctionData('transfer', [recipientAddress, bigNumberHexAmount])
      }

      if (Number(token.address) === 0) {
        txn.to = recipientAddress
        txn.value = bigNumberHexAmount
        txn.data = '0x'
      }

      const req: any = {
        id: `transfer_${Date.now()}`,
        type: 'eth_sendTransaction',
        chainId: network?.chainId,
        account: selectedAcc,
        txn,
        meta: null
      }

      addRequest(req)

      // Timeout of 400ms because of the animated transition between screens (addRequest opens PendingTransactions screen)
      setTimeout(() => {
        closeBottomSheet()
      }, 400)
    } catch (e: any) {
      console.error(e)
      addToast(`Error: ${e.message || e}`, { error: true })
    }
  }, [
    selectedAcc,
    token,
    bigNumberHexAmount,
    network?.chainId,
    addRequest,
    addToast,
    closeBottomSheet
  ])

  const amountLabel = (
    <View style={[flexboxStyles.directionRow, spacings.mbMi]}>
      <Text style={spacings.mr}>{t('Available Amount:')}</Text>

      <View style={[flexboxStyles.directionRow, flexboxStyles.flex1]}>
        <Text numberOfLines={1} style={{ flex: 1, textAlign: 'right' }} ellipsizeMode="tail">
          {maxAmount}
        </Text>
        {!!token && <Text>{` ${token?.symbol}`}</Text>}
      </View>
    </View>
  )

  return (
    <DepositTokenContext.Provider
      value={useMemo(
        () => ({
          openDepositToken
        }),
        [openDepositToken]
      )}
    >
      {children}
      <BottomSheet
        id="deposit-token-bottom-sheet"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={() => {
          closeBottomSheet()
          setToken(null)
          setAmount('')
          setBigNumberHexAmount('')
        }}
      >
        <Title style={textStyles.center}>{t('Deposit to Gas Tank')}</Title>
        {!!token && (
          <>
            <View style={styles.tokenContainer}>
              <View style={spacings.prTy}>
                <TokenIcon
                  withContainer
                  uri={token.img || token.tokenImageUrl}
                  networkId={networkId}
                  address={token.address}
                />
              </View>
              <Text fontSize={16} numberOfLines={1}>
                {token.symbol}
              </Text>
            </View>
            {amountLabel}
            <NumberInput
              onChangeText={onAmountChange}
              containerStyle={spacings.mb}
              value={amount.toString()}
              button={t('MAX')}
              placeholder={t('0')}
              onButtonPress={setMaxAmount}
              error={isValidSendTransferAmount.message}
            />
            <Button
              text={t('Send')}
              disabled={!amount || !isValidSendTransferAmount.success}
              onPress={handleDepositToken}
            />
          </>
        )}
      </BottomSheet>
    </DepositTokenContext.Provider>
  )
}

export { DepositTokenContext, DepositTokenProvider }
