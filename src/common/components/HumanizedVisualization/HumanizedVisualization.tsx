import React, { FC, memo } from 'react'
import { Linking, Pressable, View } from 'react-native'

import { Network, NetworkId } from '@ambire-common/interfaces/network'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import InfoIcon from '@common/assets/svg/InfoIcon'
import Address from '@common/components/Address'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import TokenOrNft from '@common/components/TokenOrNft'
import spacings, { SPACING_SM, SPACING_TY } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { getMessageAsText } from '@common/utils/messageToString'

import DeadlineItem from './DeadlineItem'

const visualizeContent = (kind: string, content?: string | Uint8Array) => {
  if ((kind === 'message' && !content) || content === '0x') {
    return 'Empty message '
  }
  return `${getMessageAsText(content).replace('\n', '')} `
}
interface Props {
  data: IrCall['fullVisualization']
  sizeMultiplierSize?: number
  textSize?: number
  networkId: NetworkId
  isHistory?: boolean
  testID?: string
  networks: Network[]
}

const HumanizedVisualization: FC<Props> = ({
  data = [],
  sizeMultiplierSize = 1,
  textSize = 16,
  networkId,
  isHistory,
  testID,
  networks
}) => {
  const marginRight = SPACING_TY * sizeMultiplierSize
  return (
    <View
      testID={testID}
      style={[
        flexbox.flex1,
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.wrap,
        {
          marginHorizontal: SPACING_SM * sizeMultiplierSize
        }
      ]}
    >
      {data.map((item) => {
        if (!item || item.isHidden) return null
        const key = item.id
        if (item.type === 'token' && item.value) {
          return (
            <TokenOrNft
              key={key}
              sizeMultiplierSize={sizeMultiplierSize}
              value={item.value}
              address={item.address!}
              textSize={textSize}
              networkId={networkId}
            />
          )
        }

        if (item.type === 'address' && item.address) {
          return (
            <View key={key} style={{ marginRight }}>
              <Address
                fontSize={textSize}
                address={item.address}
                highestPriorityAlias={item?.humanizerMeta?.name}
                explorerNetworkId={networkId}
              />
            </View>
          )
        }

        if (item.type === 'deadline' && item.value && !isHistory)
          return (
            <DeadlineItem
              key={key}
              deadline={item.value}
              textSize={textSize}
              marginRight={marginRight}
            />
          )
        if (item.type === 'chain' && item.chainId) {
          const foundChain = networks.find((n) => n.chainId === item.chainId)

          return (
            <View key={key} style={{ ...flexbox.directionRow, ...flexbox.alignCenter }}>
              {foundChain ? (
                <>
                  <NetworkIcon id={foundChain.id} benzinNetwork={foundChain} />
                  <Text
                    onPress={() => Linking.openURL(`https://chainlist.org/chain/${item.chainId}`)}
                    weight="semiBold"
                  >
                    {foundChain.name}
                  </Text>
                </>
              ) : (
                <Text
                  onPress={() => Linking.openURL(`https://chainlist.org/chain/${item.chainId}`)}
                  weight="semiBold"
                >
                  {`Chain with id ${item.chainId}`}
                </Text>
              )}
              <Pressable
                style={spacings.mlMi}
                onPress={() => Linking.openURL(`https://chainlist.org/chain/${item.chainId}`)}
              >
                <InfoIcon width={14} height={14} />
              </Pressable>
            </View>
          )
        }

        if (item.type === 'message' && item.messageContent) {
          return (
            <Text key={key} fontSize={16} weight="medium" appearance="primaryText">
              {visualizeContent('message', item.messageContent)}
            </Text>
          )
        }
        if (item.content) {
          return (
            <Text
              key={key}
              style={{ maxWidth: '100%', marginRight }}
              fontSize={textSize}
              weight={
                item.type === 'label' ? 'regular' : item.type === 'action' ? 'semiBold' : 'medium'
              }
              appearance={
                item.type === 'label'
                  ? 'secondaryText'
                  : item.type === 'action'
                  ? 'successText'
                  : 'primaryText'
              }
            >
              {item.content}
            </Text>
          )
        }

        return null
      })}
    </View>
  )
}

export default memo(HumanizedVisualization)
