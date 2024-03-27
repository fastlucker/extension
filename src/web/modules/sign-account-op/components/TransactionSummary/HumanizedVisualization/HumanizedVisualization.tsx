import { formatUnits, MaxUint256 } from 'ethers'
import React, { FC, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import Address from '@common/components/Address'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import { SPACING_SM } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'

import DeadlineItem from './DeadlineItem'

interface Props {
  data: IrCall['fullVisualization']
  sizeMultiplierSize: number
  textSize: number
  networkId: NetworkDescriptor['id']
  isHistory?: boolean
}

const HumanizedVisualization: FC<Props> = ({
  data = [],
  sizeMultiplierSize,
  textSize,
  networkId,
  isHistory
}) => {
  const { t } = useTranslation()

  return (
    <View
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
      {data.map((item, i) => {
        if (!item || item.isHidden) return null

        if (item.type === 'token') {
          const isUnlimitedByPermit2 = item.amount!.toString(16).toLowerCase() === 'f'.repeat(40)
          const isMaxUint256 = item.amount === MaxUint256
          return (
            <Fragment key={Number(item.id) || i}>
              {!!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                <Text
                  fontSize={textSize}
                  weight="medium"
                  appearance="primaryText"
                  style={{ maxWidth: '100%' }}
                >
                  {isUnlimitedByPermit2 || isMaxUint256 ? (
                    <Text appearance="warningText">unlimited </Text>
                  ) : (
                    formatDecimals(
                      Number(
                        formatUnits(item.amount || '0x0', item?.humanizerMeta?.token?.decimals || 1)
                      )
                    )
                  )}
                </Text>
              ) : null}

              {item.address ? (
                <TokenIcon
                  width={24 * sizeMultiplierSize}
                  height={24 * sizeMultiplierSize}
                  networkId={networkId}
                  address={item.address}
                />
              ) : null}
              {item?.humanizerMeta?.token ? (
                <Text fontSize={textSize} weight="medium" appearance="primaryText">
                  {` ${item?.humanizerMeta?.token?.symbol || ''} `}
                </Text>
              ) : !!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                <Text
                  fontSize={textSize}
                  weight="medium"
                  appearance="primaryText"
                  style={{ maxWidth: '100%' }}
                >
                  {t(' units of unknown token ')}
                </Text>
              ) : (
                // there are cases where the humanizer would return token with amount = 0
                // still, not having humanizerMeta.token is bad
                <Text fontSize={textSize} weight="medium" appearance="primaryText">
                  {t('unknown token ')}
                </Text>
              )}
            </Fragment>
          )
        }

        if (item.type === 'address' && item.address) {
          return (
            <Address
              fontSize={textSize}
              address={item.address}
              highestPriorityAlias={item?.humanizerMeta?.name}
              explorerNetworkId={networkId}
            />
          )
        }

        if (item.type === 'nft') {
          return (
            <Text
              key={Number(item.id) || i}
              fontSize={textSize}
              weight="medium"
              appearance="primaryText"
              style={{ maxWidth: '100%' }}
            >
              {` ${item?.humanizerMeta?.name || item.address} `}
            </Text>
          )
        }

        if (item.type === 'deadline' && !isHistory)
          return (
            <DeadlineItem key={Number(item.id) || i} deadline={item.amount!} textSize={textSize} />
          )
        if (item.content) {
          return (
            <Text
              key={Number(item.id) || i}
              style={{ maxWidth: '100%' }}
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
            >{` ${item.content} `}</Text>
          )
        }

        return null
      })}
    </View>
  )
}

export default HumanizedVisualization
