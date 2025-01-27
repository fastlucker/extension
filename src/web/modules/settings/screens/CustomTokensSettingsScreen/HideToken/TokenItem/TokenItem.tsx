import React, { FC, useCallback } from 'react'
import { Pressable, View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import DeleteIcon from '@common/assets/svg/DeleteIcon'
import InvisibilityIcon from '@common/assets/svg/InvisibilityIcon'
import VisibilityIcon from '@common/assets/svg/VisibilityIcon'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import getStyles from './styles'

type Props = TokenResult

const HideTokenTokenItem: FC<Props> = ({ address, symbol, networkId }) => {
  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { tokenPreferences, customTokens } = usePortfolioControllerState()
  const { isHidden } = tokenPreferences?.find(
    ({ address: addr, networkId: nId }) =>
      addr.toLowerCase() === address.toLowerCase() && nId === networkId
  ) || { isHidden: false }
  const isCustomToken = !!customTokens?.find(
    ({ address: addr, networkId: nId }) =>
      addr.toLowerCase() === address.toLowerCase() && nId === networkId
  )

  const toggleHideToken = useCallback(async () => {
    dispatch({
      type: 'PORTFOLIO_CONTROLLER_TOGGLE_HIDE_TOKEN',
      params: {
        address,
        networkId
      }
    })
  }, [dispatch, address, networkId])

  const removeCustomToken = useCallback(() => {
    dispatch({
      type: 'PORTFOLIO_CONTROLLER_REMOVE_CUSTOM_TOKEN',
      params: { address, networkId }
    })
  }, [address, dispatch, networkId])

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.justifySpaceBetween,
        spacings.phTy,
        spacings.pvTy,
        spacings.mbTy
      ]}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <TokenIcon
          containerHeight={32}
          containerWidth={32}
          width={22}
          height={22}
          withContainer
          networkId={networkId}
          address={address}
        />
        <Text fontSize={16} style={spacings.mlTy} weight="semiBold">
          {symbol}
        </Text>
      </View>
      <View style={flexbox.directionRow}>
        {isCustomToken && (
          <Pressable onPress={removeCustomToken}>
            <DeleteIcon color={theme.secondaryText} style={styles.icon} />
          </Pressable>
        )}
        <Pressable onPress={toggleHideToken}>
          {isHidden ? (
            <VisibilityIcon color={theme.successDecorative} style={styles.icon} />
          ) : (
            <InvisibilityIcon color={theme.errorDecorative} style={styles.icon} />
          )}
        </Pressable>
      </View>
    </View>
  )
}

export default React.memo(HideTokenTokenItem)
