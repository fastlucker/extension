import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, Pressable, StyleSheet, View } from 'react-native'

// @ts-ignore
import missedRewardsImg from '@common/assets/images/missedRewards.png'
// @ts-ignore
import tokensEarnedImg from '@common/assets/images/tokensEarned.png'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { storage } from '@web/extension-services/background/webapi/storage'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import PinExtension from '@web/modules/onboarding/components/PinExtension/PinExtension'

import ConfettiAnimation from '../../components/ConfettiAnimation'
import getStyles from './styles'

const OnBoardingCompletedScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const [isOnBoarded, setIsOnBoarded] = useState<boolean | undefined>(undefined)
  const [showRewards, setShowRewards] = useState(false)
  const { params } = useRoute()
  const { accounts } = useAccountsControllerState()

  useEffect(() => {
    if (!params?.validSession) {
      navigate(WEB_ROUTES.dashboard)
    }
  }, [params?.validSession, navigate])

  useEffect(() => {
    if (accounts.some((acc) => acc.newlyCreated)) {
      setShowRewards(true)
    }
  }, [accounts])

  useEffect(() => {
    if (accounts.length && isOnBoarded !== undefined) {
      storage.set('isOnBoarded', true)
    }
  }, [accounts.length, isOnBoarded])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      const onBoarded: boolean = await storage.get('isOnBoarded', false)
      setIsOnBoarded(onBoarded)
    })()
  }, [navigate])

  const renderMissedRewards = useCallback(() => {
    return (
      <>
        <Image style={styles.missedRewardsImg} source={missedRewardsImg} />
        <Text weight="medium" fontSize={20} style={[text.center, spacings.mb2Xl]}>
          {t(
            "You've successfully imported a view-only account. If you create a new smart account, you will get $WALLET rewards!"
          )}
        </Text>
        <Pressable
          onPress={() => {
            Linking.openURL('https://help.ambire.com/hc/en-us/articles/12506346827036')
          }}
        >
          <Text underline appearance="primary" fontSize={14} weight="medium" style={text.center}>
            {t('Learn how to get a reward')}
          </Text>
        </Pressable>
      </>
    )
  }, [styles, t])

  const renderRewards = useCallback(() => {
    return (
      <>
        <View style={styles.confettiAnimationContainer}>
          <ConfettiAnimation />
        </View>
        <Image style={styles.tokensImg} source={tokensEarnedImg} />
        <Text weight="medium" fontSize={20} style={[text.center, spacings.mb2Xl]}>
          {t(
            'Congratulations on creating a new hot wallet! You earned $WALLET just by doing that!'
          )}
        </Text>
        <Pressable
          onPress={() => {
            Linking.openURL('https://blog.ambire.com/announcing-the-wallet-token/')
          }}
        >
          <Text underline appearance="primary" fontSize={14} weight="medium" style={text.center}>
            {t('Check how you can earn more')}
          </Text>
        </Pressable>
      </>
    )
  }, [styles, t])

  if (isOnBoarded === undefined)
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.alignCenter, flexbox.justifyCenter]}>
        <Spinner />
      </View>
    )

  return (
    <TabLayoutContainer
      width="md"
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content" withAmbireLogo={isOnBoarded}>
          {!isOnBoarded && <PinExtension style={styles.pinExtension} />}
        </Header>
      }
      {...(isOnBoarded
        ? {
            footer: (
              <View style={[flexbox.flex1, flexbox.alignEnd]}>
                <Button
                  onPress={() => navigate(ROUTES.dashboard)}
                  hasBottomSpacing={false}
                  text={t('Go to Dashboard')}
                >
                  <View style={spacings.pl}>
                    <RightArrowIcon color={colors.titan} />
                  </View>
                </Button>
              </View>
            )
          }
        : {})}
    >
      <TabLayoutWrapperMainContent
        style={[!isOnBoarded && spacings.pt2Xl]}
        contentContainerStyle={{ ...flexbox.alignCenter, ...flexbox.justifyCenter, flexGrow: 1 }}
      >
        <Panel style={{ width: 442, ...spacings.pt2Xl }}>
          {!!showRewards && renderRewards()}
          {!showRewards && renderMissedRewards()}
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(OnBoardingCompletedScreen)
