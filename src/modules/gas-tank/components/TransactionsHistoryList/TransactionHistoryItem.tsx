import React from 'react'
import { Linking, TouchableOpacity, View } from 'react-native'

import OpenIcon from '@assets/svg/OpenIcon'
import { useTranslation } from '@config/localization'
import { formatUnits } from '@ethersproject/units'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { getAddedGas } from '@modules/pending-transactions/services/helpers'

import styles from './styles'

type Props = {
  txn: any
  data: any[]
  explorerUrl: string
}
const HIT_SLOP = { bottom: 15, left: 12, right: 15, top: 15 }

const toLocaleDateTime = (date: any) => `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

const TransactionHistoryItem = ({ txn, data, explorerUrl }: Props) => {
  const { t } = useTranslation()
  const feeTokenDetails = data?.find((e: any) => e.id === txn?.gasTankFee?.assetId) || null
  const savedGas = getAddedGas(feeTokenDetails)
  return (
    <View style={styles.tokenItemContainer}>
      <View
        style={[
          flexboxStyles.directionRow,
          flexboxStyles.alignCenter,
          flexboxStyles.justifySpaceBetween,
          spacings.mbTy
        ]}
      >
        <Text fontSize={12} color={colors.titan_50} numberOfLines={1}>
          {txn.submittedAt && toLocaleDateTime(new Date(txn.submittedAt)).toString()}
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(`${explorerUrl}/tx/${txn.txId}`)}
          hitSlop={HIT_SLOP}
        >
          <OpenIcon />
        </TouchableOpacity>
      </View>
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        <View style={[flexboxStyles.flex1, spacings.prMi]}>
          <Text fontSize={11} weight="medium" numberOfLines={1}>
            {t('Gas payed: ')}
          </Text>
          <Text fontSize={11} numberOfLines={1}>{`$${(txn.feeInUSDPerGas * txn.gasLimit).toFixed(
            6
          )}`}</Text>
        </View>
        <View style={[flexboxStyles.flex1, spacings.prMi]}>
          <Text fontSize={11} weight="medium" numberOfLines={1}>
            {t('Saved: ')}
          </Text>
          <Text fontSize={11} numberOfLines={1}>{`$${(txn.feeInUSDPerGas * savedGas).toFixed(
            6
          )}`}</Text>
        </View>
        <View style={flexboxStyles.flex1}>
          <Text fontSize={11} weight="medium" numberOfLines={1}>
            {t('Cashback: ')}
          </Text>
          <Text fontSize={11} numberOfLines={1}>{`$${
            txn.gasTankFee.cashback && feeTokenDetails
              ? (
                  formatUnits(txn.gasTankFee.cashback.toString(), feeTokenDetails.decimals) *
                  feeTokenDetails?.price
                ).toFixed(6)
              : '0.00'
          }`}</Text>
        </View>
      </View>
    </View>
  )
}

export default React.memo(TransactionHistoryItem)
