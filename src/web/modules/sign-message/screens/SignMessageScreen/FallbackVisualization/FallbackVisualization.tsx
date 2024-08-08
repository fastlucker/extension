import { FC, memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeScrollEvent, Pressable, ScrollView, View } from 'react-native'

import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import { isValidAddress } from '@ambire-common/services/address'
import ErrorOutlineIcon from '@common/assets/svg/ErrorOutlineIcon'
import Address from '@common/components/Address'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import { getMessageAsText, simplifyTypedMessage } from '@common/utils/messageToString'

import getStyles from './styles'

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
}

const FallbackVisualization: FC<{
  messageToSign: SignMessageController['messageToSign']
  setHasReachedBottom: (hasReachedBottom: boolean) => void
  standalone: boolean
}> = ({ messageToSign, setHasReachedBottom, standalone }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const [containerHeight, setContainerHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const [showRawTypedMessage, setShowRawTypedMessage] = useState(false)
  useEffect(() => {
    if (!messageToSign || !containerHeight || !contentHeight) return
    const isScrollNotVisible = contentHeight < containerHeight

    setHasReachedBottom(isScrollNotVisible)
  }, [contentHeight, containerHeight, setHasReachedBottom, messageToSign, showRawTypedMessage])
  if (!messageToSign) return null

  const { content } = messageToSign

  return (
    <>
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setShowRawTypedMessage(false)}
          style={[styles.tab, !showRawTypedMessage && styles.activeTab]}
        >
          <Text fontSize={14} appearance={!showRawTypedMessage ? 'primaryText' : 'secondaryText'}>
            {t('Parsed')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setShowRawTypedMessage(true)}
          style={[styles.tab, showRawTypedMessage && styles.activeTab]}
        >
          <Text fontSize={14} appearance={showRawTypedMessage ? 'primaryText' : 'secondaryText'}>
            {t('Raw')}
          </Text>
        </Pressable>
      </View>
      <View style={[styles.container, standalone && styles.standalone]}>
        {standalone && (
          <View style={styles.header}>
            <ErrorOutlineIcon width={24} height={24} />
            <Text style={styles.headerText}>
              <Text
                fontSize={maxWidthSize('xl') ? 14 : 12}
                appearance="warningText"
                weight="semiBold"
              >
                {t('Warning: ')}
              </Text>
              <Text fontSize={maxWidthSize('xl') ? 14 : 12} appearance="warningText">
                {t(
                  "We are not able to decode this message for your convenience, and it's presented in the original format."
                )}
              </Text>
            </Text>
          </View>
        )}
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
          <Text
            selectable
            weight="regular"
            fontSize={maxWidthSize('xl') ? 14 : 12}
            appearance="secondaryText"
            style={spacings.mb}
          >
            {content.kind === 'typedMessage'
              ? showRawTypedMessage
                ? JSON.stringify(content, null, 4)
                : simplifyTypedMessage(content.message).map((i) => (
                    <div key={JSON.stringify(i)}>
                      <Text style={i.type === 'key' ? { fontWeight: 'bold' } : {}}>
                        {'    '.repeat(i.n)}
                        {isValidAddress(i.value) ? <Address address={i.value} /> : i.value}
                      </Text>
                    </div>
                  ))
              : getMessageAsText(content.message) || t('(Empty message)')}
          </Text>
        </ScrollView>
      </View>
    </>
  )
}

export default memo(FallbackVisualization)
