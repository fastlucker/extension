import React, { FC, useCallback } from 'react'
import { Pressable, View } from 'react-native'

import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
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

interface Props {
  token: CustomToken
  isLoading: { [token: string]: boolean }
  setIsLoading: React.Dispatch<React.SetStateAction<{ [token: string]: boolean }>>
  seTokenPreferencesCopy: React.Dispatch<React.SetStateAction<CustomToken[]>>
}

const HideTokenTokenItem: FC<Props> = ({
  token,
  isLoading,
  setIsLoading,
  seTokenPreferencesCopy
}) => {
  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { tokenPreferences } = usePortfolioControllerState()

  const hideToken = useCallback(async () => {
    let tokenIsInPreferences = tokenPreferences?.find(
      (tokenPreference) =>
        tokenPreference.address?.toLowerCase() === token.address.toLowerCase() &&
        tokenPreference.networkId === token.networkId
    )

    // Flip isHidden flag
    if (!tokenIsInPreferences) {
      tokenIsInPreferences = { ...token, isHidden: true }
    } else {
      tokenIsInPreferences = { ...tokenIsInPreferences, isHidden: !tokenIsInPreferences.isHidden }
    }

    let newTokenPreferences = []

    if (!tokenIsInPreferences) {
      newTokenPreferences.push(token)
    } else {
      const updatedTokenPreferences = tokenPreferences.map((_t: any) => {
        if (
          _t.address.toLowerCase() === token.address.toLowerCase() &&
          _t.networkId === token.networkId
        ) {
          return tokenIsInPreferences
        }
        return _t
      })
      newTokenPreferences = updatedTokenPreferences
    }

    seTokenPreferencesCopy(newTokenPreferences)
    setIsLoading({ [`${token.address}-${token.networkId}`]: true })

    dispatch({
      type: 'PORTFOLIO_CONTROLLER_UPDATE_TOKEN_PREFERENCES',
      params: { token: tokenIsInPreferences }
    })
  }, [seTokenPreferencesCopy, setIsLoading, tokenPreferences, token, dispatch])

  const removeToken = useCallback(() => {
    dispatch({
      type: 'PORTFOLIO_CONTROLLER_REMOVE_TOKEN_PREFERENCES',
      params: { token }
    })
  }, [dispatch, token])

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
          networkId={token.networkId}
          address={token.address}
        />
        <Text fontSize={16} style={spacings.mlTy} weight="semiBold">
          {token.symbol}
        </Text>
      </View>
      <View style={flexbox.directionRow}>
        {tokenPreferences?.find(
          ({ address, networkId, standard }) =>
            token.address.toLowerCase() === address.toLowerCase() &&
            token.networkId === networkId &&
            standard === 'ERC20'
        ) && (
          <Pressable onPress={removeToken}>
            <DeleteIcon color={theme.secondaryText} style={styles.icon} />
          </Pressable>
        )}
        {tokenPreferences?.find(
          ({ address, networkId }) =>
            token.address.toLowerCase() === address.toLowerCase() && token.networkId === networkId
        )?.isHidden ? (
          <Pressable
            disabled={isLoading[`${token.address}-${token.networkId}`]}
            onPress={hideToken}
          >
            <InvisibilityIcon color={theme.errorDecorative} style={styles.icon} />
          </Pressable>
        ) : (
          <Pressable
            disabled={isLoading[`${token.address}-${token.networkId}`]}
            onPress={hideToken}
          >
            <VisibilityIcon color={theme.successDecorative} style={styles.icon} />
          </Pressable>
        )}
      </View>
    </View>
  )
}

export default React.memo(HideTokenTokenItem)
