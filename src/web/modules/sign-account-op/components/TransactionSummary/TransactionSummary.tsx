/* eslint-disable react/no-array-index-key */
import { formatUnits } from 'ethers'
import React, { Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import { Linking, TouchableOpacity, View, ViewStyle } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { getDeadlineText } from '@ambire-common/libs/humanizer/utils'
import DeleteIcon from '@common/assets/svg/DeleteIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import ExpandableCard from '@common/components/ExpandableCard'
import Label from '@common/components/Label'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import { SPACING_SM, SPACING_TY } from '@common/styles/spacings'
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
  size?: 'sm' | 'md' | 'lg'
}

const sizeMultiplier = {
  sm: 0.75,
  md: 0.85,
  lg: 1
}

const DeadlineVisualization = ({ deadline, textSize }: { deadline: bigint; textSize: number }) => {
  const [deadlineText, setDeadlineText] = useState(getDeadlineText(deadline))
  const remainingTime = deadline - BigInt(Date.now())
  const minute: bigint = 60000n

  useEffect(() => {
    let updateAfter = Number(minute)

    // more then 10mints
    if (remainingTime > 10n * minute) updateAfter = Number(remainingTime - 10n * minute)
    // if 0< and <10 minutes
    if (remainingTime > 0 && remainingTime < 10n * minute)
      updateAfter = Number(remainingTime % minute)
    // if just expired
    if (remainingTime < 0 && remainingTime > -2n * minute)
      updateAfter = Number(2n * minute + remainingTime)
    // if long expired
    if (remainingTime < -2n * minute) updateAfter = Number(10n * minute)

    // this triggeres use effect after 'updateAfter' milliseconds by updating the text
    const timeoutId = setTimeout(() => {
      setDeadlineText(getDeadlineText(deadline))
    }, updateAfter)

    return () => clearTimeout(timeoutId)
  }, [deadlineText, deadline, minute, remainingTime])

  return (
    <Text fontSize={textSize} weight="medium" appearance="warningText">
      {`(${deadlineText})`}
    </Text>
  )
}

const TransactionSummary = ({
  style,
  call,
  networkId,
  explorerUrl,
  rightIcon,
  onRightIconPress,
  size = 'lg'
}: Props) => {
  const textSize = 16 * sizeMultiplier[size]
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
          {
            paddingHorizontal: SPACING_SM * sizeMultiplier[size]
          }
        ]}
      >
        <Text fontSize={textSize} appearance="successText" weight="semiBold">
          {t(' Interacting with (to): ')}
        </Text>
        <Text fontSize={textSize} appearance="secondaryText" weight="regular">
          {` ${call.to} `}
        </Text>
        <Text fontSize={textSize} appearance="successText" weight="semiBold">
          {t(' Value to be sent (value): ')}
        </Text>
        <Text fontSize={textSize} appearance="secondaryText" weight="regular">
          {` ${formatUnits(call.value || '0x0', 18)} `}
        </Text>
      </View>
    )
  }, [call, t, textSize, size])

  const humanizedVisualization = useCallback(
    (dataToVisualize: IrCall['fullVisualization'] = []) => {
      return (
        <View
          style={[
            flexbox.flex1,
            flexbox.directionRow,
            flexbox.alignCenter,
            flexbox.wrap,
            {
              marginHorizontal: SPACING_SM * sizeMultiplier[size]
            }
          ]}
        >
          {dataToVisualize.map((item, i) => {
            if (!item) return null

            if (item.type === 'token') {
              return (
                <Fragment key={Number(item.id) || i}>
                  {!!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                    <Text fontSize={textSize} weight="medium" appearance="primaryText">
                      {` ${
                        item.readableAmount ||
                        formatUnits(item.amount || '0x0', item.decimals || 18)
                      } `}
                    </Text>
                  ) : null}

                  {item.address ? (
                    <TokenIcon
                      width={24 * sizeMultiplier[size]}
                      height={24 * sizeMultiplier[size]}
                      networkId={networkId}
                      address={item.address}
                    />
                  ) : null}
                  {item.symbol ? (
                    <Text fontSize={textSize} weight="medium" appearance="primaryText">
                      {` ${item.symbol || ''} `}
                    </Text>
                  ) : !!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                    <Text fontSize={textSize} weight="medium" appearance="primaryText">
                      {t(' units of unknown token ')}
                    </Text>
                  ) : null}
                </Fragment>
              )
            }

            if (item.type === 'address')
              return (
                <Fragment key={Number(item.id) || i}>
                  <Text fontSize={textSize} weight="medium" appearance="primaryText">
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
                  fontSize={textSize}
                  weight="medium"
                  appearance="primaryText"
                >
                  {` ${item.name || item.address} `}
                </Text>
              )
            }

            if (item.type === 'deadline')
              return (
                <DeadlineVisualization
                  key={Number(item.id) || i}
                  deadline={item.amount!}
                  textSize={textSize}
                />
              )
            if (item.content) {
              return (
                <Text
                  key={Number(item.id) || i}
                  fontSize={textSize}
                  weight={
                    item.type === 'label'
                      ? 'regular'
                      : item.type === 'action'
                      ? 'semiBold'
                      : 'medium'
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
    },
    [networkId, explorerUrl, t, textSize, size]
  )

  return (
    <ExpandableCard
      style={{
        ...(call.warnings?.length ? { ...styles.warningContainer, ...style } : { ...style })
      }}
      contentStyle={{
        paddingHorizontal: SPACING_SM * sizeMultiplier[size],
        paddingVertical: SPACING_TY * sizeMultiplier[size]
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
        <View
          style={{
            paddingHorizontal: SPACING_SM * sizeMultiplier[size],
            paddingVertical: SPACING_TY * sizeMultiplier[size]
          }}
        >
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
          paddingHorizontal: 42 * sizeMultiplier[size] // magic number
        }}
      >
        {call.warnings?.map((warning) => {
          return (
            <Label
              size={size}
              key={warning.content + warning.level}
              text={warning.content}
              type="warning"
            />
          )
        })}
      </View>
    </ExpandableCard>
  )
}

export default React.memo(TransactionSummary)
