import React, { useCallback, useMemo, useState } from 'react'
import { Pressable, View, ViewStyle } from 'react-native'

import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import DeleteIcon from '@common/assets/svg/DeleteIcon'
import InvisibilityIcon from '@common/assets/svg/InvisibilityIcon'
import VisibilityIcon from '@common/assets/svg/VisibilityIcon'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

const HideToken = () => {
  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()
  const portfolio = usePortfolioControllerState()

  const [searchAddress, setSearchAddress] = useState('')

  const hideToken = useCallback(async (token) => {
    console.log('hide token')
    const tokenPreferences = portfolio.state.tokenPreferences
    // Flip isHidden flag
    const newTokenPreference =
      tokenPreferences.find((tokenPreference) => tokenPreference.address === token.address) || token

    newTokenPreference.isHidden = !newTokenPreference.isHidden
    console.log(newTokenPreference)

    await portfolio.updateTokenPreferences(newTokenPreference)
  }, [])

  const removeToken = useCallback(async (token) => {
    console.log('remove token', token)

    await portfolio.removeTokenPreferences(token.address)
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearchAddress(e.target.value)
  }, [])

  return (
    <View style={flexbox.flex1}>
      <Text fontSize={20} style={[spacings.mtTy, spacings.mb2Xl]} weight="medium">
        {t('Hide Token')}
      </Text>
      <Input
        label={t('Token Address or Symbol')}
        onChange={handleSearchChange}
        placeholder="Input token address or symbol"
        inputWrapperStyle={spacings.mbSm}
      />
      <View>
        {portfolio.accountPortfolio?.tokens
          .filter(
            (token) =>
              (token.amount > 0n ||
                portfolio.state.tokenPreferences.find(
                  ({ address, networkId }) =>
                    token.address === address && token.networkId === networkId
                )) &&
              !token.flags.onGasTank
          )
          .map((token) => (
            <View
              key={`${token.address}-${token.networkId}`}
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
                {token.isHidden ? (
                  <Pressable onPress={() => hideToken(token)}>
                    <VisibilityIcon
                      color="#018649"
                      style={[spacings.phTy, { cursor: 'pointer' }]}
                    />
                  </Pressable>
                ) : (
                  <Pressable onPress={() => hideToken(token)}>
                    <InvisibilityIcon
                      color="#ea0129"
                      style={[spacings.phTy, { cursor: 'pointer' }]}
                    />
                  </Pressable>
                )}
                {portfolio.state.tokenPreferences.find(
                  ({ address, networkId }) =>
                    token.address === address && token.networkId === networkId
                ) &&
                  token.amount === 0n && (
                    <Pressable onPress={() => removeToken(token)}>
                      <DeleteIcon color="#54597a" style={[spacings.phTy, { cursor: 'pointer' }]} />
                    </Pressable>
                  )}
              </View>
            </View>
          ))}
      </View>
    </View>
  )
}

export default React.memo(HideToken)
