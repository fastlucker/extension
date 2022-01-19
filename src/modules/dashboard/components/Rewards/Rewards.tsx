import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button, { BUTTON_SIZES, BUTTON_TYPES } from '@modules/common/components/Button'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import colors from '@modules/common/styles/colors'

const Rewards = () => {
  const { t } = useTranslation()
  const { sheetRef, openBottomSheet } = useBottomSheet()
  const { account } = useAccounts()
  const { isLoading, data, errMsg } = useRelayerData()
  const [rewardsTotal, setRewardsTotal] = useState<number>(0)

  useEffect(() => {
    if (errMsg || !data || !data.success) return

    const { rewards, multipliers } = data
    if (!rewards.length) return

    const rewardsDetails = Object.fromEntries(
      rewards.map(({ _id, rewards }) => [_id, rewards[account.id] || 0])
    )
    const total = Object.values(rewardsDetails).reduce((acc, curr) => acc + curr, 0)
    rewardsDetails.multipliers = multipliers

    setRewardsTotal(total)
  }, [data, errMsg, account])

  const walletTokensAmount = rewardsTotal.toFixed(3)

  if (isLoading) {
    return <ActivityIndicator />
  }

  return (
    <>
      <Button
        onPress={openBottomSheet}
        type={BUTTON_TYPES.SECONDARY}
        accentColor={colors.secondaryAccentColor}
        text={t('{{walletTokensAmount}} WALLET', { walletTokensAmount })}
        style={{ width: 'auto' }}
        size={BUTTON_SIZES.SMALL}
      />
      <BottomSheet sheetRef={sheetRef}>
        <Title>{t('Wallet')}</Title>
      </BottomSheet>
    </>
  )
}

export default Rewards
