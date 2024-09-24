import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import SwapBridgeToggleIcon from '@common/assets/svg/SwapBridgeToggleIcon'
import NumberInput from '@common/components/NumberInput'
import Panel from '@common/components/Panel'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import { FONT_FAMILIES } from '@common/hooks/useFonts'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import useSwapAndBridgeFrom from '@web/modules/swap-and-bridge/hooks/useSwapAndBridgeForm'

import getStyles from './styles'

const SwapAndBridgeScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const {
    fromAmountValue,
    onFromAmountChange,
    fromTokenOptions,
    fromTokenValue,
    fromTokenAmountSelectDisabled,
    handleChangeFromToken,
    toNetworksOptions,
    handleSetToNetworkValue,
    toTokenOptions,
    toTokenValue,
    handleChangeToToken
  } = useSwapAndBridgeFrom()
  const { toChainId } = useSwapAndBridgeControllerState()

  // TODO: Wire-up with the UI
  // TODO: Disable tokens that are NOT supported
  // (not in the `fromTokenList` of the SwapAndBridge controller)

  // TODO: Changing the FROM token (and chain), should:
  // 1. If the next FROM chain is different than the previous - fetch the `fromTokenList` and the `toTokenList`:
  // 1. Update quote or reset the amount to 0 (TBD)

  // TODO: Changing the TO token, should:
  // 1. Update quote or reset the amount to 0 (TBD)

  // TODO: Changing the TO chain, should:
  // 1. Fetch the `toTokenList`
  // 2. Update quote (TBD)

  // TODO: Changing the FROM amount should:
  // 1. Update quote

  // TODO: Changing the TO amount should be disabled.

  // TODO: Confirmation modal (warn) if the diff in dollar amount between the
  // FROM and TO tokens is too high (therefore, user will lose money).

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="sm"
      header={<HeaderAccountAndNetworkInfo />}
    >
      <TabLayoutWrapperMainContent contentContainerStyle={spacings.pt2Xl}>
        <Panel title={t('Swap & Bridge')} forceContainerSmallSpacings>
          <View>
            <Text appearance="secondaryText" fontSize={14} weight="medium" style={spacings.mbMi}>
              {t('Send')}
            </Text>
            <View style={styles.selectorContainer}>
              <View style={flexbox.directionRow}>
                <View style={flexbox.flex1}>
                  <NumberInput
                    value={fromAmountValue}
                    onChangeText={onFromAmountChange}
                    placeholder="0"
                    borderless
                    inputStyle={spacings.pl0}
                    nativeInputStyle={{ fontFamily: FONT_FAMILIES.MEDIUM, fontSize: 20 }}
                    disabled={fromTokenAmountSelectDisabled}
                    containerStyle={spacings.mb0}
                  />
                </View>
                <Select
                  setValue={({ value }) => handleChangeFromToken(value as string)}
                  options={fromTokenOptions}
                  value={fromTokenValue}
                  // disabled={disableForm}
                  // containerStyle={styles.tokenSelect}
                  testID="from-token-select"
                  containerStyle={{ ...flexbox.flex1, ...spacings.mb0 }}
                  selectStyle={{ backgroundColor: '#54597A14', borderWidth: 0 }}
                />
              </View>
            </View>
          </View>
        </Panel>
        <View style={styles.swapAndBridgeToggleButtonWrapper}>
          <Pressable style={styles.swapAndBridgeToggleButton}>
            <SwapBridgeToggleIcon />
          </Pressable>
        </View>
        <Panel forceContainerSmallSpacings>
          <View>
            <Text appearance="secondaryText" fontSize={14} weight="medium" style={spacings.mbMi}>
              {t('Receive')}
            </Text>
            <View style={[styles.selectorContainer, spacings.ph0, spacings.ptTy]}>
              <View style={styles.networkSelectorContainer}>
                <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
                  <Text fontSize={14} style={spacings.mrTy} appearance="secondaryText">
                    {t('Network')}
                  </Text>
                  <Select
                    setValue={handleSetToNetworkValue}
                    containerStyle={{ ...spacings.mb0, ...flexbox.flex1 }}
                    size="sm"
                    options={toNetworksOptions}
                    value={toNetworksOptions.filter((opt) => opt.value === toChainId)[0]}
                    selectStyle={{ backgroundColor: '#54597A14', borderWidth: 0 }}
                  />
                </View>
                <View style={flexbox.flex1} />
              </View>
              <View style={[flexbox.directionRow, spacings.phSm]}>
                <View style={flexbox.flex1}>
                  <NumberInput
                    value={fromAmountValue}
                    onChangeText={onFromAmountChange}
                    placeholder="0"
                    borderless
                    inputStyle={spacings.pl0}
                    nativeInputStyle={{ fontFamily: FONT_FAMILIES.MEDIUM, fontSize: 20 }}
                    disabled={fromTokenAmountSelectDisabled}
                    containerStyle={spacings.mb0}
                  />
                </View>
                <Select
                  setValue={({ value }) => handleChangeToToken(value as string)}
                  options={toTokenOptions}
                  value={toTokenValue}
                  // disabled={disableForm}
                  // containerStyle={styles.tokenSelect}
                  testID="to-token-select"
                  containerStyle={{ ...flexbox.flex1, ...spacings.mb0 }}
                  selectStyle={{ backgroundColor: '#54597A14', borderWidth: 0 }}
                />
              </View>
            </View>
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(SwapAndBridgeScreen)
