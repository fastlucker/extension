import { setStringAsync } from 'expo-clipboard'
import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'

import CopyIcon from '@common/assets/svg/CopyIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import { getPanelPaddings } from '@common/components/Panel/Panel'
import getPanelStyles from '@common/components/Panel/styles'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useWindowSize from '@common/hooks/useWindowSize'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { CARD_WIDTH } from '@web/modules/auth/screens/GetStartedScreen/GetStartedScreen'

const generateConfirmationWords = (seed: string[]) => {
  // Split the input array into groups of three words
  const wordGroups = []
  for (let i = 0; i < 12; i += 3) {
    wordGroups.push(seed.slice(i, i + 3))
  }

  // Initialize an array to store the randomly selected words
  const confirmationWords: { numberInSeed: number; word: string }[] = []

  // Select one random word from each group
  wordGroups.forEach((group, groupIndex) => {
    const randomIndex = Math.floor(Math.random() * (group.length - 1))
    const indexOfWord = groupIndex * 3 + randomIndex

    confirmationWords.push({
      numberInSeed: indexOfWord + 1,
      word: group[randomIndex]
    })
  })

  return confirmationWords
}

const CreateSeedPhraseWriteScreen = () => {
  const {
    state: { seed, confirmationWords }
  } = useRoute()
  const { updateStepperState } = useStepper()
  const { t } = useTranslation()
  const { styles: panelStyles, theme } = useTheme(getPanelStyles)
  const { navigate } = useNavigation()
  const animation = useRef(new Animated.Value(0)).current
  const { maxWidthSize } = useWindowSize()
  const panelPaddingStyle = getPanelPaddings(maxWidthSize)
  const { addToast } = useToast()

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
    navigate(WEB_ROUTES.createSeedPhraseConfirm, {
      state: {
        // Try to use the same confirmation words if the user navigates back
        confirmationWords: confirmationWords || generateConfirmationWords(seed),
        seed
      }
    })
  }

  useEffect(() => {
    updateStepperState('secure-seed', 'create-seed')
  }, [updateStepperState])

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
            showBackButton
            onBackPress={() => {
              navigate(WEB_ROUTES.createSeedPhrasePrepare, { state: { seed } })
            }}
          >
            <View style={[panelPaddingStyle, spacings.pt]}>
              <View style={{ width: CARD_WIDTH - 48 }}>
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
              </View>
            </View>
          </Panel>
        </Animated.View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default CreateSeedPhraseWriteScreen
