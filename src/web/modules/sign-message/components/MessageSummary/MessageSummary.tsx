import React from 'react'
import { ScrollView } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { IrMessage } from '@ambire-common/libs/humanizer/interfaces'
import ExpandableCard from '@common/components/ExpandableCard'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'

import HumanizedVisualization from '../HumanizedVisualization'
import getStyles from './styles'

interface Props {
  message: IrMessage
  networkId?: NetworkDescriptor['id']
  explorerUrl?: NetworkDescriptor['explorerUrl']
  kind: IrMessage['content']['kind']
}

const MessageSummary = ({ message, networkId, explorerUrl, kind }: Props) => {
  const { styles } = useTheme(getStyles)
  const isTypedMessage = kind === 'typedMessage'

  return (
    <ExpandableCard
      enableExpand={isTypedMessage}
      hasArrow={isTypedMessage}
      content={
        <HumanizedVisualization
          data={message.fullVisualization}
          networkId={networkId}
          explorerUrl={explorerUrl}
          kind={kind}
        />
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
          <Text selectable appearance="secondaryText" fontSize={14} weight="regular">
            {JSON.stringify(message.content, null, 4)}
          </Text>
        </ScrollView>
      }
    />
  )
}

export default React.memo(MessageSummary)
