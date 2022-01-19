import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Linking } from 'react-native'

import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button, { BUTTON_SIZES, BUTTON_TYPES } from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import colors from '@modules/common/styles/colors'

const BLOG_POST_URL = 'https://blog.ambire.com/announcing-the-wallet-token-a137aeda9747'

const Rewards = () => {
  const { t } = useTranslation()
  const { sheetRef, openBottomSheet, closeBottomSheet } = useBottomSheet()
  const { account } = useAccounts()
  const { isLoading, data, errMsg } = useRelayerData()
  const [rewards, setRewards] = useState({})
  const [rewardsTotal, setRewardsTotal] = useState<number>(0)

  useEffect(() => {
    if (errMsg || !data || !data.success) return

    if (!data.rewards.length) return

    const rewardsDetails = Object.fromEntries(
      data.rewards.map(({ _id, rewards: _rewards }) => [_id, _rewards[account.id] || 0])
    )
    const total = Object.values(rewardsDetails).reduce((acc, curr) => acc + curr, 0)
    rewardsDetails.multipliers = data.multipliers

    setRewardsTotal(total)
    setRewards(rewardsDetails)
  }, [data, errMsg, account])

  const walletTokensAmount = rewardsTotal.toFixed(3)

  const handleReadMore = () => Linking.openURL(BLOG_POST_URL).finally(closeBottomSheet)

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
      <BottomSheet sheetRef={sheetRef} cancelText={t('Close')}>
        <Title>{t('Wallet')}</Title>
        {!!rewards?.multipliers &&
          rewards?.multipliers.map(({ mul, name }) => (
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
