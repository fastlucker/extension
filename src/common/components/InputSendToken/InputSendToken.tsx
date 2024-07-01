import React, { useCallback } from 'react'
import isEqual from 'react-fast-compare'
import { View } from 'react-native'

import NumberInput from '@common/components/NumberInput'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'

import SkeletonLoader from '../SkeletonLoader'
import styles from './styles'

const MaxAmount = ({
  maxAmount,
  selectedTokenSymbol,
  isLoading
}: {
  maxAmount: number | null
  selectedTokenSymbol: string
  isLoading: boolean
}) => {
  const { t } = useTranslation()

  return (
    <View style={styles.maxAmount}>
      <Text weight="regular" fontSize={14} appearance="secondaryText" style={styles.maxAmountLabel}>
        {t('Enter Amount')}
      </Text>

      {maxAmount !== null &&
        (selectedTokenSymbol && !isLoading ? (
          <View style={styles.maxAmountValueWrapper}>
            <Text
              testID="max-available-amount"
              numberOfLines={1}
              style={styles.maxAmountValue}
              ellipsizeMode="tail"
            >
              <Text fontSize={12}>Available Amount: </Text>
              {maxAmount === 0 ? 0 : maxAmount.toFixed(maxAmount < 1 ? 8 : 4)}
            </Text>
            {!!selectedTokenSymbol && <Text>{` ${selectedTokenSymbol.toUpperCase()}`}</Text>}
          </View>
        ) : (
          <SkeletonLoader height={22} width={100} />
        ))}
    </View>
  )
}

interface Props {
  amount: string
  selectedTokenSymbol: string
  maxAmount: number | null
  errorMessage: string
  onAmountChange: (value: any) => void
  setMaxAmount: () => void
  isLoading: boolean
  disabled?: boolean
}

const InputSendToken = ({
  amount,
  selectedTokenSymbol,
  onAmountChange,
  setMaxAmount,
  maxAmount,
  errorMessage,
  disabled,
  isLoading
}: Props) => {
  const { t } = useTranslation()

  const handleOnTokenAmountChange = useCallback(
    (valueInTokenAmount: string) => {
      onAmountChange(valueInTokenAmount)
    },
    [onAmountChange]
  )

  const handleSetMaxAmount = useCallback(() => {
    if (!maxAmount) return
    setMaxAmount()
  }, [setMaxAmount, maxAmount])

  return (
    <>
      <MaxAmount
        isLoading={isLoading}
        maxAmount={maxAmount}
        selectedTokenSymbol={selectedTokenSymbol}
      />
      <View style={styles.inputWrapper}>
        <NumberInput
          testID="amount-field"
          onChangeText={handleOnTokenAmountChange}
          containerStyle={styles.inputContainerStyle}
          value={amount}
          placeholder={t('0')}
          error={errorMessage || undefined}
          button={maxAmount ? t('MAX') : null}
          onButtonPress={handleSetMaxAmount}
          disabled={disabled}
        />
      </View>
    </>
  )
}

export default React.memo(InputSendToken, isEqual)
