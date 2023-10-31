import React, { useEffect, useState } from 'react'
import { NativeScrollEvent, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { IrMessage } from '@ambire-common/libs/humanizer/interfaces'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'

import HumanizedVisualization from '../HumanizedVisualization'
import getStyles from './styles'

interface Props {
  message: IrMessage
  networkId?: NetworkDescriptor['id']
  explorerUrl?: NetworkDescriptor['explorerUrl']
  kind: IrMessage['content']['kind']
  setHasReachedBottom: (hasReachedBottom: boolean) => void
}

export function formatFloatTokenAmount(
  amount: any,
  useGrouping = true,
  maximumFractionDigits = 18
) {
  if (
    Number.isNaN(amount) ||
    Number.isNaN(parseFloat(amount)) ||
    !(typeof amount === 'number' || typeof amount === 'string')
  )
    return amount

  try {
    const minimumFractionDigits = Math.min(2, maximumFractionDigits || 0)
    return (typeof amount === 'number' ? amount : parseFloat(amount)).toLocaleString(undefined, {
      useGrouping,
      maximumFractionDigits: Math.max(minimumFractionDigits, maximumFractionDigits),
      minimumFractionDigits
    })
  } catch (err) {
    console.error(err)
    return amount
  }
}

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize
}: NativeScrollEvent) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
}

const MessageSummary = ({ message, networkId, explorerUrl, kind, setHasReachedBottom }: Props) => {
  const { styles } = useTheme(getStyles)
  const [containerHeight, setContainerHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const isTypedMessage = kind === 'typedMessage'

  useEffect(() => {
    const isScrollNotVisible = contentHeight < containerHeight

    setHasReachedBottom(isScrollNotVisible)
  }, [contentHeight, containerHeight, setHasReachedBottom])

  return (
    <View style={[styles.container, isTypedMessage ? { flex: 1 } : {}]}>
      <View style={styles.header}>
        <HumanizedVisualization
          data={message.fullVisualization}
          networkId={networkId}
          explorerUrl={explorerUrl}
          kind={kind}
        />
      </View>
      {isTypedMessage && (
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
          contentContainerStyle={styles.rawMessage}
        >
          <Text
            appearance="secondaryText"
            fontSize={14}
            weight="regular"
            style={styles.rawMessageTitle}
          >
            Raw message:
          </Text>
          <Text appearance="secondaryText" fontSize={14} weight="regular">
            {JSON.stringify(message.content, null, 4)}
          </Text>
        </ScrollView>
      )}
    </View>
  )
}

export default React.memo(MessageSummary)
