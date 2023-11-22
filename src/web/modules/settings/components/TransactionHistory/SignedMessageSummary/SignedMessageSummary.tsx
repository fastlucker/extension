import React from 'react'
import { View, ViewStyle } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { SignedMessage } from '@ambire-common/interfaces/userRequest'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import ExpandableCard from '@common/components/ExpandableCard'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import ManifestImage from '@web/components/ManifestImage'

import getStyles from './styles'

interface Props {
  signedMessage: SignedMessage
  style?: ViewStyle
}

const SignedMessageSummary = ({ signedMessage, style }: Props) => {
  const { styles } = useTheme(getStyles)

  return (
    <ExpandableCard
      arrowPosition="right"
      style={style}
      content={
        <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
          <View style={[flexbox.alignCenter, flexbox.directionRow, flexbox.flex1]}>
            <ManifestImage
              uri={signedMessage?.dapp?.icon || ''}
              size={32}
              fallback={() => <ManifestFallbackIcon />}
            />
            <Text style={spacings.plTy} fontSize={16} weight="semiBold">
              {signedMessage.dapp?.name || 'Unknown dApp'}
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
            Raw message:
          </Text>
          <Text appearance="secondaryText" fontSize={14} weight="regular">
            {JSON.stringify(signedMessage.content, null, 4)}
          </Text>
        </ScrollView>
      }
    />
  )
}

export default React.memo(SignedMessageSummary)
