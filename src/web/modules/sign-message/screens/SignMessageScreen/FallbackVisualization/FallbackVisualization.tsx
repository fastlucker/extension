import { FC, memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeScrollEvent, ScrollView, View } from 'react-native'

import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import ErrorOutlineIcon from '@common/assets/svg/ErrorOutlineIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { getMessageAsText } from '@common/utils/messageToString'

import getStyles from './styles'

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
}

const FallbackVisualization: FC<{
  messageToSign: SignMessageController['messageToSign']
  setHasReachedBottom: (hasReachedBottom: boolean) => void
}> = ({ messageToSign, setHasReachedBottom }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const [containerHeight, setContainerHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const isScrollNotVisible = contentHeight < containerHeight

    setHasReachedBottom(isScrollNotVisible)
  }, [contentHeight, containerHeight, setHasReachedBottom])
  if (!messageToSign) return null

  const { content } = messageToSign

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ErrorOutlineIcon width={24} height={24} />
        <Text style={styles.headerText}>
          <Text fontSize={16} appearance="warningText" weight="semiBold">
            Warning:{' '}
          </Text>
          <Text fontSize={16} appearance="warningText">
            We are not able to decode this message for your convenience, and it&apos;s presented in
            the original format
          </Text>
        </Text>
      </View>
      <ScrollView
        onScroll={(e) => {
          if (isCloseToBottom(e.nativeEvent)) setHasReachedBottom(true)
        }}
        onLayout={(e) => {
          setContainerHeight(e.nativeEvent.layout.height)
        }}
        onContentSizeChange={(_, height) => {
          setContentHeight(height)
        }}
        scrollEventThrottle={400}
      >
        <Text weight="regular" fontSize={14} appearance="secondaryText" style={spacings.mb}>
          Raw Message:
        </Text>
        <Text
          selectable
          weight="regular"
          fontSize={14}
          appearance="secondaryText"
          style={spacings.mb}
        >
          {content.kind === 'typedMessage'
            ? JSON.stringify(content.message, null, 4)
            : getMessageAsText(content.message) || t('(Empty message)')}
        </Text>
      </ScrollView>
    </View>
  )
}

export default memo(FallbackVisualization)
