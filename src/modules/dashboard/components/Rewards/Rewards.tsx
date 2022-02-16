import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

import CONFIG from '@config/env'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button, { BUTTON_SIZES, BUTTON_TYPES } from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import { Row } from '@modules/common/components/Table'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const BLOG_POST_URL = 'https://blog.ambire.com/announcing-the-wallet-token-a137aeda9747'

type Multiplier = {
  mul: number
  name: string
}

enum RewardIds {
  ADX_REWARDS = 'adx-rewards',
  BALANCE_REWARDS = 'balance-rewards'
}

type RewardsType = {
  [RewardIds.ADX_REWARDS]: number
  [RewardIds.BALANCE_REWARDS]: number
  multipliers: Multiplier[]
}

type RewardsData = {
  _id: RewardIds
  rewards: { [accountId: string]: number }
  updated: string // timestamp, example: "2022-01-20T08:49:56.333Z"
}

const rewardsInitialState = {
  'adx-rewards': 0,
  'balance-rewards': 0,
  multipliers: []
}

const Rewards = () => {
  const { t } = useTranslation()
  const { sheetRef, openBottomSheet, closeBottomSheet, isOpen } = useBottomSheet()
  const { account, selectedAcc } = useAccounts()
  const [cacheBreak, setCacheBreak] = useState(() => Date.now())

  useEffect(() => {
    if (Date.now() - cacheBreak > 5000) setCacheBreak(Date.now())
    const intvl = setTimeout(() => setCacheBreak(Date.now()), 30000)
    return () => clearTimeout(intvl)
  }, [cacheBreak])

  const url =
    CONFIG.RELAYER_URL && selectedAcc
      ? `${CONFIG.RELAYER_URL}/wallet-token/rewards/${selectedAcc}?cacheBreak=${cacheBreak}`
      : null

  const { isLoading, data, errMsg } = useRelayerData(url)
  const [rewards, setRewards] = useState<RewardsType>(rewardsInitialState)
  const [rewardsTotal, setRewardsTotal] = useState<number>(0)

  useEffect(() => {
    if (errMsg || !data || !data.success) return

    if (!data.rewards.length) return

    // @ts-ignore not sure why this type is complaining, types mismatch a bit.
    // but the end result matches this structure:
    // {
    //   [RewardIds.ADX_REWARDS]: number
    //   [RewardIds.BALANCE_REWARDS]: number
    // }
    const rewardsDetails: {
      [RewardIds.ADX_REWARDS]: number
      [RewardIds.BALANCE_REWARDS]: number
    } = Object.fromEntries<RewardsData[]>(
      data.rewards.map(({ _id, rewards: _rewards }: RewardsData) => [
        _id,
        _rewards[account.id] || 0
      ])
    )

    const total = Object.values(rewardsDetails).reduce((acc, curr) => acc + curr, 0)
    const rewardsDetailsWithMultipliers: RewardsType = {
      ...rewardsDetails,
      multipliers: data.multipliers
    }

    setRewardsTotal(total)
    setRewards(rewardsDetailsWithMultipliers)
  }, [data, errMsg, account])

  const walletTokensAmount = rewardsTotal.toFixed(3)

  const handleReadMore = () => Linking.openURL(BLOG_POST_URL).finally(closeBottomSheet)

  const claimButton = (
    <>
      <Button
        type={BUTTON_TYPES.SECONDARY}
        accentColor={colors.primaryAccentColor}
        disabled
        size={BUTTON_SIZES.SMALL}
        text={t('Claim')}
        style={styles.buttonClaim}
      />
      <Text fontSize={14} style={textStyles.right}>
        {t('Claiming will be available after the official token launch')}
      </Text>
    </>
  )

  return (
    <>
      <Button
        onPress={openBottomSheet}
        type={BUTTON_TYPES.SECONDARY}
        accentColor={colors.primaryAccentColor}
        text={
          isLoading ? t('Updating...') : t('{{walletTokensAmount}} WALLET', { walletTokensAmount })
        }
        style={styles.button}
        size={BUTTON_SIZES.SMALL}
      />
      <BottomSheet
        id="rewards"
        dynamicInitialHeight={false}
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
        cancelText={t('Close')}
      >
        <Title>{t('Wallet')}</Title>

        <Row index={0}>
          <View style={[spacings.prTy, flexboxStyles.flex1]}>
            <Text>{t('Early users Incentive')}</Text>
          </View>
          <View style={[spacings.plTy, { width: 200 }]}>
            <Text color={colors.primaryAccentColor} style={[textStyles.right, spacings.mbTy]}>
              {rewards[RewardIds.BALANCE_REWARDS]}
            </Text>
            {claimButton}
          </View>
        </Row>
        <Row index={1} style={spacings.mb}>
          <View style={[spacings.prTy, flexboxStyles.flex1]}>
            <Text>{t('ADX Staking Bonus')}</Text>
          </View>
          <View style={[spacings.plTy, { width: 200 }]}>
            <Text color={colors.primaryAccentColor} style={[textStyles.right, spacings.mbTy]}>
              {rewards[RewardIds.ADX_REWARDS]}
            </Text>
            {claimButton}
          </View>
        </Row>

        {rewards.multipliers.map(({ mul, name }) => (
          <Button
            accentColor={colors.primaryAccentColor}
            type={BUTTON_TYPES.SECONDARY}
            text={t('{{mul}}x {{name}} multiplier', { mul, name })}
            disabled
            key={name}
          />
        ))}
        <P>
          {t(
            'You are receiving $WALLETS for holding funds on your Ambire wallet as an early user. Have in mind that $WALLET has not launched yet.'
          )}
        </P>
        <Button onPress={handleReadMore} text={t('Read more')} />
      </BottomSheet>
    </>
  )
}

export default Rewards
