import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import { SafeAreaView } from 'react-native-safe-area-context'

import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import flexbox from '@common/styles/utils/flexbox'
import { Portal } from '@gorhom/portal'
import useOnboardingOnFirstLogin from '@mobile/modules/dashboard/hooks/useOnboardingOnFirstLogin'

import styles from './styles'
import { OnboardingSlide } from './types'

const OnboardingOnFirstLoginScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const {
    slides,
    slidesLoading,
    slidesError,
    markOnboardingOnFirstLoginAsCompleted,
    hasCompletedOnboarding,
    fetchSlides
  } = useOnboardingOnFirstLogin()

  useEffect(() => {
    if (hasCompletedOnboarding) {
      // TODO: Figure out how to make different animation, like a fade in one.
      navigate(`${MOBILE_ROUTES.dashboard}-screen`, {})
    }
  }, [hasCompletedOnboarding, navigate])

  const renderItem = useCallback(
    ({ item }) => (
      <SafeAreaView style={[{ backgroundColor: item.backgroundColor }, flexbox.flex1]}>
        <AmbireLogoHorizontal style={[flexbox.alignSelfCenter, spacings.mtSm]} />
        <Text weight="semiBold" color={item.titleTextColor} fontSize={40} style={styles.titleText}>
          {item.titleText}
        </Text>
        <Image style={flexbox.flex1} resizeMode="contain" source={{ uri: item.image }} />
        <Text
          fontSize={20}
          weight="regular"
          color={item.descriptionTextColor}
          style={styles.descriptionText}
        >
          {item.descriptionText}
        </Text>
      </SafeAreaView>
    ),
    []
  )

  // The lib requires `key` as an unique id prop, use `id` prop instead
  const keyExtractor = useCallback((item: OnboardingSlide) => item.id.toString(), [])

  const NextButton = useCallback(
    () => (
      <Text style={styles.callToActionButton} color={colors.waikawaGray} fontSize={18}>
        {t('Next')}
      </Text>
    ),
    [t]
  )

  const DoneButton = useCallback(
    () => (
      <Text style={styles.callToActionButton} color={colors.waikawaGray} fontSize={18}>
        {t('Done')}
      </Text>
    ),
    [t]
  )

  const renderContent = () => {
    if (slidesLoading) {
      return (
        <View style={[StyleSheet.absoluteFill, flexbox.center, styles.fallbackBackground]}>
          <Spinner />
        </View>
      )
    }

    if (slidesError) {
      return (
        <View style={[StyleSheet.absoluteFill, styles.fallbackBackground]}>
          <SafeAreaView style={flexbox.flex1}>
            <AmbireLogoHorizontal style={[flexbox.alignSelfCenter, spacings.mtSm]} />
            <View style={[flexbox.flex1, flexbox.center]}>
              <Text
                fontSize={20}
                weight="regular"
                color={colors.waikawaGray}
                style={styles.descriptionText}
              >
                {slidesError}
              </Text>

              <View style={flexbox.directionRow}>
                <Button
                  type="outline"
                  accentColor={colors.heliotrope}
                  text={t('Skip')}
                  style={spacings.mhTy}
                  onPress={markOnboardingOnFirstLoginAsCompleted}
                />
                <Button text={t('Try again')} style={spacings.mhTy} onPress={fetchSlides} />
              </View>
            </View>
          </SafeAreaView>
        </View>
      )
    }

    return (
      <AppIntroSlider
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        data={slides}
        onDone={markOnboardingOnFirstLoginAsCompleted}
        renderNextButton={NextButton}
        renderDoneButton={DoneButton}
      />
    )
  }

  if (hasCompletedOnboarding) return null

  return (
    <Portal hostName="global">
      <View style={StyleSheet.absoluteFill}>{renderContent()}</View>
    </Portal>
  )
}

export default React.memo(OnboardingOnFirstLoginScreen)
