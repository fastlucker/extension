import { formatUnits, MaxUint256 } from 'ethers'
import React, { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { networks as constantNetworks } from '@ambire-common/consts/networks'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import Address from '@common/components/Address'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import { SPACING_SM, SPACING_TY } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import { NFT_CDN_URL } from '@env'
import ManifestImage from '@web/components/ManifestImage'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

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
  const marginRight = SPACING_TY * sizeMultiplierSize
  const { t } = useTranslation()

  return (
    <View
      style={[
        flexbox.flex1,
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.wrap,
        {
          marginRight: SPACING_SM * sizeMultiplierSize
        }
      ]}
    >
      {data.map((item) => {
        if (!item || item.isHidden) return null
        const key = item.id
        if (item.type === 'token') {
          const isUnlimitedByPermit2 = item.amount!.toString(16).toLowerCase() === 'f'.repeat(40)
          const isMaxUint256 = item.amount === MaxUint256
          return (
            <View
              key={key}
              style={{ ...flexbox.directionRow, ...flexbox.alignCenter, marginRight }}
            >
              {!!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                <Text
                  fontSize={textSize}
                  weight="medium"
                  appearance="primaryText"
                  style={{ maxWidth: '100%', marginRight }}
                >
                  {isUnlimitedByPermit2 || isMaxUint256 ? (
                    <Text appearance="warningText">{t('unlimited')}</Text>
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
                  withNetworkIcon={false}
                  containerStyle={{ marginRight: marginRight / 2 }}
                />
              ) : null}
              {item?.humanizerMeta?.token ? (
                <Text fontSize={textSize} weight="medium" appearance="primaryText">
                  {item?.humanizerMeta?.token?.symbol || ''}
                </Text>
              ) : !!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                <Text
                  fontSize={textSize}
                  weight="medium"
                  appearance="primaryText"
                  style={{ maxWidth: '100%' }}
                >
                  {t('units of unknown token')}
                </Text>
              ) : (
                // there are cases where the humanizer would return token with amount = 0
                // still, not having humanizerMeta.token is bad
                <Text fontSize={textSize} weight="medium" appearance="primaryText">
                  {t('unknown token')}
                </Text>
              )}
            </View>
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

        if (item.type === 'nft') {
          const { networks: settingsNetworks } = useSettingsControllerState()
          const networks = settingsNetworks ?? constantNetworks
          const network = networks.find((n) => n.id === networkId)
          const imageUrl = `${NFT_CDN_URL}/proxy?rpc=${network?.rpcUrls[0]}&contract=${item.address}&id=${item.nftId}`
          return (
            <View
              style={[
                flexbox.directionRow,
                flexbox.wrap,
                {
                  marginRight: SPACING_SM * sizeMultiplierSize,
                  gap: '10px'
                }
              ]}
            >
              <Address
                fontSize={textSize}
                address={item.address}
                highestPriorityAlias={`NFT #${item.nftId}`}
                explorerNetworkId={networkId}
              />{' '}
              <ManifestImage uri={imageUrl} />
            </View>
          )
        }

        if (item.type === 'deadline' && !isHistory)
          return (
            <DeadlineItem
              key={key}
              deadline={item.amount!}
              textSize={textSize}
              marginRight={marginRight}
            />
          )
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
