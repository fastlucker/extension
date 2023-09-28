import { NetworkDescriptor } from 'ambire-common/src/interfaces/networkDescriptor'
import { IrCall } from 'ambire-common/src/libs/humanizer/interfaces'
import { formatUnits } from 'ethers'
import React, { useCallback, useState } from 'react'
import { Pressable, View, ViewStyle } from 'react-native'

import DeleteIcon from '@common/assets/svg/DeleteIcon'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import useBackgroundService from '@web/hooks/useBackgroundService'

import styles from './styles'

interface Props {
  style: ViewStyle
  call: IrCall
  networkId: NetworkDescriptor['id']
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

const TransactionSummary = ({ style, call, networkId }: Props) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const { dispatch } = useBackgroundService()

  const handleRemoveCall = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: 'User rejected the transaction request', id: call.fromUserRequestId }
    })
  }, [call.fromUserRequestId, dispatch])

  const humanizedVisualization = useCallback(
    (dataToVisualize: IrCall['fullVisualization'] = []) => {
      return (
        <View style={styles.headerContent}>
          {dataToVisualize.map((item) => {
            if (!item) return null

            if (item.type === 'token') {
              return (
                <>
                  {!!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                    <Text fontSize={16} weight="medium" color={colors.martinique}>
                      {` ${formatUnits(item.amount || '0x0', 18)} `}
                    </Text>
                  ) : null}

                  {item.address ? (
                    <TokenIcon
                      width={20}
                      height={20}
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
                  {/* {!!item.address && (
                    <TouchableOpacity
                      onPress={() => {
                        // TODO: currently there is no explorerUrl in networks
                        // Linking.openURL(`${explorerUrl}/address/${item.address}`)
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.openIconWrapper}
                    >
                      <OpenIcon width={16} height={16} />
                    </TouchableOpacity>
                  )} */}
                </Text>
              )

            if (item.type === 'nft') {
              return (
                <Text fontSize={16} weight="medium" color={colors.martinique}>
                  {` ${item.name || item.address} `}
                </Text>
              )
            }

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
                >{` ${item.content} `}</Text>
              )
            }

            return null
          })}
        </View>
      )
    },
    [networkId, t]
  )

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={() => setIsExpanded((prevState) => !prevState)}>
        <View style={styles.header}>
          <NavIconWrapper
            hoverBackground={colors.lightViolet}
            style={{ borderColor: 'transparent', borderRadius: 10 }}
            onPress={() => setIsExpanded((prevState) => !prevState)}
          >
            <DownArrowIcon width={36} height={36} isActive={isExpanded} withRect />
          </NavIconWrapper>
          {humanizedVisualization(call.fullVisualization)}
          {!!call.fromUserRequestId && (
            <NavIconWrapper
              hoverBackground={colors.lightViolet}
              hoverBorderColor={colors.violet}
              style={{
                borderRadius: 10,
                backgroundColor: 'transparent',
                borderColor: 'transparent'
              }}
              onPress={handleRemoveCall}
            >
              <DeleteIcon width={18} height={20} />
            </NavIconWrapper>
          )}
        </View>
      </Pressable>
      {!!isExpanded && (
        <View style={styles.body}>
          <Text fontSize={12} style={styles.bodyText}>
            {t('Interacting with (to):')} {call.to}
          </Text>
          <Text fontSize={12} style={styles.bodyText}>
            {t('Value to be sent (value):')} {formatUnits(call.value || '0x0', 18)}
          </Text>
          <Text fontSize={12} style={styles.bodyText}>
            {t('Data')}:{call.data}
          </Text>
        </View>
      )}
    </View>
  )
}

export default React.memo(TransactionSummary)
