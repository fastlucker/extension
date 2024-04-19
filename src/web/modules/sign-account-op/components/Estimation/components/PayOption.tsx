import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { FeePaymentOption } from '@ambire-common/libs/estimate/interfaces'
import { Avatar } from '@common/components/Avatar'
import Text from '@common/components/Text'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useWindowSize from '@common/hooks/useWindowSize'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
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
  const settingsCtrl = useSettingsControllerState()
  const { maxWidthSize } = useWindowSize()
  const isL = maxWidthSize('l')
  const accountPref = settingsCtrl.accountPreferences[feeOption.paidBy]

  const label = accountPref?.label || DEFAULT_ACCOUNT_LABEL
  const disabledStyle = disabled ? { opacity: 0.5 } : {}

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
        <Avatar pfp={accountPref?.pfp} size={32} />
        <View style={[flexbox.flex1, spacings.mrMi]}>
          <Text weight="medium" fontSize={isL ? 14 : 12} numberOfLines={1}>
            {label}
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
            containerHeight={isL ? 32 : 24}
            containerWidth={isL ? 32 : 24}
            width={isL ? 20 : 16}
            height={isL ? 20 : 16}
            networkSize={10}
            address={feeOption.token.address}
            networkId={feeOption.token.networkId}
            onGasTank={feeOption.token.flags.onGasTank}
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
            {t('Fee token')}
          </Text>
          {disabledReason && (
            <Text fontSize={10} appearance="errorText" weight="semiBold">
              {disabledReason}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default PayOption
