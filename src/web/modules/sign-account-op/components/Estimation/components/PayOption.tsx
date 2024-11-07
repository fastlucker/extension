import { formatUnits } from 'ethers'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { FeePaymentOption } from '@ambire-common/libs/estimate/interfaces'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import Avatar from '@common/components/Avatar'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'

const PayOption = ({
  feeOption,
  disabledReason
}: {
  feeOption: FeePaymentOption
  disabledReason?: string
}) => {
  const { t } = useTranslation()
  const { accounts, selectedAccount } = useAccountsControllerState()
  const { networks } = useNetworksControllerState()

  const iconSize = 24

  const paidByAccountData = useMemo(
    () => accounts.find((a) => a.addr === feeOption.paidBy),
    [accounts, feeOption.paidBy]
  )

  const formattedAmount = useMemo(() => {
    return formatDecimals(
      Number(formatUnits(feeOption.availableAmount, feeOption.token.decimals)),
      'amount'
    )
  }, [feeOption.availableAmount, feeOption.token.decimals])

  const feeTokenNetworkName = useMemo(() => {
    if (feeOption.token.flags.onGasTank) {
      return 'Gas Tank'
    }

    return networks.find((n) => n.id === feeOption.token.networkId)?.name || ''
  }, [feeOption.token.flags.onGasTank, feeOption.token.networkId, networks])

  const isPaidByAnotherAccount = feeOption.paidBy !== selectedAccount

  const paidByLabel = useMemo(() => {
    return paidByAccountData?.preferences.label
  }, [paidByAccountData?.preferences.label])

  if (!paidByAccountData) return null

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
      <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter, spacings.mrTy]}>
        <TokenIcon
          containerStyle={{
            width: iconSize,
            height: iconSize
          }}
          width={iconSize}
          height={iconSize}
          networkSize={12}
          address={feeOption.token.address}
          networkId={feeOption.token.networkId}
          onGasTank={feeOption.token.flags.onGasTank}
          skeletonAppearance="secondaryBackground"
        />

        <View style={[flexbox.flex1, spacings.mlTy]}>
          <Text weight="semiBold" fontSize={12} numberOfLines={1}>
            {formattedAmount} {feeOption.token.symbol} <Text fontSize={12}>{t('on ')}</Text>
            <Text fontSize={12}>{feeTokenNetworkName}</Text>
          </Text>
          {disabledReason && (
            <Text weight="medium" fontSize={10} numberOfLines={1} appearance="errorText">
              {disabledReason}
            </Text>
          )}
        </View>
      </View>
      {isPaidByAnotherAccount && (
        <View style={[flexbox.alignEnd]}>
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <Avatar
              size={16}
              pfp={feeOption.paidBy}
              style={spacings.prTy}
              isSmart={false}
              displayTypeBadge={false}
            />
            <Text fontSize={10} weight="semiBold" numberOfLines={1}>
              {paidByLabel}
            </Text>
          </View>
          <Text fontSize={10} weight="medium">
            {shortenAddress(feeOption.paidBy, 13)}
          </Text>
        </View>
      )}
    </View>
  )
}

export default React.memo(PayOption)
