import React from 'react'
import { View } from 'react-native'

import { Network, NetworkId } from '@ambire-common/interfaces/network'
import { IrMessage } from '@ambire-common/libs/humanizer/interfaces'
import ExpandableCard from '@common/components/ExpandableCard'
import HumanizedVisualization from '@common/components/HumanizedVisualization'
import useTheme from '@common/hooks/useTheme'
import FallbackVisualization from '@web/modules/sign-message/screens/SignMessageScreen/FallbackVisualization'

import getStyles from './styles'

interface Props {
  message: IrMessage
  kind: IrMessage['content']['kind']
  networkId?: NetworkId
  network?: Network
}

const MessageSummary = ({ message, networkId, kind, network }: Props) => {
  const { styles } = useTheme(getStyles)
  const isTypedMessage = kind === 'typedMessage'

  return (
    <ExpandableCard
      enableExpand={isTypedMessage}
      hasArrow={isTypedMessage}
      content={
        <HumanizedVisualization
          data={message.fullVisualization}
          networkId={networkId || 'ethereum'}
          network={network}
        />
      }
      expandedContent={
        <View style={[styles.rawMessage]}>
          <FallbackVisualization messageToSign={message} />
        </View>
      }
    />
  )
}

export default React.memo(MessageSummary)
