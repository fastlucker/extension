import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import CONFIG from '@config/env'
import { useTranslation } from '@config/localization'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import TxnPreview from '@modules/common/components/TxnPreview'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useRequests from '@modules/common/hooks/useRequests'
import { toBundleTxn } from '@modules/common/services/requestToBundleTxn'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import BundlePreview from '@modules/transactions/components/BundlePreview'
import useTransactions from '@modules/transactions/hooks/useTransactions'

import styles from './styles'

const TransactionsScreen = () => {
  const { data, errMsg, isLoading, speedup, cancel, firstPending, showSendTxns } = useTransactions()
  const { eligibleRequests } = useRequests()
  const { network }: any = useNetwork()
  const { selectedAcc } = useAccounts()
  const { t } = useTranslation()

  const renderPendingTxns = () => (
    <Panel>
      {eligibleRequests.map((req) => (
        <TouchableOpacity onPress={() => showSendTxns(null)} activeOpacity={0.8} key={req.id}>
          <TxnPreview
            network={network.id}
            account={selectedAcc}
            disableExpand
            txn={toBundleTxn(req.txn, selectedAcc)}
          />
        </TouchableOpacity>
      ))}
      <View style={spacings.ptSm}>
        <Button onPress={() => showSendTxns(null)} text={t('Sign or reject')} />
      </View>
    </Panel>
  )

  const renderPendingSentTxns = () => (
    <BundlePreview
      bundle={firstPending}
      hasBottomSpacing
      actions={
        <View style={flexboxStyles.directionRow}>
          <Button
            type="danger"
            onPress={() => cancel(firstPending)}
            text={t('Cancel')}
            style={[flexboxStyles.flex1, spacings.mrTy]}
          />
          <Button
            onPress={() => speedup(firstPending)}
            text={t('Speed up')}
            style={flexboxStyles.flex1}
          />
        </View>
      }
    />
  )

  const renderConfirmedTxns = ({ item }: any) => <BundlePreview bundle={item} mined />

  const renderConfirmedTxnsEmptyState = () => {
    return (
      <View>
        {!CONFIG.RELAYER_URL && (
          <Text>{t('Unsupported: not currently connected to a relayer.')}</Text>
        )}
        {!!errMsg && (
          <Text>
            {t('Error getting list of transactions:')} {errMsg}
          </Text>
        )}
      </View>
    )
  }

  const SECTIONS_DATA = [
    {
      title: t('Waiting to be signed (current batch)'),
      titleIcon: (
        <FontAwesome5
          style={spacings.mrTy}
          name="signature"
          size={19}
          color={colors.primaryIconColor}
        />
      ),
      shouldRenderTitle: !!eligibleRequests.length,
      renderItem: renderPendingTxns,
      data: eligibleRequests.length ? ['render-only-one-item'] : []
    },
    {
      title: t('Pending transaction bundle'),
      titleIcon: (
        <FontAwesome
          style={spacings.mrTy}
          name="clock-o"
          size={20}
          color={colors.primaryIconColor}
        />
      ),
      shouldRenderTitle: !!firstPending,
      renderItem: renderPendingSentTxns,
      data: firstPending ? ['render-only-one-item'] : []
    },
    {
      title: data?.txns?.length ? t('Confirmed transactions') : t('No transactions yet.'),
      titleIcon: (
        <FontAwesome5
          style={spacings.mrTy}
          name="check-double"
          size={18}
          color={colors.primaryIconColor}
        />
      ),
      shouldRenderTitle: true,
      renderItem: data?.txns?.length ? renderConfirmedTxns : renderConfirmedTxnsEmptyState,
      data: data?.txns?.filter((x: any) => x.executed) || ['render-only-one-item']
    }
  ]

  if (isLoading && !data) {
    return (
      <Wrapper>
        <View style={[flexboxStyles.flex1, flexboxStyles.alignCenter, flexboxStyles.justifyCenter]}>
          <ActivityIndicator size="large" />
        </View>
      </Wrapper>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper
        hasBottomTabNav
        type={WRAPPER_TYPES.SECTION_LIST}
        sections={SECTIONS_DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ section: { renderItem } }: any) => renderItem}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section: { title, titleIcon, shouldRenderTitle } }) =>
          shouldRenderTitle ? (
            <View
              style={[
                styles.sectionTitleWrapper,
                flexboxStyles.directionRow,
                flexboxStyles.alignCenter
              ]}
            >
              {!!titleIcon && titleIcon}
              <Title hasBottomSpacing={false} style={flexboxStyles.flex1}>
                {title}
              </Title>
            </View>
          ) : null
        }
      />
    </GradientBackgroundWrapper>
  )
}

export default TransactionsScreen
