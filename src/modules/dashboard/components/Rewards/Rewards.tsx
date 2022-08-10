import {
  MultiplierBadge,
  multiplierBadges,
  MULTIPLIERS_READ_MORE_URL
} from 'ambire-common/src/constants/multiplierBadges'
import { RewardIds } from 'ambire-common/src/hooks/useRewards/types'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Linking, TouchableOpacity, View } from 'react-native'

import RewardsFlag from '@assets/svg/RewardFlag/RewardFlag'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import usePrivateMode from '@modules/common/hooks/usePrivateMode'
import { triggerLayoutAnimation } from '@modules/common/services/layoutAnimation'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import useClaimableWalletToken from '@modules/dashboard/hooks/useClaimableWalletToken'
import useRewards from '@modules/dashboard/hooks/useRewards'
import useStakedWalletToken from '@modules/dashboard/hooks/useStakedWalletToken'

import styles from './styles'

const Rewards = () => {
  const { t } = useTranslation()
  const { sheetRef, openBottomSheet, closeBottomSheet, isOpen } = useBottomSheet()
  const { rewards } = useRewards()
  const {
    walletTokenAPYPercentage,
    adxTokenAPYPercentage,
    xWALLETAPYPercentage,
    walletUsdPrice,
    multipliers,
    totalLifetimeRewards
  } = rewards
  const {
    currentClaimStatus,
    vestingEntry,
    claimableNow,
    disabledReason,
    claimDisabledReason,
    claimEarlyRewards,
    claimVesting,
    pendingTokensTotal,
    claimableNowUsd,
    mintableVestingUsd,
    shouldDisplayMintableVesting
  } = useClaimableWalletToken({ totalLifetimeRewards, walletUsdPrice })
  const { stakedAmount } = useStakedWalletToken()
  const { hidePrivateValue } = usePrivateMode()

  useLayoutEffect(() => {
    // Solves 2 issues: 1) the annoying jump in the beginning between the
    // loading and the loaded state; 2) the annoying jump when value updates.
    triggerLayoutAnimation()
  }, [pendingTokensTotal])

  const claimWithBurnDisabled = !!(claimDisabledReason || disabledReason)
  const handleClaimWithBurn = () => {
    const handleConfirm = () => {
      closeBottomSheet()
      claimEarlyRewards(false)
    }

    Alert.alert(
      t('Are you sure?'),
      t(
        'This procedure will claim 70% of your outstanding rewards as $WALLET, and permanently burn the other 30%'
      ),
      [
        {
          text: t('Confirm'),
          onPress: handleConfirm,
          style: 'destructive'
        },
        {
          text: t('Cancel'),
          style: 'cancel'
        }
      ]
    )
  }

  const claimInxWalletDisabled = !!(claimDisabledReason || disabledReason)
  const handleClaimInxWallet = () => {
    closeBottomSheet()
    claimEarlyRewards()
  }

  const handleClaimVesting = () => {
    closeBottomSheet()
    claimVesting()
  }

  const handleReadMore = () => Linking.openURL(MULTIPLIERS_READ_MORE_URL).finally(closeBottomSheet)

  const renderBadge = ({ id, multiplier, icon, name, color, link }: MultiplierBadge) => {
    const isUnlocked = multipliers && multipliers.map(({ name }) => name).includes(id)
    const handleLinkOpen = () => Linking.openURL(link)

    return (
      <TouchableOpacity
        onPress={handleLinkOpen}
        key={name}
        style={[
          flexboxStyles.center,
          spacings.mhMi,
          { width: 73, height: 84 },
          !isUnlocked && { opacity: 0.3 }
        ]}
      >
        <Text fontSize={25}>{icon}</Text>
        <Text fontSize={16} weight="semiBold">
          x{multiplier}
        </Text>
        <RewardsFlag color={color} style={styles.rewardFlag} />
      </TouchableOpacity>
    )
  }

  return (
    <>
      <Button
        onPress={openBottomSheet}
        type="outline"
        size="small"
        text={t('{{pendingTokensTotal}} WALLET Rewards', {
          // Technically, the fallback should be set in the hook,
          // but sometimes the hook returns `pendingTokensTotal` as undefined,
          // so double check it.
          pendingTokensTotal:
            currentClaimStatus.loading && !pendingTokensTotal
              ? '...'
              : hidePrivateValue(pendingTokensTotal)
        })}
        style={flexboxStyles.alignSelfCenter}
      />
      <BottomSheet
        id="rewards"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
        displayCancel={false}
      >
        <Title>{t('Wallet token distribution')}</Title>

        <View style={[flexboxStyles.directionRow, flexboxStyles.center, spacings.mb]}>
          {multiplierBadges.map(renderBadge)}
        </View>

        <Text type="caption" style={[spacings.mbSm, textStyles.center]}>
          <Text type="caption">
            {t(
              'You are receiving $WALLETS for holding funds on your Ambire wallet as an early user. '
            )}
          </Text>
          <Text onPress={handleReadMore} underline type="caption">
            {t('Read More')}
          </Text>
        </Text>

        <View style={styles.tableContainer}>
          <View style={[styles.tableRow, flexboxStyles.directionRow, styles.tableRowBorder]}>
            <View style={[spacings.prTy, flexboxStyles.flex1]}>
              <Text>{t('Early users Incentive')}</Text>
            </View>
            <View style={[spacings.plTy, styles.tableRowValue]}>
              <Text color={colors.turquoise} style={textStyles.right}>
                {rewards[RewardIds.BALANCE_REWARDS]}
              </Text>
              <Text type="small" style={textStyles.right}>
                {walletTokenAPYPercentage} APY
              </Text>
            </View>
          </View>
          <View style={[styles.tableRow, flexboxStyles.directionRow, styles.tableRowBorder]}>
            <View style={[spacings.prTy, flexboxStyles.flex1]}>
              <Text>{t('ADX Staking Bonus')}</Text>
            </View>
            <View style={[spacings.plTy, styles.tableRowValue]}>
              <Text color={colors.turquoise} style={textStyles.right}>
                {rewards[RewardIds.ADX_REWARDS]}
              </Text>
              <Text type="small" style={textStyles.right}>
                {adxTokenAPYPercentage} APY
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.tableRow,
              (shouldDisplayMintableVesting || !!stakedAmount) && styles.tableRowBorder
            ]}
          >
            <View style={[flexboxStyles.directionRow, spacings.mb]}>
              <View style={[spacings.prTy, flexboxStyles.flex1]}>
                <Text>{t('Claimable now: early users + ADX Staking bonus')}</Text>
              </View>
              <View style={[spacings.plTy, styles.tableRowValue]}>
                <Text color={colors.turquoise} style={textStyles.right}>
                  {currentClaimStatus.loading ? '...' : claimableNow}
                </Text>
                <Text type="small" style={textStyles.right}>
                  <Text type="small" color={colors.heliotrope}>
                    $
                  </Text>
                  {currentClaimStatus.loading ? '...' : claimableNowUsd}
                </Text>
              </View>
            </View>
            <View style={flexboxStyles.directionRow}>
              <Button
                disabled={claimWithBurnDisabled}
                onPress={handleClaimWithBurn}
                size="small"
                text={t('Claim with Burn')}
                containerStyle={[spacings.mrMi, flexboxStyles.flex1]}
              />
              <Button
                disabled={claimInxWalletDisabled}
                onPress={handleClaimInxWallet}
                size="small"
                text={t('Claim in xWALLET')}
                containerStyle={[spacings.mlMi, flexboxStyles.flex1]}
              />
            </View>
          </View>

          {shouldDisplayMintableVesting && (
            <View style={[styles.tableRow, !!stakedAmount && styles.tableRowBorder]}>
              <View style={[flexboxStyles.directionRow, spacings.mb]}>
                <View style={[spacings.prTy, flexboxStyles.flex1]}>
                  <Text>{t('Claimable early supporters vesting')}</Text>
                </View>
                <View style={[spacings.plTy, styles.tableRowValue]}>
                  <Text color={colors.turquoise} style={textStyles.right}>
                    {currentClaimStatus.mintableVesting}
                  </Text>
                  <Text type="small" style={textStyles.right}>
                    <Text type="small" color={colors.heliotrope}>
                      $
                    </Text>
                    {currentClaimStatus.loading ? '...' : mintableVestingUsd}
                  </Text>
                </View>
              </View>
              <Button
                onPress={handleClaimVesting}
                disabled={!!disabledReason}
                size="small"
                text={t('Claim')}
              />
            </View>
          )}
          {!!stakedAmount && (
            <View style={[styles.tableRow, flexboxStyles.directionRow]}>
              <View style={[spacings.prTy, flexboxStyles.flex1]}>
                <Text>{t('Staked WALLET')}</Text>
              </View>
              <View style={[spacings.plTy, styles.tableRowValue]}>
                <Text color={colors.turquoise} style={textStyles.right}>
                  {stakedAmount}
                </Text>
                <Text type="small" style={textStyles.right}>
                  {xWALLETAPYPercentage} APY
                </Text>
              </View>
            </View>
          )}
        </View>
      </BottomSheet>
    </>
  )
}

export default Rewards
