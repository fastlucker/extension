import React, { FC, useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import Badge from '@common/components/Badge'
import Dropdown from '@common/components/Dropdown'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import TokenIcon from '@common/components/TokenIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

type Props = {
  onTokenPreferenceOrCustomTokenChange: () => void
  onTokenRemove: (token: Pick<TokenResult, 'networkId' | 'address'>) => void
} & TokenResult

const Token: FC<Props> = ({
  address,
  networkId,
  flags,
  symbol,
  onTokenPreferenceOrCustomTokenChange,
  onTokenRemove
}) => {
  const { tokenPreferences } = usePortfolioControllerState()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()
  const { networks } = useNetworksControllerState()
  // Because flags.isHidden is updated after the portfolio updates
  // we can't rely on it for the toggle
  const isHidden = !!tokenPreferences?.find(
    ({ address: addr, networkId: nId }) =>
      addr.toLowerCase() === address.toLowerCase() && nId === networkId
  )?.isHidden

  const toggleHideToken = useCallback(async () => {
    dispatch({
      type: 'PORTFOLIO_CONTROLLER_TOGGLE_HIDE_TOKEN',
      params: {
        token: {
          address,
          networkId
        }
      }
    })
    onTokenPreferenceOrCustomTokenChange()
  }, [dispatch, address, networkId, onTokenPreferenceOrCustomTokenChange])

  const removeCustomToken = useCallback(() => {
    dispatch({
      type: 'PORTFOLIO_CONTROLLER_REMOVE_CUSTOM_TOKEN',
      params: {
        token: { address, networkId }
      }
    })
    onTokenRemove({ address, networkId })
    onTokenPreferenceOrCustomTokenChange()
  }, [address, dispatch, networkId, onTokenPreferenceOrCustomTokenChange, onTokenRemove])

  const dropdownOptions = useMemo(() => {
    const defaultOptions = [
      {
        label: 'View on Coingecko',
        value: 'coingecko'
      },
      {
        label: 'View on block explorer',
        value: 'explorer'
      }
    ]

    if (!flags.isCustom) return defaultOptions

    return [
      ...defaultOptions,
      {
        label: 'Remove custom token',
        value: 'remove',
        style: { color: theme.errorText }
      }
    ]
  }, [flags.isCustom, theme.errorText])

  const onDropdownSelect = useCallback(
    async ({ value }: { value: string }) => {
      if (value === 'remove') {
        removeCustomToken()
        return
      }

      if (value === 'coingecko') {
        await openInTab(`https://www.coingecko.com/en/coins/${address}`, false)
        return
      }

      if (value === 'explorer') {
        const network = networks.find(({ id }) => id === networkId)
        if (!network) return

        await openInTab(`${network.explorerUrl}/address/${address}`, false)
      }
    },
    [address, networkId, networks, removeCustomToken]
  )

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        common.borderRadiusPrimary,
        flexbox.flex1,
        spacings.mbTy,
        spacings.pvTy,
        {
          backgroundColor: theme.secondaryBackground
        }
      ]}
    >
      <View style={[{ flex: 1.25 }, flexbox.directionRow, flexbox.alignCenter, spacings.plSm]}>
        <TokenIcon
          withContainer
          address={address}
          networkId={networkId}
          onGasTank={flags.onGasTank}
          containerHeight={40}
          containerWidth={40}
          width={28}
          height={28}
        />
        <Text weight="medium" selectable style={spacings.mrTy}>
          {symbol}
        </Text>
        {flags.isCustom && <Badge text="Custom" />}
      </View>
      <View style={[flexbox.directionRow, flexbox.alignCenter, { flex: 1.75 }]}>
        <NetworkIcon id={networkId} style={spacings.mrTy} />
        <Text>{networks.find(({ id }) => id === networkId)?.name || 'Unknown Network'}</Text>
      </View>
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          flexbox.justifySpaceBetween,
          spacings.prSm,
          { flex: 0.4 }
        ]}
      >
        <Toggle isOn={!isHidden} onToggle={toggleHideToken} />
        <Dropdown data={dropdownOptions} onSelect={onDropdownSelect} />
      </View>
    </View>
  )
}

export default Token
