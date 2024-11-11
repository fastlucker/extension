import React, { FC, memo } from 'react'
import { View } from 'react-native'

import { NetworkId } from '@ambire-common/interfaces/network'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import Address from '@common/components/Address'
import Text from '@common/components/Text'
import TokenOrNft from '@common/components/TokenOrNft'
import useTheme from '@common/hooks/useTheme'
import spacings, { SPACING_SM, SPACING_TY } from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { getMessageAsText } from '@common/utils/messageToString'
import ImageIcon from '@web/assets/svg/ImageIcon'
import ManifestImage from '@web/components/ManifestImage'

import { COLLECTIBLE_SIZE } from '../Collectible/styles'
import ChainVisualization from './ChainVisualization/ChainVisualization'
import DeadlineItem from './DeadlineItem'

export const visualizeContent = (kind: string, content?: string | Uint8Array) => {
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
}

const HumanizedVisualization: FC<Props> = ({
  data = [],
  sizeMultiplierSize = 1,
  textSize = 16,
  networkId,
  isHistory,
  testID
}) => {
  const marginRight = SPACING_TY * sizeMultiplierSize
  const { theme } = useTheme()
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
        if (item.type === 'token') {
          return (
            <TokenOrNft
              key={key}
              sizeMultiplierSize={sizeMultiplierSize}
              value={item.value}
              address={item.address!}
              textSize={textSize}
              chainId={item.chainId}
              networkId={networkId}
            />
          )
        }

        if (item.type === 'address' && item.address) {
          return (
            <View key={key} style={{ marginRight }}>
              <Address fontSize={textSize} address={item.address} explorerNetworkId={networkId} />
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
        if (item.type === 'chain' && item.chainId)
          return <ChainVisualization chainId={item.chainId} key={key} marginRight={marginRight} />

        if (item.type === 'message' && item.messageContent) {
          return (
            <Text key={key} fontSize={16} weight="medium" appearance="primaryText">
              {visualizeContent('message', item.messageContent)}
            </Text>
          )
        }
        if (item.type === 'image' && item.content) {
          return (
            <ManifestImage
              uri={item.content}
              containerStyle={spacings.mrSm}
              size={36}
              skeletonAppearance="primaryBackground"
              fallback={() => (
                <View
                  style={[
                    flexbox.flex1,
                    flexbox.center,
                    { backgroundColor: theme.primaryBackground, width: '100%' }
                  ]}
                >
                  <ImageIcon
                    color={theme.secondaryText}
                    width={COLLECTIBLE_SIZE / 2}
                    height={COLLECTIBLE_SIZE / 2}
                  />
                </View>
              )}
              imageStyle={{
                borderRadius: BORDER_RADIUS_PRIMARY,
                backgroundColor: 'transparent',
                marginRight: 0
              }}
            />
          )
        }
        if (item.type === 'link') {
          return (
            <a style={{ maxWidth: '100%', marginRight }} key={key} href={item.url!}>
              <Text fontSize={textSize} weight="semiBold" appearance="successText">
                {item.content}
              </Text>
            </a>
          )
        }
        if (item.content) {
          return (
            <Text
              key={key}
              style={{ maxWidth: '100%', marginRight }}
              fontSize={textSize}
              weight={item.isBold || item.type === 'action' ? 'semiBold' : 'regular'}
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
