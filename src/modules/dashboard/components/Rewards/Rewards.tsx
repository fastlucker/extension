import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, TouchableOpacity, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

import CONFIG from '@config/env'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
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

    const { rewards, multipliers } = data
    if (!rewards?.length) return

    const rewardsDetails = Object.fromEntries(
      rewards.map(({ _id, rewards }) => [_id, rewards[account.id] || 0])
    )
    rewardsDetails.multipliers = multipliers
    rewardsDetails.walletTokenAPY = data.walletTokenAPY
    rewardsDetails.adxTokenAPY = data.adxTokenAPY
    rewardsDetails.walletUsdPrice = data.usdPrice
    rewardsDetails.xWALLETAPY = data.xWALLETAPY
    setRewards(rewardsDetails)
  }, [data, errMsg, account])

  const walletTokenAPY = rewards.walletTokenAPY ? (rewards.walletTokenAPY * 100).toFixed(2) : '...'
  const adxTokenAPY = rewards.adxTokenAPY ? (rewards.adxTokenAPY * 100).toFixed(2) : '...'
  const xWALLETAPY = rewards.xWALLETAPY ? (rewards.xWALLETAPY * 100).toFixed(2) : '...'
  const walletTokenUSDPrice = rewards.walletUsdPrice || 0

  const walletTokensAmount = rewardsTotal.toFixed(3)

  const handleReadMore = () => Linking.openURL(BLOG_POST_URL).finally(closeBottomSheet)

  const renderBadge = ({ id, multiplier, icon, name, color }) => {
    const isUnlocked =
      rewards.multipliers && rewards.multipliers.map(({ name }) => name).includes(id)

    return (
      <TouchableOpacity
        disabled={!isUnlocked}
        key={name}
        style={[
          flexboxStyles.center,
          spacings.mhMi,
          { width: 73.409, height: 84.533 },
          !isUnlocked && { opacity: 0.3 }
        ]}
      >
        <Text fontSize={25}>{icon}</Text>
        <Text fontSize={16} weight="semiBold">
          x{multiplier}
        </Text>
        <Svg
          width="73.409"
          height="84.533"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        >
          <Path d="M.5.5v72.234l36.2 11.271 36.2-11.271V.495Z" fill={color} stroke="#ebecff" />
        </Svg>
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
            : t('{{walletTokensAmount}} WALLET Rewards', {
                walletTokensAmount
              })
        }
        style={flexboxStyles.alignSelfCenter}
      />
      <BottomSheet
        id="rewards"
        dynamicInitialHeight={false}
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
        cancelText={t('Close')}
      >
        <Title>{t('Wallet token distribution')}</Title>

        <View style={[flexboxStyles.directionRow, flexboxStyles.center, spacings.mb]}>
          {multiplierBadges.map(renderBadge)}
        </View>

        <Text type="caption" style={[spacings.mbSm, textStyles.center]}>
          <Text type="caption">
            {t(
              'You are receiving $WALLETS for holding funds on your Ambire wallet as an early user.'
            )}
          </Text>
          <Text onPress={handleReadMore} underline type="caption">
            {t('Read More')}
          </Text>
        </Text>

        <Row index={0}>
          <View style={[spacings.prTy, flexboxStyles.flex1]}>
            <Text>{t('Early users Incentive')}</Text>
          </View>
          <View style={[spacings.plTy, { width: 200 }]}>
            <Text color={colors.primaryAccentColor} style={[textStyles.right, spacings.mbTy]}>
              {rewards[RewardIds.BALANCE_REWARDS]}
            </Text>
            <Text>{walletTokenAPY}%</Text>
          </View>
        </Row>
        <Row index={1}>
          <View style={[spacings.prTy, flexboxStyles.flex1]}>
            <Text>{t('ADX Staking Bonus')}</Text>
          </View>
          <View style={[spacings.plTy, { width: 200 }]}>
            <Text color={colors.primaryAccentColor} style={[textStyles.right, spacings.mbTy]}>
              {rewards[RewardIds.ADX_REWARDS]}
            </Text>
            <Text>{adxTokenAPY}%</Text>
          </View>
        </Row>
        <Row index={2}>
          <View style={flexboxStyles.directionRow}>
            <Button disabled size="small" text={t('Claim with Burn')} style={spacings.mrMi} />
            <Button disabled size="small" text={t('Claim in xWALLET')} style={spacings.mlMi} />
          </View>
        </Row>
        <Row index={3}>
          <View style={[spacings.prTy, flexboxStyles.flex1]}>
            <Text>{t('Claimable early supporters vesting')}</Text>
          </View>
          <View style={[spacings.plTy, { width: 200 }]}>
            <Text color={colors.primaryAccentColor} style={[textStyles.right, spacings.mbTy]}>
              {rewards[RewardIds.ADX_REWARDS]}
            </Text>
          </View>
        </Row>
        <Row index={4} style={spacings.mb}>
          <View style={flexboxStyles.flex1}>
            <Button disabled size="small" text={t('Claim')} />
          </View>
        </Row>
      </BottomSheet>
    </>
  )
}

export default Rewards
