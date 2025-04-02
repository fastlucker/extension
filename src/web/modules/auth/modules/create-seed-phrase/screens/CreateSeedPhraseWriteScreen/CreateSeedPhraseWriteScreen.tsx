import { setStringAsync } from 'expo-clipboard'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'

import CopyIcon from '@common/assets/svg/CopyIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import getPanelStyles from '@common/components/Panel/styles'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { CARD_WIDTH } from '@web/modules/auth/screens/GetStartedScreen/GetStartedScreen'

const CreateSeedPhraseWriteScreen = () => {
  const { params } = useRoute()
  const seed = useMemo(() => params?.state?.seed || [], [params])
  const { goToNextRoute, goToPrevRoute } = useOnboardingNavigation()
  const { t } = useTranslation()
  const { styles: panelStyles, theme } = useTheme(getPanelStyles)
  const animation = useRef(new Animated.Value(0)).current
  const { addToast } = useToast()
  const { dispatch } = useBackgroundService()

  const panelWidthInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [CARD_WIDTH * 0.25, CARD_WIDTH],
    extrapolate: 'clamp'
  })

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })

  const handleSubmit = () => {
    const seedPhrase = seed.join(' ') || ''

    dispatch({
      type: 'CREATE_NEW_SEED_PHRASE_AND_ADD_FIRST_ACCOUNT',
      params: { seed: seedPhrase }
    })

    goToNextRoute(WEB_ROUTES.keyStoreSetup, { state: { hideBack: true } })
  }

  // useEffect(() => {
  //   if (
  //     accountAdderState.isInitialized &&
  //     // The AccountAdder could have been already initialized with the same or a
  //     // different type. Navigate immediately only if the types match.
  //     accountAdderState.type === 'internal' &&
  //     accountAdderState.subType === 'seed'
  //   ) {
  //     // TODO: This should leads to set device password
  //     navigate(WEB_ROUTES.keyStoreSetup, { state: { hideBack: true } })
  //   }
  // }, [accountAdderState.isInitialized, accountAdderState.subType, accountAdderState.type, navigate])

  // useEffect(() => {
  //   updateStepperState('secure-seed', 'create-seed')
  // }, [updateStepperState])

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 480,
      useNativeDriver: false
    }).start()
  }, [animation])

  const handleCopyToClipboard = useCallback(async () => {
    try {
      const phrase = seed.join(' ')

      await setStringAsync(phrase)
      addToast(t('Recovery Phrase copied to clipboard'))
    } catch {
      addToast(t('Failed to copy Recovery Phrase'))
    }
  }, [addToast, seed, t])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
    >
      <TabLayoutWrapperMainContent>
        <Animated.View
          style={[
            panelStyles.container,
            common.shadowTertiary,
            {
              zIndex: -1,
              overflow: 'hidden',
              alignSelf: 'center',
              width: panelWidthInterpolate
            }
          ]}
        >
          <Panel
            isAnimated
            spacingsSize="small"
            style={{
              ...spacings.ph0,
              ...spacings.pv0,
              minWidth: CARD_WIDTH,
              alignSelf: 'center',
              backgroundColor: 'transparent',
              opacity: opacityInterpolate as any,
              borderWidth: 0
            }}
            showProgress
            step={1}
            totalSteps={2}
            title="Backup Recovery Phrase"
            withBackButton
            onBackButtonPress={() => {
              goToPrevRoute('createNewAccount', { state: { seed } })
            }}
          >
            <View style={[spacings.phLg, spacings.pvLg, spacings.pt]}>
              {/* <View> */}
              <Text style={[spacings.mbXl, spacings.phSm, { textAlign: 'center' }]}>
                {t('Write down and secure the Recovery Phrase for your account.')}
              </Text>
              <View
                style={{
                  ...flexbox.directionRow,
                  ...flexbox.wrap,
                  ...flexbox.justifyCenter,
                  borderWidth: 1,
                  borderColor: theme.secondaryBorder,
                  ...common.borderRadiusPrimary,
                  overflow: 'hidden'
                }}
              >
                {(seed as string[]).map((word, index) => (
                  <View
                    key={`${word}-${seed.indexOf(word)}`}
                    style={{
                      width: '33.33%',
                      borderRightWidth: (index + 1) % 3 === 0 ? 0 : 1,
                      borderBottomWidth: index < 9 ? 1 : 0,
                      borderColor: theme.secondaryBorder,
                      ...spacings.ptMi,
                      ...spacings.pbSm,
                      ...spacings.phMi,
                      ...flexbox.alignCenter,
                      ...flexbox.justifyCenter
                    }}
                  >
                    <View style={[flexbox.directionRow, flexbox.alignCenter, { width: '100%' }]}>
                      <Text fontSize={12} appearance="secondaryText">
                        {index + 1}.
                      </Text>
                    </View>
                    <Text fontSize={14}>{word}</Text>
                  </View>
                ))}
              </View>
              <View
                style={[
                  flexbox.directionRow,
                  flexbox.justifyCenter,
                  flexbox.alignCenter,
                  spacings.pvMi,
                  common.borderRadiusPrimary,
                  spacings.mtMd,
                  spacings.mb2Xl
                ]}
              >
                <TouchableOpacity
                  onPress={handleCopyToClipboard}
                  style={[
                    flexbox.directionRow,
                    flexbox.justifyCenter,
                    flexbox.alignCenter,
                    spacings.pvMi,
                    common.borderRadiusPrimary,
                    { backgroundColor: theme.secondaryBackground, width: '60%' }
                  ]}
                >
                  <Text fontSize={14} weight="medium" appearance="secondaryText">
                    {t('Copy Recovery Phrase')}
                  </Text>

                  <CopyIcon style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
              <Button
                testID="create-seed-phrase-write-continue-btn"
                accessibilityRole="button"
                text={t("I've Saved the Phrase")}
                size="large"
                hasBottomSpacing={false}
                onPress={handleSubmit}
              />
              {/* </View> */}
            </View>
          </Panel>
        </Animated.View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default CreateSeedPhraseWriteScreen
function getExtraEntropy(): string {
  throw new Error('Function not implemented.')
}
