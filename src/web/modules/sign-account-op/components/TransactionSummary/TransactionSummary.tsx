/* eslint-disable react/no-array-index-key */
import { formatUnits } from 'ethers'
import React, { Fragment, ReactNode, useCallback } from 'react'
import { Linking, TouchableOpacity, View, ViewStyle } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import DeleteIcon from '@common/assets/svg/DeleteIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import ExpandableCard from '@common/components/ExpandableCard'
import Label from '@common/components/Label'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'

import getStyles from './styles'

interface Props {
  style: ViewStyle
  call: IrCall
  networkId: NetworkDescriptor['id']
  explorerUrl: NetworkDescriptor['explorerUrl']
  rightIcon?: ReactNode
  onRightIconPress?: () => void
}

const TransactionSummary = ({
  style,
  call,
  networkId,
  explorerUrl,
  rightIcon,
  onRightIconPress
}: Props) => {
  const { t } = useTranslation()

  const { dispatch } = useBackgroundService()
  const { styles } = useTheme(getStyles)

  const handleRemoveCall = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: 'User rejected the transaction request', id: call.fromUserRequestId }
    })
  }, [call.fromUserRequestId, dispatch])

  const fallbackVisualization = useCallback(() => {
    return (
      <View
        style={[
          flexbox.flex1,
          flexbox.directionRow,
          flexbox.alignCenter,
          flexbox.wrap,
          spacings.mhSm
        ]}
      >
        <Text fontSize={16} color={colors.greenHaze} weight="semiBold">
          {t(' Interacting with (to): ')}
        </Text>
        <Text fontSize={16} color={colors.martinique_65} weight="regular">
          {` ${call.to} `}
        </Text>
        <Text fontSize={16} color={colors.greenHaze} weight="semiBold">
          {t(' Value to be sent (value): ')}
        </Text>
        <Text fontSize={16} color={colors.martinique_65} weight="regular">
          {` ${formatUnits(call.value || '0x0', 18)} `}
        </Text>
      </View>
    )
  }, [call, t])

  const humanizedVisualization = useCallback(
    (dataToVisualize: IrCall['fullVisualization'] = []) => {
      return (
        <View
          style={[
            flexbox.flex1,
            flexbox.directionRow,
            flexbox.alignCenter,
            flexbox.wrap,
            spacings.mhSm
          ]}
        >
          {dataToVisualize.map((item, i) => {
            if (!item) return null

            if (item.type === 'token') {
              return (
                <Fragment key={Number(item.id) || i}>
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
                </Fragment>
              )
            }

            if (item.type === 'address')
              return (
                <Fragment key={Number(item.id) || i}>
                  <Text fontSize={16} weight="medium" color={colors.martinique}>
                    {` ${item.name ? item.name : item.address} `}
                  </Text>
                  {!!item.address && !!explorerUrl && (
                    <TouchableOpacity
                      disabled={!explorerUrl}
                      onPress={() => {
                        Linking.openURL(`${explorerUrl}/address/${item.address}`)
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <OpenIcon width={14} height={14} strokeWidth="2" />
                    </TouchableOpacity>
                  )}
                </Fragment>
              )

            if (item.type === 'nft') {
              return (
                <Text
                  key={Number(item.id) || i}
                  fontSize={16}
                  weight="medium"
                  color={colors.martinique}
                >
                  {` ${item.name || item.address} `}
                </Text>
              )
            }

            if (item.content) {
              return (
                <Text
                  key={Number(item.id) || i}
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
    [networkId, explorerUrl, t]
  )

  return (
    <ExpandableCard
      style={{
        ...(call.warnings?.length ? { ...styles.warningContainer, ...style } : { ...style })
      }}
      content={
        <>
          {call.fullVisualization
            ? humanizedVisualization(call.fullVisualization)
            : fallbackVisualization()}
          {!!rightIcon && (
            <TouchableOpacity onPress={onRightIconPress}>{rightIcon}</TouchableOpacity>
          )}
          {!!call.fromUserRequestId && !rightIcon && (
            <TouchableOpacity onPress={handleRemoveCall}>
              <DeleteIcon />
            </TouchableOpacity>
          )}
        </>
      }
      expandedContent={
        <View style={styles.body}>
          <Text fontSize={12} style={styles.bodyText}>
            <Text fontSize={12} style={styles.bodyText} weight="regular">
              {t('Interacting with (to): ')}
            </Text>
            {call.to}
          </Text>
          <Text fontSize={12} style={styles.bodyText}>
            <Text fontSize={12} style={styles.bodyText} weight="regular">
              {t('Value to be sent (value): ')}
            </Text>
            {formatUnits(call.value || '0x0', 18)}
          </Text>
          <Text fontSize={12} style={styles.bodyText}>
            <Text fontSize={12} style={styles.bodyText} weight="regular">
              {t('Data: ')}
            </Text>
            <Text fontSize={12} style={styles.bodyText}>
              {call.data}
            </Text>
          </Text>
        </View>
      }
    >
      <View
        style={{
          paddingHorizontal: 42 // magic number
        }}
      >
        {call.warnings?.map((warning) => {
          return (
            <Label key={warning.content + warning.level} text={warning.content} type="warning" />
          )
        })}
      </View>
    </ExpandableCard>
  )
}

export default React.memo(TransactionSummary)
