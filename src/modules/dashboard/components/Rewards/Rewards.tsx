import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Linking, TouchableOpacity, View } from 'react-native'

import RewardsFlag from '@assets/svg/RewardFlag/RewardFlag'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import useRewards, { RewardIds } from '@modules/dashboard/hooks/useRewards'
import useStakedWalletToken from '@modules/dashboard/hooks/useStakedWalletToken'

import styles from './styles'

const BLOG_POST_URL = 'https://blog.ambire.com/announcing-the-wallet-token-a137aeda9747'

const multiplierBadges = [
  {
    id: 'beta-tester',
    name: 'Beta Testers',
    icon: '🧪',
    color: '#6000FF',
    multiplier: 1.25,
    link: 'https://blog.ambire.com/announcing-the-wallet-token-a137aeda9747'
  },
  {
    id: 'lobsters',
    name: 'Lobsters',
    icon: '🦞',
    color: '#E82949',
    multiplier: 1.5,
    link: 'https://blog.ambire.com/ambire-wallet-to-partner-with-lobsterdao-10b57e6da0-53c59c88726b'
  }
]

const Rewards = () => {
  const { t } = useTranslation()
  const { sheetRef, openBottomSheet, closeBottomSheet, isOpen } = useBottomSheet()
  const { rewards, pendingTokensTotal, claimableWalletToken, isLoading } = useRewards()
  const { stakedAmount } = useStakedWalletToken()

  const {
    vestingEntry,
    currentClaimStatus,
    claimableNow,
    disabledReason,
    claimDisabledReason,
    claimEarlyRewards,
    claimVesting
  } = claimableWalletToken

  const walletTokenAPY = rewards.walletTokenAPY ? (rewards.walletTokenAPY * 100).toFixed(2) : '...'
  const adxTokenAPY = rewards.adxTokenAPY ? (rewards.adxTokenAPY * 100).toFixed(2) : '...'
  const xWALLETAPY = rewards.xWALLETAPY ? (rewards.xWALLETAPY * 100).toFixed(2) : '...'
  const walletTokenUSDPrice = rewards.walletUsdPrice || 0

  const claimableNowUsd =
    walletTokenUSDPrice && !currentClaimStatus.loading && claimableNow
      ? (walletTokenUSDPrice * claimableNow).toFixed(2)
      : '...'
  const mintableVestingUsd =
    walletTokenUSDPrice && !currentClaimStatus.loading && currentClaimStatus.mintableVesting
      ? (walletTokenUSDPrice * currentClaimStatus.mintableVesting).toFixed(2)
      : '...'

  const shouldDisplayVesting = !!currentClaimStatus.mintableVesting && !!vestingEntry
  const shouldDisplayStaked = !!stakedAmount

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

  const handleReadMore = () => Linking.openURL(BLOG_POST_URL).finally(closeBottomSheet)

  const renderBadge = ({ id, multiplier, icon, name, color, link }) => {
    const isUnlocked =
      rewards.multipliers && rewards.multipliers.map(({ name }) => name).includes(id)
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
        text={
          isLoading
            ? t('Updating...')
            : t('{{pendingTokensTotal}} WALLET Rewards', {
                pendingTokensTotal
              })
        }
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
              <Text color={colors.primaryAccentColor} style={textStyles.right}>
                {rewards[RewardIds.BALANCE_REWARDS]}
              </Text>
              <Text type="small" style={textStyles.right}>
                {walletTokenAPY}% APY
              </Text>
            </View>
          </View>
          <View style={[styles.tableRow, flexboxStyles.directionRow, styles.tableRowBorder]}>
            <View style={[spacings.prTy, flexboxStyles.flex1]}>
              <Text>{t('ADX Staking Bonus')}</Text>
            </View>
            <View style={[spacings.plTy, styles.tableRowValue]}>
              <Text color={colors.primaryAccentColor} style={textStyles.right}>
                {rewards[RewardIds.ADX_REWARDS]}
              </Text>
              <Text type="small" style={textStyles.right}>
                {adxTokenAPY}% APY
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.tableRow,
              (shouldDisplayVesting || shouldDisplayStaked) && styles.tableRowBorder
            ]}
          >
            <View style={[flexboxStyles.directionRow, spacings.mb]}>
              <View style={[spacings.prTy, flexboxStyles.flex1]}>
                <Text>{t('Claimable now: early users + ADX Staking bonus')}</Text>
              </View>
              <View style={[spacings.plTy, styles.tableRowValue]}>
                <Text color={colors.primaryAccentColor} style={textStyles.right}>
                  {currentClaimStatus.loading ? '...' : claimableNow}
                </Text>
                <Text type="small" style={textStyles.right}>
                  <Text type="small" color={colors.secondaryAccentColor}>
                    $
                  </Text>
                  {claimableNowUsd}
                </Text>
              </View>
            </View>
            <View style={flexboxStyles.directionRow}>
              <Button
                disabled={claimWithBurnDisabled}
                onPress={handleClaimWithBurn}
                size="small"
                text={t('Claim with Burn')}
                style={spacings.mrMi}
              />
              <Button
                disabled={claimInxWalletDisabled}
                onPress={handleClaimInxWallet}
                size="small"
                text={t('Claim in xWALLET')}
                style={spacings.mlMi}
              />
            </View>
          </View>

          {shouldDisplayVesting && (
            <View style={[styles.tableRow, shouldDisplayStaked && styles.tableRowBorder]}>
              <View style={[flexboxStyles.directionRow, spacings.mb]}>
                <View style={[spacings.prTy, flexboxStyles.flex1]}>
                  <Text>{t('Claimable early supporters vesting')}</Text>
                </View>
                <View style={[spacings.plTy, styles.tableRowValue]}>
                  <Text color={colors.primaryAccentColor} style={textStyles.right}>
                    {currentClaimStatus.mintableVesting}
                  </Text>
                  <Text type="small" style={textStyles.right}>
                    <Text type="small" color={colors.secondaryAccentColor}>
                      $
                    </Text>
                    {mintableVestingUsd}
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
          {shouldDisplayStaked && (
            <View style={[styles.tableRow, flexboxStyles.directionRow]}>
              <View style={[spacings.prTy, flexboxStyles.flex1]}>
                <Text>{t('Staked WALLET')}</Text>
              </View>
              <View style={[spacings.plTy, styles.tableRowValue]}>
                <Text color={colors.primaryAccentColor} style={textStyles.right}>
                  {stakedAmount}
                </Text>
                <Text type="small" style={textStyles.right}>
                  {xWALLETAPY}% APY
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
