import { NetworkId } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import React from 'react'
import { View } from 'react-native'

import InfoIcon from '@assets/svg/InfoIcon'
import { Trans, useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import TransactionHistoryItem from './TransactionHistoryItem'

interface Props {
  gasTankFilledTxns: any[]
  feeAssetsRes: any[]
  explorerUrl: string
  networkId?: NetworkId
}

const TransactionHistoryList = ({
  gasTankFilledTxns,
  feeAssetsRes,
  explorerUrl,
  networkId
}: Props) => {
  const { t } = useTranslation()

  return (
    <View>
      <Text style={spacings.mbSm} fontSize={12}>
        {t('Gas Tank top ups history')}
      </Text>
      <View style={[flexboxStyles.directionRow, spacings.mbTy]}>
        <InfoIcon color={colors.mustard} />
        <Text fontSize={11} style={[flexboxStyles.flex1, spacings.plTy]} color={colors.mustard}>
          {t(
            'Warning: It will take some time to fill up the Gas Tank after the filling up transaction is made.'
          )}
        </Text>
      </View>
      {!!gasTankFilledTxns.length &&
        gasTankFilledTxns.map((txn) => (
          <TransactionHistoryItem
            key={txn._id}
            txn={txn}
            explorerUrl={explorerUrl}
            feeAssetsRes={feeAssetsRes}
            networkId={networkId}
          />
        ))}
      {!gasTankFilledTxns.length && (
        <View style={spacings.pvSm}>
          <Text fontSize={12} style={[spacings.phSm, textStyles.center]}>
            {t('No top ups were made via Gas Tank on {{network}}.', {
              network: networkId?.toLocaleUpperCase()
            })}
          </Text>
        </View>
      )}
    </View>
  )
}

export default React.memo(TransactionHistoryList)
