/* eslint-disable react/no-array-index-key */
import { formatUnits, getAddress } from 'ethers'
import React, { Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import { Linking, TouchableOpacity, View, ViewStyle } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { getDeadlineText } from '@ambire-common/libs/humanizer/utils'
import DeleteIcon from '@common/assets/svg/DeleteIcon'
import OpenIcon from '@common/assets/svg/OpenIcon'
import ExpandableCard from '@common/components/ExpandableCard'
import Label from '@common/components/Label'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import { SPACING_SM, SPACING_TY } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useDomainsControllerState from '@web/hooks/useDomainsController/useDomainsController'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'

import getStyles from './styles'

interface Props {
  style: ViewStyle
  call: IrCall
  networkId: NetworkDescriptor['id']
  explorerUrl: NetworkDescriptor['explorerUrl']
  rightIcon?: ReactNode
  onRightIconPress?: () => void
  size?: 'sm' | 'md' | 'lg'
  isHistory?: boolean
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
  size = 'lg',
  isHistory
}: Props) => {
  const textSize = 16 * sizeMultiplier[size]
  const { t } = useTranslation()

  const { dispatch } = useBackgroundService()
  const { domains, loadingAddresses } = useDomainsControllerState()
  const { styles } = useTheme(getStyles)
  const [bindExplorerIconAnim, explorerIconAnimStyle] = useHover({
    preset: 'opacityInverted'
  })
  const [bindDeleteIconAnim, deleteIconAnimStyle] = useHover({
    preset: 'opacityInverted'
  })
  const [bindRightIconAnim, rightIconAnimStyle] = useHover({
    preset: 'opacityInverted'
  })

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
        <Text
          fontSize={textSize}
          appearance="successText"
          weight="semiBold"
          style={{ maxWidth: '100%' }}
        >
          {t(' Interacting with (to): ')}
        </Text>
        <Text
          fontSize={textSize}
          appearance="secondaryText"
          weight="regular"
          style={{ maxWidth: '100%' }}
          selectable
        >
          {` ${call.to} `}
        </Text>
        <Text
          fontSize={textSize}
          appearance="successText"
          weight="semiBold"
          style={{ maxWidth: '100%' }}
        >
          {t(' Value to be sent (value): ')}
        </Text>
        <Text selectable fontSize={textSize} appearance="secondaryText" weight="regular">
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
            if (!item || item.isHidden) return null

            if (item.type === 'token') {
              return (
                <Fragment key={Number(item.id) || i}>
                  {!!item.amount && BigInt(item.amount!) > BigInt(0) ? (
                    <Text
                      fontSize={textSize}
                      weight="medium"
                      appearance="primaryText"
                      style={{ maxWidth: '100%' }}
                    >
                      {` ${formatDecimals(
                        Number(
                          formatUnits(
                            item.amount || '0x0',
                            item?.humanizerMeta?.token?.decimals || 18
                          )
                        )
                      )} `}
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

            if (item.type === 'address') {
              let address = item.address ? getAddress(item.address) : ''
              const isLoading = loadingAddresses.includes(address)

              if (isLoading)
                return (
                  <Spinner
                    style={{
                      width: 16,
                      height: 16
                    }}
                  />
                )

              if (address && domains[address]) {
                address = domains[address].ens || domains[address].ud || address
              }

              return (
                <Fragment key={Number(item.id) || i}>
                  <Text
                    fontSize={textSize}
                    weight="medium"
                    appearance="primaryText"
                    style={{ maxWidth: '100%' }}
                    selectable
                  >
                    {` ${item?.humanizerMeta?.name ? item?.humanizerMeta?.name : address} `}
                  </Text>
                  {!!item.address && !!explorerUrl && (
                    <AnimatedPressable
                      disabled={!explorerUrl}
                      onPress={() => {
                        Linking.openURL(`${explorerUrl}/address/${item.address}`)
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={explorerIconAnimStyle}
                      {...bindExplorerIconAnim}
                    >
                      <OpenIcon width={14} height={14} strokeWidth="2" />
                    </AnimatedPressable>
                  )}
                </Fragment>
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
                  style={{ maxWidth: '100%' }}
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
    [
      size,
      textSize,
      explorerUrl,
      explorerIconAnimStyle,
      bindExplorerIconAnim,
      isHistory,
      networkId,
      t
    ]
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
            <TouchableOpacity
              onPress={onRightIconPress}
              style={rightIconAnimStyle}
              {...bindRightIconAnim}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
          {!!call.fromUserRequestId && !rightIcon && (
            <AnimatedPressable
              style={deleteIconAnimStyle}
              onPress={handleRemoveCall}
              {...bindDeleteIconAnim}
            >
              <DeleteIcon />
            </AnimatedPressable>
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
          <Text selectable fontSize={12} style={styles.bodyText}>
            <Text fontSize={12} style={styles.bodyText} weight="regular">
              {t('Interacting with (to): ')}
            </Text>
            {call.to}
          </Text>
          <Text selectable fontSize={12} style={styles.bodyText}>
            <Text fontSize={12} style={styles.bodyText} weight="regular">
              {t('Value to be sent (value): ')}
            </Text>
            {formatUnits(call.value || '0x0', 18)}
          </Text>
          <Text selectable fontSize={12} style={styles.bodyText}>
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
