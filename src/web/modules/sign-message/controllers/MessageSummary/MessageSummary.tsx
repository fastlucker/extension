import { NetworkDescriptor } from 'ambire-common/src/interfaces/networkDescriptor'
import { IrMessage } from 'ambire-common/src/libs/humanizer/interfaces'
import { formatUnits } from 'ethers'
import React, { useCallback } from 'react'
import { Linking, TouchableOpacity, View } from 'react-native'

import OpenIcon from '@common/assets/svg/OpenIcon'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import { getMessageAsText } from '@web/modules/sign-message/utils'

import styles from './styles'

interface Props {
  message: IrMessage
  networkId?: NetworkDescriptor['id']
  explorerUrl?: NetworkDescriptor['explorerUrl']
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

const MessageSummary = ({ message, networkId, explorerUrl }: Props) => {
  const { t } = useTranslation()

  const humanizedVisualization = useCallback(
    (dataToVisualize: IrMessage['fullVisualization'] = []) => {
      return (
        <View style={styles.headerContent}>
          {dataToVisualize.map((item) => {
            if (!item) return null

            if (item.type === 'token') {
              return (
                <>
                  {!!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                    <Text fontSize={16} weight="medium" color={colors.martinique}>
                      {` ${
                        item.readableAmount ||
                        formatUnits(item.amount || '0x0', item.decimals || 18)
                      } `}
                    </Text>
                  ) : null}

                  {item.address ? (
                    <TokenIcon
                      width={24}
                      height={24}
                      networkId={networkId}
                      address={item.address}
                    />
                  ) : null}
                  {item.symbol ? (
                    <Text fontSize={16} weight="medium" color={colors.martinique}>
                      {` ${item.symbol || ''} `}
                    </Text>
                  ) : !!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                    <Text fontSize={16} weight="medium" color={colors.martinique}>
                      {t(' units of unknown token ')}
                    </Text>
                  ) : null}
                </>
              )
            }

            if (item.type === 'address')
              return (
                <Text fontSize={16} weight="medium" color={colors.martinique}>
                  {` ${item.name ? item.name : item.address} `}
                  {!!item.address && !!explorerUrl && (
                    <TouchableOpacity
                      disabled={!explorerUrl}
                      onPress={() => {
                        Linking.openURL(`${explorerUrl}/address/${item.address}`)
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.explorerIcon}
                    >
                      <OpenIcon width={20} height={20} color={colors.martinique_80} />
                    </TouchableOpacity>
                  )}
                </Text>
              )

            if (item.content) {
              return (
                <Text
                  fontSize={16}
                  weight={
                    item.type === 'label'
                      ? 'regular'
                      : item.type === 'action'
                      ? 'semiBold'
                      : 'medium'
                  }
                  color={
                    item.type === 'label'
                      ? colors.martinique_65
                      : item.type === 'action'
                      ? colors.greenHaze
                      : colors.martinique
                  }
                >{` ${getMessageAsText(item.content).replace('\n', '')} `}</Text>
              )
            }

            return null
          })}
        </View>
      )
    },
    [networkId, explorerUrl, t]
  )

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>{humanizedVisualization(message.fullVisualization)}</View>
    </View>
  )
}

export default React.memo(MessageSummary)
