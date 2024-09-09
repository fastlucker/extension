import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, View } from 'react-native'

import { ENTRY_POINT_AUTHORIZATION_REQUEST_ID } from '@ambire-common/libs/userOperation/userOperation'
import DAppsIcon from '@common/assets/svg/DAppsIcon'
import Address from '@common/components/Address'
import NetworkBadge from '@common/components/NetworkBadge'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'

import getStyles from './styles'

interface Props {
  kindOfMessage?: 'typedMessage' | 'message'
}

const linkToSupportPage = () => {
  Linking.openURL('https://help.ambire.com/hc/en-us').catch(console.log)
}

const Info: FC<Props> = () => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const { dapp, messageToSign } = useSignMessageControllerState()

  return (
    <View style={[styles.container, maxWidthSize('xl') ? spacings.mbXl : spacings.mbMd]}>
      {(!messageToSign || messageToSign.fromActionId !== ENTRY_POINT_AUTHORIZATION_REQUEST_ID) && (
        <View style={spacings.mbMd}>
          {dapp?.icon ? (
            <Image source={{ uri: dapp?.icon }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={styles.fallbackIcon}>
              <DAppsIcon style={{ width: '100%', height: '100%' }} />
            </View>
          )}
          <View style={[flexbox.flex1, spacings.ptSm]}>
            <Text
              fontSize={maxWidthSize('xl') ? 20 : 16}
              appearance="secondaryText"
              weight="semiBold"
            >
              {dapp?.name || t('The dApp')}
            </Text>
            <Text fontSize={maxWidthSize('xl') ? 16 : 14} appearance="secondaryText">
              {t('is requesting your signature ')}
            </Text>
          </View>
        </View>
      )}
      {messageToSign?.content?.kind === 'typedMessage' &&
        messageToSign?.fromActionId !== ENTRY_POINT_AUTHORIZATION_REQUEST_ID &&
        messageToSign?.content?.domain?.verifyingContract &&
        typeof messageToSign?.content?.domain?.verifyingContract === 'string' && (
          <View style={styles.verifyingContract}>
            <Address
              fontSize={maxWidthSize('xl') ? 14 : 12}
              style={{ maxWidth: '100%' }}
              address={messageToSign.content.domain.verifyingContract}
              explorerNetworkId={messageToSign.networkId}
            />
            <Text fontSize={12} appearance="secondaryText">
              {t('Will verify this signature')}
            </Text>
          </View>
        )}

      {(!messageToSign || messageToSign.fromActionId === ENTRY_POINT_AUTHORIZATION_REQUEST_ID) && (
        <>
          <Text
            style={spacings.mbMd}
            fontSize={maxWidthSize('xl') ? 24 : 20}
            appearance="secondaryText"
            weight="medium"
          >
            {t('Entry point authorization')}
          </Text>
          <NetworkBadge withOnPrefix style={spacings.mbMd} networkId={messageToSign?.networkId} />
          <Text
            style={spacings.mbMd}
            fontSize={maxWidthSize('xl') ? 16 : 14}
            appearance="secondaryText"
          >
            {t(
              'This is your first smart account transaction. In order to proceed, you must grant privileges to a smart contract called "Entry point". The Entry point is responsible for safely executing smart account transactions. This is a normal procedure and we ask all our smart account users to grant these privileges'
            )}
          </Text>
          <Text fontSize={maxWidthSize('xl') ? 16 : 14} appearance="secondaryText">
            {t('If you still have any doubts, please ')}
            <Text
              fontSize={maxWidthSize('xl') ? 16 : 14}
              style={{ color: theme.primary, textDecorationLine: 'underline' }}
              onPress={linkToSupportPage}
            >
              {t('contact support.')}
            </Text>
          </Text>
        </>
      )}
    </View>
  )
}

export default React.memo(Info)
