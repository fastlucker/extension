import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { FeePaymentOption } from '@ambire-common/libs/estimate/interfaces'
import { Avatar } from '@common/components/Avatar'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import shortenAddress from '@web/utils/shortenAddress'

const PayOption = ({
  feeOption,
  disabled,
  disabledReason
}: {
  feeOption: FeePaymentOption
  disabled: boolean
  disabledReason?: string
}) => {
  const { t } = useTranslation()
  const { maxWidthSize } = useWindowSize()
  const isL = maxWidthSize('l')
  const { accounts } = useAccountsControllerState()

  const iconSize = isL ? 20 : 16
  const disabledStyle = disabled ? { opacity: 0.5 } : {}

  const account = useMemo(
    () => accounts.find((a) => a.addr === feeOption.paidBy),
    [accounts, feeOption.paidBy]
  )

  if (!account) return null

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        {
          width: '100%'
        }
      ]}
    >
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          spacings.mrTy,
          {
            flexGrow: 1,
            flexShrink: 1,
            ...disabledStyle
          }
        ]}
      >
        <Avatar pfp={account.preferences.pfp} size={32} />
        <View style={[flexbox.flex1, spacings.mrMi]}>
          <Text weight="medium" fontSize={isL ? 14 : 12} numberOfLines={1}>
            {account.preferences.label}
          </Text>
          <Text weight="medium" fontSize={10} numberOfLines={1} appearance="secondaryText">
            (
            {!feeOption.token.flags.onGasTank
              ? shortenAddress(feeOption.paidBy, isL ? 23 : 13)
              : t('Gas Tank')}
            )
          </Text>
        </View>
      </View>
      <View>
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            flexbox.justifyEnd,
            flexbox.flex1,
            {
              minWidth: 'fit-content',
              flexShrink: 0,
              ...disabledStyle
            }
          ]}
        >
          <TokenIcon
            containerStyle={{
              width: iconSize,
              height: iconSize
            }}
            width={iconSize}
            height={iconSize}
            networkSize={10}
            address={feeOption.token.address}
            networkId={feeOption.token.networkId}
            onGasTank={feeOption.token.flags.onGasTank}
            skeletonAppearance="secondaryBackground"
          />
          <Text weight="medium" numberOfLines={1} style={spacings.mlMi} fontSize={isL ? 14 : 12}>
            {feeOption.token.symbol}
          </Text>
        </View>
        <View
          style={{
            marginLeft: 'auto',
            ...disabledStyle
          }}
        >
          <Text
            fontSize={10}
            appearance="secondaryText"
            weight="medium"
            style={{ textAlign: 'right' }}
          >
            {disabledReason && (
              <Text fontSize={10} appearance="errorText" weight="semiBold">
                ({disabledReason}){' '}
              </Text>
            )}
            {t('Fee token')}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default React.memo(PayOption)
