import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import TxnPreview from '@modules/common/components/TxnPreview'
import accountPresets from '@modules/common/constants/accountPresets'
import networks from '@modules/common/constants/networks'
import { getTransactionSummary } from '@modules/common/services/humanReadableTransactions/transactionSummary'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const BundlePreview = ({ bundle, mined = false, hasBottomSpacing, actions }: any) => {
  const network: any = networks.find((x) => x.id === bundle.network)
  const { t } = useTranslation()

  if (!Array.isArray(bundle.txns)) {
    return (
      <Text appearance="danger" style={textStyles.bold}>
        {t('Bundle has no transactions (should never happen)')}
      </Text>
    )
  }

  const lastTxn = bundle.txns[bundle.txns.length - 1]
  // terribly hacky; @TODO fix
  // all of the values are prob checksummed so we may not need toLowerCase
  const lastTxnSummary = getTransactionSummary(lastTxn, bundle.network, bundle.identity)
  const hasFeeMatch = lastTxnSummary.match(new RegExp(`to ${accountPresets.feeCollector}`, 'i'))
  const txns = hasFeeMatch ? bundle.txns.slice(0, -1) : bundle.txns
  const toLocaleDateTime = (date: any) =>
    `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

  return (
    // Here is better to use Panel for consistency but there is some interference between the expandable content and the Panel's flex props
    <Panel contentContainerStyle={styles.panel} type="filled">
      {txns.map((txn: any, i: number) => (
        <TxnPreview
          // eslint-disable-next-line react/no-array-index-key
          key={i} // safe to do this, individual TxnPreviews won't change within a specific bundle
          txn={txn}
          network={bundle.network}
          account={bundle.identity}
          mined={mined}
        />
      ))}
      {!!bundle.executed && !bundle.executed?.success && (
        <View style={spacings.mbTy}>
          <Trans>
            <Text appearance="danger" style={textStyles.bold}>
              {'Error: '} {bundle.executed?.errorMsg || 'unknown error'}
            </Text>
          </Trans>
        </View>
      )}
      <View style={[spacings.ptSm, hasBottomSpacing && spacings.pbMd]}>
        {hasFeeMatch ? (
          <View style={[flexboxStyles.directionRow, spacings.mbSm, flexboxStyles.alignCenter]}>
            <FontAwesome5
              style={spacings.mrMi}
              name="hand-holding-usd"
              size={17}
              color={colors.primaryIconColor}
            />
            <Text style={[textStyles.bold, flexboxStyles.flex1]} fontSize={17}>
              {t('Fee')}
            </Text>
            <Text>{lastTxnSummary.slice(5, -hasFeeMatch[0].length)}</Text>
          </View>
        ) : null}
        <View style={[flexboxStyles.directionRow, spacings.mbSm, flexboxStyles.alignCenter]}>
          <FontAwesome
            style={spacings.mrMi}
            name="calendar"
            size={17}
            color={colors.primaryIconColor}
          />
          <Text style={[textStyles.bold, flexboxStyles.flex1]} fontSize={17}>
            {t('Submitted on')}
          </Text>
          <Text>
            {bundle.submittedAt && toLocaleDateTime(new Date(bundle.submittedAt)).toString()}
          </Text>
        </View>
        {bundle.replacesTxId ? (
          <View style={spacings.mbSm}>
            <Text>
              {t('Replaces transaction: ')} {bundle?.replacesTxId}
            </Text>
          </View>
        ) : null}
        {bundle.txId ? (
          <View style={[flexboxStyles.directionRow, spacings.mbSm, flexboxStyles.alignCenter]}>
            <FontAwesome
              style={spacings.mrMi}
              name="globe"
              size={18}
              color={colors.primaryIconColor}
            />
            <Text style={[textStyles.bold, flexboxStyles.flex1]} fontSize={17}>
              {t('Block Explorer')}
            </Text>
            <Text
              onPress={() => Linking.openURL(`${network.explorerUrl}/tx/${bundle.txId}`)}
              underline
            >
              {network.explorerUrl?.split('/')[2]}
            </Text>
          </View>
        ) : null}
      </View>
      {!!actions && actions}
    </Panel>
  )
}

export default BundlePreview
