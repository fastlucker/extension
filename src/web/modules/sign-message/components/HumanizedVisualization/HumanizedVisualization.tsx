import { formatUnits, MaxUint256 } from 'ethers'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { NetworkId } from '@ambire-common/interfaces/network'
import { IrMessage } from '@ambire-common/libs/humanizer/interfaces'
import Address from '@common/components/Address'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import formatDecimals from '@common/utils/formatDecimals'
import { getMessageAsText } from '@web/modules/sign-message/utils'

import getStyles from './styles'

const visualizeContent = (kind: string, content?: string) => {
  if ((kind === 'message' && content === '') || content === '0x') {
    return ' Empty message '
  }

  return ` ${getMessageAsText(content).replace('\n', '')} `
}

// @TODO refactor to use the other component
const HumanizedVisualization: FC<{
  data: IrMessage['fullVisualization']
  networkId?: NetworkId
  kind: string
}> = ({ kind, data = [], networkId }) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()

  return (
    <View style={styles.headerContent}>
      {data.map((item) => {
        if (!item) return null
        const key = item.id

        if (item.type === 'token') {
          const isUnlimitedByPermit2 = item.amount!.toString(16).toLowerCase() === 'f'.repeat(40)
          const isMaxUint256 = item.amount === MaxUint256
          return (
            <React.Fragment key={key}>
              {!!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                <Text
                  weight="medium"
                  appearance="primaryText"
                  style={{ maxWidth: '100%', ...spacings.mrTy }}
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
                  width={24}
                  height={24}
                  networkId={networkId}
                  address={item.address}
                  withNetworkIcon={false}
                />
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
            </React.Fragment>
          )
        }

        if (item.type === 'address' && item.address)
          return (
            <Address
              fontSize={16}
              address={item.address}
              highestPriorityAlias={item?.humanizerMeta?.name}
              explorerNetworkId={networkId}
            />
          )

        if (item.content) {
          return (
            <Text
              key={key}
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
