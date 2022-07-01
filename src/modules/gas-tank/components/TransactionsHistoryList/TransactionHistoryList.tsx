import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import TransactionHistoryItem from './TransactionHistoryItem'

interface Props {
  gasTankTxns: any[]
  isLoading: boolean
}

const TransactionHistoryList = ({ gasTankTxns, isLoading }: Props) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <View style={[flexboxStyles.center, spacings.pbLg]}>
        <Text style={spacings.mbTy} fontSize={12}>
          {t('Available fee tokens')}
        </Text>
        <Spinner />
      </View>
    )
  }

  return (
    <View>
      <Text style={spacings.mbTy} fontSize={12}>
        {t('Transaction history')}
      </Text>
      {!!gasTankTxns.length &&
        gasTankTxns.map(
          (txn, i: number) => {
            console.log(txn)
            return null
          }
          // (
          //   <TransactionHistoryItem
          //     // eslint-disable-next-line react/no-array-index-key
          //     key={`token-${token.address}-${i}`}
          //     txn={txn}
          //     networkId={networkId}
          //   />
          // )
        )}
      {!gasTankTxns.length && (
        <View style={spacings.pv}>
          <Text fontSize={12} style={[spacings.phSm, textStyles.center]}>
            No transactions are made via Gas Tank.
          </Text>
        </View>
      )}
    </View>
  )
}

export default React.memo(TransactionHistoryList)
