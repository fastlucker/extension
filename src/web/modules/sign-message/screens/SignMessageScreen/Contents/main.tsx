import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { humanizeMessage } from '@ambire-common/libs/humanizer'
import ErrorOutlineIcon from '@common/assets/svg/ErrorOutlineIcon'
import Alert from '@common/components/Alert'
import ExpandableCard from '@common/components/ExpandableCard'
import HumanizedVisualization from '@common/components/HumanizedVisualization'
import NetworkBadge from '@common/components/NetworkBadge'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'
import HardwareWalletSigningModal from '@web/modules/hardware-wallet/components/HardwareWalletSigningModal'
import LedgerConnectModal from '@web/modules/hardware-wallet/components/LedgerConnectModal'
import FallbackVisualization from '@web/modules/sign-message/screens/SignMessageScreen/FallbackVisualization'
import Info from '@web/modules/sign-message/screens/SignMessageScreen/Info'
import getStyles from '@web/modules/sign-message/screens/SignMessageScreen/styles'

interface Props {
  shouldDisplayLedgerConnectModal: boolean
  isLedgerConnected: boolean
  handleDismissLedgerConnectModal: () => void
  hasReachedBottom: boolean | null
  setHasReachedBottom: Dispatch<SetStateAction<boolean | null>>
  shouldDisplayEIP1271Warning: boolean
}

const Main = ({
  shouldDisplayLedgerConnectModal,
  isLedgerConnected,
  handleDismissLedgerConnectModal,
  hasReachedBottom,
  setHasReachedBottom,
  shouldDisplayEIP1271Warning
}: Props) => {
  const { t } = useTranslation()
  const signMessageState = useSignMessageControllerState()
  const signStatus = signMessageState.statuses.sign
  const { styles, theme } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const { networks } = useNetworksControllerState()
  const network = useMemo(
    () =>
      networks.find((n) => {
        return signMessageState.messageToSign?.content.kind === 'typedMessage' &&
          signMessageState.messageToSign?.content.domain.chainId
          ? n.chainId.toString() === signMessageState.messageToSign?.content.domain.chainId
          : n.chainId === signMessageState.messageToSign?.chainId
      }),
    [networks, signMessageState.messageToSign]
  )
  const humanizedMessage = useMemo(() => {
    if (!signMessageState?.messageToSign) return
    return humanizeMessage(signMessageState.messageToSign)
  }, [signMessageState])
  const visualizeHumanized = useMemo(
    () =>
      humanizedMessage?.fullVisualization &&
      network &&
      signMessageState.messageToSign?.content.kind,
    [network, humanizedMessage, signMessageState.messageToSign?.content?.kind]
  )

  return (
    <TabLayoutWrapperMainContent style={spacings.mbLg} contentContainerStyle={spacings.pvXl}>
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          flexbox.justifySpaceBetween,
          spacings.mbLg
        ]}
      >
        <View style={[flexbox.directionRow, flexbox.alignCenter]}>
          <Text weight="medium" fontSize={24} style={[spacings.mrSm]}>
            {t('Sign message')}
          </Text>
          <NetworkBadge
            style={{ borderRadius: 25, ...spacings.pv0 }}
            chainId={signMessageState.messageToSign?.chainId}
            withOnPrefix
          />
        </View>
        {/* @TODO: Replace with Badge; add size prop to badge; add tooltip  */}
        <View style={styles.kindOfMessage}>
          <Text fontSize={12} color={theme.infoText} numberOfLines={1}>
            {signMessageState.messageToSign?.content.kind === 'typedMessage' && t('EIP-712')}
            {signMessageState.messageToSign?.content.kind === 'message' && t('Standard')}
            {signMessageState.messageToSign?.content.kind === 'authorization-7702' &&
              t('EIP-7702')}{' '}
            {t('Type')}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={[styles.leftSideContainer, !maxWidthSize('m') && { flexBasis: '40%' }]}>
          <Info />
          {shouldDisplayEIP1271Warning && (
            <Alert
              type="error"
              title="This app has been flagged to not support Smart Account signatures."
              text="If you encounter issues, please use a Basic Account and contact the app to resolve this."
            />
          )}
        </View>
        <View style={[styles.separator, maxWidthSize('xl') ? spacings.mh3Xl : spacings.mhXl]} />
        <View style={flexbox.flex1}>
          <ExpandableCard
            enableToggleExpand={!!visualizeHumanized}
            isInitiallyExpanded={!visualizeHumanized}
            hasArrow={!!visualizeHumanized}
            style={{ ...spacings.mbTy, maxHeight: '100%' }}
            content={
              visualizeHumanized &&
              // @TODO: Duplicate check. For some reason ts throws an error if we don't do this
              humanizedMessage?.fullVisualization &&
              signMessageState.messageToSign?.content.kind ? (
                <HumanizedVisualization
                  data={humanizedMessage.fullVisualization}
                  chainId={network?.chainId || 1n}
                />
              ) : (
                <>
                  <View style={spacings.mrTy}>
                    <ErrorOutlineIcon width={24} height={24} />
                  </View>
                  <Text fontSize={maxWidthSize('xl') ? 16 : 12} appearance="warningText">
                    <Text
                      fontSize={maxWidthSize('xl') ? 16 : 12}
                      appearance="warningText"
                      weight="semiBold"
                    >
                      {t('Warning: ')}
                    </Text>
                    {t('Please read the whole message as we are unable to translate it!')}
                  </Text>
                </>
              )
            }
            expandedContent={
              <FallbackVisualization
                setHasReachedBottom={setHasReachedBottom}
                hasReachedBottom={!!hasReachedBottom}
                messageToSign={signMessageState.messageToSign}
              />
            }
          />
        </View>
        {signMessageState.signingKeyType && signMessageState.signingKeyType !== 'internal' && (
          <HardwareWalletSigningModal
            keyType={signMessageState.signingKeyType}
            isVisible={signStatus === 'LOADING'}
          />
        )}
        {shouldDisplayLedgerConnectModal && (
          <LedgerConnectModal
            isVisible={!isLedgerConnected}
            handleOnConnect={handleDismissLedgerConnectModal}
            handleClose={handleDismissLedgerConnectModal}
            displayOptionToAuthorize={false}
          />
        )}
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default React.memo(Main)
