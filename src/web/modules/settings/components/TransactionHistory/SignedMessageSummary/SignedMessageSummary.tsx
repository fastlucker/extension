import React, { useMemo } from 'react'
import { ScrollView, View, ViewStyle } from 'react-native'

import { SignedMessage } from '@ambire-common/controllers/activity/activity'
import { ENTRY_POINT_AUTHORIZATION_REQUEST_ID } from '@ambire-common/libs/userOperation/userOperation'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import ExpandableCard from '@common/components/ExpandableCard'
import { visualizeContent } from '@common/components/HumanizedVisualization/HumanizedVisualization'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import ManifestImage from '@web/components/ManifestImage'

import getStyles from './styles'

interface Props {
  signedMessage: SignedMessage
  style?: ViewStyle
}

const getParsedSignedMessageContent = (content: SignedMessage['content']) => {
  if (content.kind === 'message') {
    return visualizeContent(content.kind, content.message)
  }

  return JSON.stringify(content, null, 4)
}

const SignedMessageSummary = ({ signedMessage, style }: Props) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()

  const dAppName = useMemo(() => {
    if (signedMessage.fromActionId === ENTRY_POINT_AUTHORIZATION_REQUEST_ID) {
      return 'Entry Point Authorization'
    }

    return signedMessage.dapp?.name || 'Unknown App'
  }, [signedMessage.dapp?.name, signedMessage.fromActionId])

  return (
    <ExpandableCard
      arrowPosition="right"
      style={style}
      content={
        <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
          <View style={[flexbox.alignCenter, flexbox.directionRow, flexbox.flex1]}>
            {signedMessage.fromActionId !== ENTRY_POINT_AUTHORIZATION_REQUEST_ID && (
              <ManifestImage
                uri={signedMessage?.dapp?.icon || ''}
                size={32}
                fallback={() => <ManifestFallbackIcon />}
                containerStyle={spacings.mrTy}
              />
            )}
            <Text fontSize={16} weight="semiBold">
              {dAppName}
            </Text>
          </View>
          <View style={flexbox.flex1}>
            {new Date(signedMessage.timestamp).toString() !== 'Invalid Date' && (
              <Text fontSize={14} appearance="secondaryText">
                {`${new Date(signedMessage.timestamp).toLocaleDateString()} (${new Date(
                  signedMessage.timestamp
                ).toLocaleTimeString()})`}
              </Text>
            )}
          </View>
          <View style={flexbox.flex1}>
            <Text fontSize={14} appearance="secondaryText">
              {signedMessage.content.kind === 'message' ? 'Message' : 'Typed Data'}
            </Text>
          </View>
        </View>
      }
      expandedContent={
        <ScrollView contentContainerStyle={styles.rawMessage}>
          <Text
            appearance="secondaryText"
            fontSize={14}
            weight="regular"
            style={styles.rawMessageTitle}
          >
            {t('Raw message')}:
          </Text>
          <Text selectable appearance="secondaryText" fontSize={14} weight="regular">
            {getParsedSignedMessageContent(signedMessage.content)}
          </Text>
        </ScrollView>
      }
    />
  )
}

export default React.memo(SignedMessageSummary)
