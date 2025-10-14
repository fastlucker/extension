import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import NetworkBadge from '@common/components/NetworkBadge'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'
import HardwareWalletSigningModal from '@web/modules/hardware-wallet/components/HardwareWalletSigningModal'
import LedgerConnectModal from '@web/modules/hardware-wallet/components/LedgerConnectModal'
import Info from '@web/modules/sign-message/screens/SignMessageScreen/Info'
import getStyles from '@web/modules/sign-message/screens/SignMessageScreen/styles'

interface Props {
  shouldDisplayLedgerConnectModal: boolean
  isLedgerConnected: boolean
  handleDismissLedgerConnectModal: () => void
}

const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text weight="medium" fontSize={14} appearance="primaryText">
      {children}
    </Text>
  )
}

const Value = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text appearance="secondaryText" fontSize={14}>
      {children}
    </Text>
  )
}

const Row = ({ children }: { children: React.ReactNode }) => {
  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.justifySpaceBetween,
        flexbox.alignCenter,
        spacings.mbSm
      ]}
    >
      {children}
    </View>
  )
}

const SignInWithEthereum = ({
  shouldDisplayLedgerConnectModal,
  isLedgerConnected,
  handleDismissLedgerConnectModal
}: Props) => {
  const { t } = useTranslation()
  const signMessageState = useSignMessageControllerState()
  const signStatus = signMessageState.statuses.sign
  const { styles } = useTheme(getStyles)
  const { theme } = useTheme()
  const { networks } = useNetworksControllerState()
  const { dispatch } = useBackgroundService()

  const siweMessageToSign = useMemo(() => {
    if (signMessageState.messageToSign?.content.kind === 'siwe') {
      return signMessageState.messageToSign.content
    }

    return null
  }, [signMessageState.messageToSign])
  const isAutoLoginEnabledByUser = siweMessageToSign?.isAutoLoginEnabledByUser || false

  const network = useMemo(
    () =>
      networks.find((n) => {
        return siweMessageToSign?.parsedMessage?.chainId
          ? n.chainId.toString() === String(siweMessageToSign.parsedMessage.chainId)
          : n.chainId === signMessageState.messageToSign?.chainId
      }),
    [networks, siweMessageToSign?.parsedMessage?.chainId, signMessageState.messageToSign?.chainId]
  )

  const rows = useMemo(() => {
    const parsedMessageContent = siweMessageToSign?.parsedMessage
    if (!parsedMessageContent) return []

    return [
      {
        label: 'URL',
        value: parsedMessageContent.uri
      },
      {
        label: 'Network',
        value: parsedMessageContent.domain
      },
      {
        label: 'Account',
        value: parsedMessageContent.address
      },
      {
        label: 'Version',
        value: parsedMessageContent.version
      },
      {
        label: 'Chain ID',
        value: network ? `${network.chainId} (${network.name})` : parsedMessageContent.chainId
      },
      {
        label: 'Nonce',
        value: parsedMessageContent.nonce
      },
      {
        label: 'Issued',
        value: parsedMessageContent.issuedAt?.toLocaleString()
      },
      {
        label: 'Resources',
        value: parsedMessageContent.resources
      }
    ].filter((row) => !!row.value)
  }, [network, siweMessageToSign?.parsedMessage])

  const updateIsAutoLoginEnabled = (enabled: boolean) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_MESSAGE_UPDATE',
      params: {
        isAutoLoginEnabledByUser: enabled
      }
    })
  }

  // @TODO: Error handling
  if (!siweMessageToSign) return null

  return (
    <TabLayoutWrapperMainContent style={spacings.mbLg}>
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          flexbox.justifySpaceBetween,
          spacings.mbXl
        ]}
      >
        <View style={[flexbox.directionRow, flexbox.alignCenter]}>
          <Text weight="medium" fontSize={24} style={[spacings.mrSm]}>
            {t('Sign-in request')}
          </Text>
        </View>
        <NetworkBadge chainId={signMessageState.messageToSign?.chainId} withOnPrefix />
        {/* @TODO: Replace with Badge; add size prop to badge; add tooltip  */}
      </View>
      <View style={styles.container}>
        <View style={spacings.mbLg}>
          <Info />
        </View>
        <View
          style={[
            spacings.pvSm,
            spacings.phSm,
            spacings.mb,
            {
              backgroundColor: theme.primaryBackground,
              borderWidth: 1,
              borderColor: theme.secondaryBorder,
              borderRadius: BORDER_RADIUS_PRIMARY
            }
          ]}
        >
          <View style={spacings.mbSm}>
            <Label>{t('Message')}</Label>
            <Value>{siweMessageToSign.parsedMessage.statement}</Value>
          </View>
          {rows.map((row) => (
            <Row key={row.label}>
              <Label>{t(row.label)}</Label>
              <Value>{row.value}</Value>
            </Row>
          ))}
        </View>
        {siweMessageToSign.autoLoginStatus !== 'unsupported' && (
          <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifyEnd]}>
            <Toggle isOn={isAutoLoginEnabledByUser} onToggle={updateIsAutoLoginEnabled} />

            <Text fontSize={14} appearance="secondaryText" style={spacings.mrSm}>
              {t('Auto-login on this network for the next 24 hours')}
            </Text>
          </View>
        )}
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

export default React.memo(SignInWithEthereum)
