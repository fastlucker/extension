import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'

import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRelayerData from '@modules/common/hooks/useRelayerData'

const Rewards = () => {
  const { t } = useTranslation()
  const { sheetRef, openBottomSheet } = useBottomSheet()
  const { account } = useAccounts()
  const [rewardsTotal, setRewardsTotal] = useState(0)
  const { isLoading, data, errMsg } = useRelayerData()

  useEffect(() => {
    if (errMsg || !data || !data.success) return

    const { rewards, multipliers } = data
    if (!rewards.length) return

    const rewardsDetails = Object.fromEntries(
      rewards.map(({ _id, rewards }) => [_id, rewards[account.id] || 0])
    )
    const rewardsTotal = Object.values(rewardsDetails).reduce((acc, curr) => acc + curr, 0)
    rewardsDetails.multipliers = multipliers

    setRewardsTotal(rewardsTotal)
  }, [data, errMsg, account])

  const walletTokensAmount = rewardsTotal.toFixed(3)

  if (isLoading) {
    return <ActivityIndicator />
  }

  return (
    <>
      <Button
        onPress={openBottomSheet}
        text={t('{{walletTokensAmount}} WALLET', { walletTokensAmount })}
      />
      <BottomSheet sheetRef={sheetRef}>
        <Title>{t('Wallet')}</Title>
      </BottomSheet>
    </>
  )
}

export default Rewards
