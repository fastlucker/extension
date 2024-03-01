import { formatUnits } from 'ethers'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { IrMessage } from '@ambire-common/libs/humanizer/interfaces'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import useTheme from '@common/hooks/useTheme'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'
import { getMessageAsText } from '@web/modules/sign-message/utils'

import getStyles from './styles'

const visualizeContent = (kind: string, content?: string) => {
  if ((kind === 'message' && content === '') || content === '0x') {
    return ' Empty message '
  }

  return ` ${getMessageAsText(content).replace('\n', '')} `
}

const HumanizedVisualization: FC<{
  data: IrMessage['fullVisualization']
  networkId?: NetworkDescriptor['id']
  explorerUrl?: NetworkDescriptor['explorerUrl']
  kind: string
}> = ({ kind, data = [], networkId, explorerUrl }) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const [bindOpenIconAnim, openIconAnimStyle] = useHover({
    preset: 'opacityInverted'
  })

  return (
    <View style={styles.headerContent}>
      {data.map((item) => {
        if (!item) return null

        if (item.type === 'token') {
          return (
            <>
              {!!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                <Text fontSize={16} weight="medium">
                  {` ${formatUnits(
                    item.amount || '0x0',
                    item?.humanizerMeta?.token?.decimals || 18
                  )} `}
                </Text>
              ) : null}

              {item.address ? (
                <TokenIcon width={24} height={24} networkId={networkId} address={item.address} />
              ) : null}
              {item?.humanizerMeta?.token?.symbol ? (
                <Text fontSize={16} weight="medium">
                  {` ${item?.humanizerMeta?.token?.symbol || ''} `}
                </Text>
              ) : !!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                <Text fontSize={16} weight="medium">
                  {t(' units of unknown token ')}
                </Text>
              ) : null}
            </>
          )
        }

        if (item.type === 'address')
          return (
            <>
              <Text fontSize={16} weight="medium">
                {` ${item?.humanizerMeta?.name ? item?.humanizerMeta?.name : item.address} `}
              </Text>
              {!!item.address && !!explorerUrl && (
                <AnimatedPressable
                  disabled={!explorerUrl}
                  onPress={() => {
                    Linking.openURL(`${explorerUrl}/address/${item.address}`)
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={openIconAnimStyle}
                  {...bindOpenIconAnim}
                >
                  <OpenIcon width={14} height={14} strokeWidth="2" />
                </AnimatedPressable>
              )}
            </>
          )

        if (item.content) {
          return (
            <Text
              fontSize={16}
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
              {visualizeContent(kind, item.content)}
            </Text>
          )
        }

        return null
      })}
    </View>
  )
}

export default HumanizedVisualization
