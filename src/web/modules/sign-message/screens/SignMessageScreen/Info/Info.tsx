import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import { ENTRY_POINT_AUTHORIZATION_REQUEST_ID } from '@ambire-common/libs/userOperation/userOperation'
import InfoIcon from '@common/assets/svg/InfoIcon'
import Address from '@common/components/Address'
import Alert from '@common/components/Alert'
import NetworkBadge from '@common/components/NetworkBadge'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'

import getStyles from './styles'

interface Props {
  kindOfMessage?: 'typedMessage' | 'message'
  isViewOnly?: boolean
}

const Info: FC<Props> = ({ kindOfMessage, isViewOnly }) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const { dapp, messageToSign } = useSignMessageControllerState()

  const renderMessageTypeBadge = useCallback(
    (isHidden?: boolean) => {
      return (
        <View style={[styles.kindOfMessage, isHidden && { opacity: 0 }]}>
          <Text
            fontSize={12}
            color={theme.infoText}
            style={styles.kindOfMessageText}
            numberOfLines={1}
          >
            {kindOfMessage === 'typedMessage' ? 'EIP-712 ' : 'Standard '}
            {t('Type')}
          </Text>
          <InfoIcon width={18} height={18} color={theme.infoDecorative as string} />
        </View>
      )
    },
    [kindOfMessage, styles, theme, t]
  )

  return (
    <View style={[styles.container, maxWidthSize('xl') ? spacings.mbXl : spacings.mbMd]}>
      {(!messageToSign || messageToSign.fromActionId !== ENTRY_POINT_AUTHORIZATION_REQUEST_ID) && (
        <Image source={{ uri: dapp?.icon }} style={styles.image} resizeMode="contain" />
      )}
      <View style={[styles.content, maxWidthSize('xl') ? spacings.mbXl : spacings.mbMd]}>
        {renderMessageTypeBadge(true)}
        <View style={[flexbox.flex1, spacings.phLg, flexbox.alignCenter]}>
          {(!messageToSign ||
            messageToSign.fromActionId !== ENTRY_POINT_AUTHORIZATION_REQUEST_ID) && (
            <View style={[flexbox.directionRow, flexbox.alignCenter]}>
              <Text style={[text.center, spacings.mrTy]}>
                <Text
                  fontSize={maxWidthSize('xl') ? 20 : 16}
                  appearance="secondaryText"
                  weight="semiBold"
                >
                  {dapp?.name || t('The dApp')}
                </Text>
                <Text fontSize={maxWidthSize('xl') ? 20 : 16} appearance="secondaryText">
                  {t(' is requesting your signature on ')}
                  <NetworkBadge networkId={messageToSign?.networkId} />
                </Text>
              </Text>
            </View>
          )}
          {messageToSign?.content?.kind === 'typedMessage' &&
            messageToSign?.fromActionId !== ENTRY_POINT_AUTHORIZATION_REQUEST_ID &&
            messageToSign?.content?.domain?.verifyingContract &&
            typeof messageToSign?.content?.domain?.verifyingContract === 'string' && (
              <View style={[flexbox.directionRow, flexbox.justifyCenter]}>
                <Text fontSize={20} appearance="secondaryText">
                  {t('To be verified by ')}
                  <Address
                    fontSize={16}
                    address={messageToSign.content.domain.verifyingContract}
                    explorerNetworkId={messageToSign.networkId}
                  />
                </Text>
              </View>
            )}

          {(!messageToSign ||
            messageToSign.fromActionId === ENTRY_POINT_AUTHORIZATION_REQUEST_ID) && (
            <Text style={text.center}>
              <View style={spacings.mb}>
                <Text fontSize={maxWidthSize('xl') ? 20 : 16} appearance="secondaryText">
                  {t('Entry point authorization on ')}
                  <NetworkBadge networkId={messageToSign?.networkId} />
                </Text>
              </View>
              <View>
                <Text fontSize={maxWidthSize('xl') ? 16 : 14} appearance="secondaryText">
                  {t(
                    'This is your first smart account transaction. In order to proceed, you must grant privileges to a smart contract called "Entry point". The Entry point is responsible for safely executing smart account transactions. This is a normal procedure and we ask all our smart account users to grant these privileges. If you still have any doubts, please contact support'
                  )}
                </Text>
              </View>
            </Text>
          )}
        </View>
        {renderMessageTypeBadge()}
      </View>
      {!isViewOnly && (
        <Alert
          size={maxWidthSize('xl') ? 'md' : 'sm'}
          type="warning"
          text={t('Please, read the entire message before signing it.')}
        />
      )}
    </View>
  )
}

export default React.memo(Info)
