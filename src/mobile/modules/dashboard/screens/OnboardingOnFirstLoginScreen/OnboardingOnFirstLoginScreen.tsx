import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import { SafeAreaView } from 'react-native-safe-area-context'

import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import { MOBILE_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import flexbox from '@common/styles/utils/flexbox'
import { Portal } from '@gorhom/portal'

import useOnboardingOnFirstLogin from '../../hooks/useOnboardingOnFirstLogin'
import styles from './styles'
import { OnboardingSlide } from './types'

// TODO: Pull these from a Relayer route.
const slides: OnboardingSlide[] = [
  {
    id: 1,
    titleText: 'Swap crypto seamlessly',
    descriptionText: 'Get the top rates & exchange immediately, right at your fingertips',
    image:
      'https://fastly.picsum.photos/id/794/500/500.jpg?hmac=1saBjisE0yXnOU6Y-GFe2H_t66Mc3rqlzja4DPy_mXA',
    backgroundColor: '#EBECFF',
    titleTextColor: '#904DFF',
    descriptionTextColor: '#24263D'
  },
  {
    id: 2,
    titleText: 'Title 2',
    descriptionText: 'Other cool stuff',
    image:
      'https://fastly.picsum.photos/id/835/500/500.jpg?hmac=QnpnNG0BSK7JQNhA9VokyFMyhTwTtifkHYHWSsd2YAU',
    backgroundColor: '#febe29',
    titleTextColor: '#904DFF',
    descriptionTextColor: '#24263D'
  },
  {
    id: 3,
    titleText: 'Rocket guy',
    descriptionText: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image:
      'https://fastly.picsum.photos/id/82/500/500.jpg?hmac=SBl_t1w-gmq7jLkcwDJHDQG5MsYX_Pdr3_gTaYW_UaU',
    backgroundColor: '#59b2ab',
    titleTextColor: '#904DFF',
    descriptionTextColor: '#24263D'
  }
]

const OnboardingOnFirstLoginScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { markOnboardingOnFirstLoginAsCompleted, hasCompletedOnboarding } =
    useOnboardingOnFirstLogin()

  useEffect(() => {
    if (hasCompletedOnboarding) {
      // TODO: Figure out how to make different animation, like a fade in one.
      navigate(`${MOBILE_ROUTES.dashboard}-screen`, {})
    }
  }, [hasCompletedOnboarding, navigate])

  const renderItem = useCallback(
    ({ item }) => (
      <SafeAreaView style={[{ backgroundColor: item.backgroundColor }, flexbox.flex1]}>
        {/* TODO: Logo */}
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
  const keyExtractor = useCallback((item) => item.id.toString(), [])

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

  if (hasCompletedOnboarding) return null

  return (
    <Portal hostName="global">
      <View style={StyleSheet.absoluteFill}>
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
      </View>
    </Portal>
  )
}

export default OnboardingOnFirstLoginScreen
