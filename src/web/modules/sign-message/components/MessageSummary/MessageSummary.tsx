import React from 'react'
import { View } from 'react-native'

import { NetworkId } from '@ambire-common/interfaces/network'
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
}

const MessageSummary = ({ message, networkId }: Props) => {
  return (
    <ExpandableCard
      hasArrow={false}
      content={
        <HumanizedVisualization
          data={message.fullVisualization}
          networkId={networkId || 'ethereum'}
        />
      }
    />
  )
}

export default React.memo(MessageSummary)
