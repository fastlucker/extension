import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

import TransactionHistoryItem from './TransactionHistoryItem'

interface Props {
  gasTankTxns: any[]
  data: any[]
  explorerUrl: string
}

const TransactionHistoryList = ({ gasTankTxns, data, explorerUrl }: Props) => {
  const { t } = useTranslation()

  return (
    <View>
      <Text style={spacings.mbSm} fontSize={12}>
        {t('Transaction history')}
      </Text>
      {!!gasTankTxns.length &&
        gasTankTxns.map((txn) => (
          <TransactionHistoryItem key={txn._id} txn={txn} data={data} explorerUrl={explorerUrl} />
        ))}
      {!gasTankTxns.length && (
        <View style={spacings.pv}>
          <Text fontSize={12} style={[spacings.phSm, textStyles.center]}>
            {t('No transactions are made via Gas Tank.')}
          </Text>
        </View>
      )}
    </View>
  )
}

export default React.memo(TransactionHistoryList)
