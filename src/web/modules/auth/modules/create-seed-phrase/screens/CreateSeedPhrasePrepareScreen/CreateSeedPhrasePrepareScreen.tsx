import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Pressable, View } from 'react-native'

import { EntropyGenerator } from '@ambire-common/libs/entropyGenerator/entropyGenerator'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import Panel from '@common/components/Panel'
import getPanelStyles from '@common/components/Panel/styles'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useExtraEntropy from '@common/hooks/useExtraEntropy'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import { CARD_WIDTH } from '@web/modules/auth/screens/GetStartedScreen/GetStartedScreen'

const CHECKBOXES = [
  {
    id: 0,
    label: 'Your recovery phrase is private. Keep it safe and never share it.'
  },
  {
    id: 1,
    label: 'If your recovery phrase is at risk, so is your account.'
  },
  {
    id: 2,
    label: 'Use your recovery phrase only to access or recover your smart wallet.'
  }
]

const CreateSeedPhrasePrepareScreen = () => {
  const { goToNextRoute, goToPrevRoute } = useOnboardingNavigation()
  const { accounts } = useAccountsControllerState()
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { theme } = useTheme()
  const [checkboxesState, setCheckboxesState] = useState([false, false, false])
  const allCheckboxesChecked = checkboxesState.every((checkbox) => checkbox)
  const keystoreState = useKeystoreControllerState()
  const { styles: panelStyles } = useTheme(getPanelStyles)
  const animation = useRef(new Animated.Value(0)).current

  const { getExtraEntropy } = useExtraEntropy()

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

  const handleSubmit = useCallback(() => {
    const entropyGenerator = new EntropyGenerator()
    const seed = entropyGenerator.generateRandomMnemonic(12, getExtraEntropy()).phrase

    if (!seed) {
      addToast('Failed to generate seed phrase', { type: 'error' })
      return
    }

    goToNextRoute('createNewAccount', { seed: seed.split(' ') })
  }, [addToast, getExtraEntropy, goToNextRoute])

  // prevent proceeding with new seed phrase setup if there is a saved seed phrase already associated with the keystore
  useEffect(() => {
    if (keystoreState.hasKeystoreSavedSeed) goToPrevRoute()
  }, [goToPrevRoute, keystoreState.hasKeystoreSavedSeed])

  const handleCheckboxPress = (id: number) => {
    setCheckboxesState((prevState) => {
      const newState = [...prevState]
      newState[id] = !prevState[id]
      return newState
    })
  }

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 480,
      useNativeDriver: false
    }).start()
  }, [animation])

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
            title="Create New Recovery Phrase"
            withBackButton
            onBackButtonPress={() => {
              // TODO: use new navigation
              if (accounts.length) {
                navigate(WEB_ROUTES.dashboard)
                return
              }
              goToPrevRoute()
            }}
          >
            <View style={[spacings.phLg, spacings.pvLg, spacings.pt]}>
              <View>
                <Text style={[spacings.mbXl]}>
                  {t('Before you begin, check these security tips.')}
                </Text>
                {CHECKBOXES.map(({ id, label }, index) => (
                  <View
                    key={id}
                    style={[
                      spacings.pvSm,
                      spacings.phSm,
                      flexbox.directionRow,
                      flexbox.alignCenter,
                      spacings.mbSm,
                      {
                        backgroundColor: theme.secondaryBackground,
                        borderRadius: BORDER_RADIUS_PRIMARY
                      }
                    ]}
                  >
                    <Checkbox
                      style={spacings.mb0}
                      value={checkboxesState[id]}
                      onValueChange={() => {
                        handleCheckboxPress(id)
                      }}
                    />
                    <Pressable
                      testID={`create-seed-prepare-checkbox-${index}`}
                      style={flexbox.flex1}
                      onPress={() => handleCheckboxPress(id)}
                    >
                      <Text appearance="secondaryText" fontSize={14}>
                        {t(label)}
                      </Text>
                    </Pressable>
                  </View>
                ))}
                <Button
                  testID="review-seed-phrase-btn"
                  disabled={!allCheckboxesChecked}
                  accessibilityRole="button"
                  size="large"
                  text={t('Show Recovery Phrase')}
                  style={spacings.mt2Xl}
                  hasBottomSpacing={false}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          </Panel>
        </Animated.View>
      </TabLayoutWrapperMainContent>
      {/* TODO: Delete it */}
      {/* <CreateSeedPhraseSidebar currentStepId="prepare" /> */}
    </TabLayoutContainer>
  )
}

export default React.memo(CreateSeedPhrasePrepareScreen)
