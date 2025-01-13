import React, { useCallback, useMemo } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { TokenResult } from '@ambire-common/libs/portfolio'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import CartIcon from '@common/assets/svg/CartIcon'
import PendingToBeConfirmedIcon from '@common/assets/svg/PendingToBeConfirmedIcon'
import RewardsIcon from '@common/assets/svg/RewardsIcon'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import Tooltip from '@common/components/Tooltip'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import getTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import colors from '@common/styles/colors'
import spacings, { SPACING_2XL, SPACING_TY } from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import { getTokenId } from '@web/utils/token'
import { getUiType } from '@web/utils/uiType'

import TokenDetails from '../TokenDetails'
import PendingBadge from './PendingBadge'
import getStyles from './styles'

const { isPopup } = getUiType()

const TokenItem = ({
  token,
  tokenPreferences,
  testID
}: {
  token: TokenResult
  tokenPreferences: CustomToken[]
  testID?: string
}) => {
  const { portfolio } = useSelectedAccountControllerState()
  const {
    symbol,
    address,
    networkId,
    flags: { onGasTank }
  } = token
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const { networks } = useNetworksControllerState()

  const { styles, theme } = useTheme(getStyles)
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: theme.secondaryBackground
    }
  })
  const tokenId = getTokenId(token)

  const simulatedAccountOp = portfolio.networkSimulatedAccountOp[token.networkId]
  const tokenAmounts = useMemo(
    () =>
      portfolio.tokenAmounts.find(
        (tokenAmount) =>
          tokenAmount.address === token.address &&
          tokenAmount.networkId === token.networkId &&
          !token.flags.onGasTank
      ),
    [portfolio.tokenAmounts, token.address, token.networkId, token.flags.onGasTank]
  )

  const {
    balanceFormatted,
    balance,
    balanceLatestFormatted,
    priceUSDFormatted,
    balanceUSDFormatted,
    isVesting,
    networkData,
    isRewards,
    isPending: hasPendingBadges,
    pendingBalance,
    pendingBalanceFormatted,
    pendingBalanceUSDFormatted,
    pendingToBeSigned,
    pendingToBeSignedFormatted,
    pendingToBeConfirmed,
    pendingToBeConfirmedFormatted
  } = getTokenDetails(token, networks, tokenAmounts, simulatedAccountOp)

  const isPending = !!hasPendingBadges

  if ((isRewards || isVesting) && !balance && !pendingBalance) return null

  const sendClaimTransaction = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_BUILD_CLAIM_WALLET_USER_REQUEST',
      params: { token }
    })
  }, [token, dispatch])

  const sendVestingTransaction = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_BUILD_MINT_VESTING_USER_REQUEST',
      params: { token }
    })
  }, [token, dispatch])

  return (
    <AnimatedPressable
      onPress={() => openBottomSheet()}
      style={[styles.container, animStyle]}
      {...bindAnim}
      testID={testID}
    >
      <BottomSheet
        id={`token-details-${address}`}
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
      >
        <TokenDetails
          tokenPreferences={tokenPreferences}
          token={token}
          handleClose={closeBottomSheet}
        />
      </BottomSheet>
      <View style={flexboxStyles.flex1}>
        <View style={[flexboxStyles.directionRow, flexboxStyles.flex1]}>
          <View style={[flexboxStyles.directionRow, { flex: 1.5 }]}>
            <View style={[spacings.mr, flexboxStyles.justifyCenter]}>
              {isRewards || isVesting ? (
                <View style={styles.tokenButtonIconWrapper}>
                  <RewardsIcon width={40} height={40} />
                </View>
              ) : (
                <TokenIcon
                  withContainer
                  address={address}
                  networkId={networkId}
                  onGasTank={onGasTank}
                  containerHeight={40}
                  containerWidth={40}
                  width={28}
                  height={28}
                />
              )}
            </View>
            <View style={[flexboxStyles.alignCenter]}>
              <View style={[flexboxStyles.flex1, flexboxStyles.directionRow]}>
                <View>
                  <Text
                    selectable
                    style={spacings.mrTy}
                    color={isPending ? theme.warningText : theme.primaryText}
                    fontSize={16}
                    weight="number_bold"
                    numberOfLines={1}
                    // @ts-ignore
                    dataSet={{
                      tooltipId: `${tokenId}-balance`
                    }}
                  >
                    {isPending ? pendingBalanceFormatted : balanceFormatted} {symbol}{' '}
                  </Text>
                  <Tooltip
                    content={String(isPending ? pendingBalance : balance)}
                    id={`${tokenId}-balance`}
                  />
                  <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
                    <Text weight="regular" shouldScale={false} fontSize={12}>
                      {isRewards && t('Claimable rewards')}
                      {isVesting && !isPopup && t('Claimable early supporters vestings')}
                      {isVesting && isPopup && t('Claimable vestings')}
                      {!isRewards && !isVesting && t('on')}{' '}
                    </Text>
                    <Text weight="regular" style={[spacings.mrMi]} fontSize={12}>
                      {onGasTank && t('Gas Tank')}
                      {!onGasTank && !isRewards && !isVesting && networkData?.name}
                    </Text>
                  </View>
                </View>
                {isRewards && (
                  <Button
                    style={spacings.ml}
                    size="small"
                    hasBottomSpacing={false}
                    type="secondary"
                    text={t('Claim')}
                    onPress={sendClaimTransaction}
                  />
                )}

                {isVesting && (
                  <Button
                    style={spacings.ml}
                    size="small"
                    hasBottomSpacing={false}
                    type="secondary"
                    text={t('Claim')}
                    onPress={sendVestingTransaction}
                  />
                )}
              </View>
            </View>
          </View>
          <Text selectable fontSize={16} weight="number_regular" style={{ flex: 0.7 }}>
            {priceUSDFormatted}
          </Text>
          <Text
            selectable
            fontSize={16}
            weight="number_bold"
            color={isPending ? theme.warningText : theme.primaryText}
            style={{ flex: 0.4, textAlign: 'right' }}
          >
            {isPending ? pendingBalanceUSDFormatted : balanceUSDFormatted}
          </Text>
        </View>
        {isPending && (
          <View style={[{ marginLeft: SPACING_2XL + SPACING_TY }, spacings.mtSm]}>
            <View>
              {!!pendingToBeSigned && !!pendingToBeSignedFormatted && (
                <PendingBadge
                  amount={pendingToBeSigned}
                  amountFormatted={pendingToBeSignedFormatted}
                  label="Pending transaction signature"
                  backgroundColor={colors.lightBrown}
                  textColor={theme.warningText}
                  Icon={CartIcon}
                />
              )}
              {!!pendingToBeConfirmed && !!pendingToBeConfirmedFormatted && (
                <PendingBadge
                  amount={pendingToBeConfirmed}
                  amountFormatted={pendingToBeConfirmedFormatted}
                  label="Pending to be confirmed"
                  backgroundColor={colors.lightAzureBlue}
                  textColor={colors.azureBlue}
                  Icon={PendingToBeConfirmedIcon}
                />
              )}
            </View>

            <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
              <Text
                selectable
                style={[spacings.mrMi, { opacity: 0.7 }]}
                color={theme.successText}
                fontSize={14}
                weight="number_bold"
                numberOfLines={1}
              >
                {balanceLatestFormatted}
              </Text>
              <Text
                selectable
                style={{ opacity: 0.7 }}
                color={theme.successText}
                fontSize={12}
                numberOfLines={1}
              >
                {t('(On-chain)')}
              </Text>
            </View>
          </View>
        )}
      </View>
    </AnimatedPressable>
  )
}

export default React.memo(TokenItem)
