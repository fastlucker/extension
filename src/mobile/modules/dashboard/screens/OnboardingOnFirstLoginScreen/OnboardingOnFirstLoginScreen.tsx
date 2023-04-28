import React, { useEffect } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'

import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import { MOBILE_ROUTES } from '@common/modules/router/constants/common'
import spacings, { DEVICE_HEIGHT } from '@common/styles/spacings'
import text from '@common/styles/utils/text'
import { Portal } from '@gorhom/portal'

import useOnboardingOnFirstLogin from '../../hooks/useOnboardingOnFirstLogin'
import { OnboardingSlide } from './types'

// TODO: Pull these from a Relayer route.
const slides: OnboardingSlide[] = [
  {
    key: '1',
    titleText: 'Swap crypto seamlessly',
    descriptionText: 'Get the top rates & exchange immediately, right at your fingertips',
    image:
      'https://fastly.picsum.photos/id/794/500/500.jpg?hmac=1saBjisE0yXnOU6Y-GFe2H_t66Mc3rqlzja4DPy_mXA',
    backgroundColor: '#EBECFF',
    titleTextColor: '#904DFF',
    descriptionTextColor: '#24263D'
  },
  {
    key: '2',
    titleText: 'Title 2',
    descriptionText: 'Other cool stuff',
    image:
      'https://fastly.picsum.photos/id/835/500/500.jpg?hmac=QnpnNG0BSK7JQNhA9VokyFMyhTwTtifkHYHWSsd2YAU',
    backgroundColor: '#febe29',
    titleTextColor: '#904DFF',
    descriptionTextColor: '#24263D'
  },
  {
    key: '3',
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
  const { navigate } = useNavigation()
  const { markOnboardingOnFirstLoginAsCompleted, hasCompletedOnboarding } =
    useOnboardingOnFirstLogin()

  useEffect(() => {
    if (hasCompletedOnboarding) {
      // TODO: Figure out how to make different animation, like a fade in one.
      navigate(`${MOBILE_ROUTES.dashboard}-screen`, {})
    }
  }, [hasCompletedOnboarding, navigate])

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: item.backgroundColor,
        flex: 1,
        justifyContent: 'center'
      }}
    >
      {console.log(item)}
      {/* TODO: Logo */}
      <Text
        weight="semiBold"
        color={item.titleTextColor}
        fontSize={40}
        style={[text.center, spacings.mb]}
      >
        {item.titleText}
      </Text>
      <Image
        style={[{ width: '100%', height: DEVICE_HEIGHT / 2 }, spacings.mb]}
        resizeMode="contain"
        source={{ uri: item.image }}
      />
      <Text fontSize={20} weight="regular" color={item.descriptionTextColor} style={text.center}>
        {item.descriptionText}
      </Text>
    </View>
  )

  if (hasCompletedOnboarding) return null

  return (
    <Portal hostName="global">
      <View style={StyleSheet.absoluteFill}>
        <AppIntroSlider
          renderItem={renderItem}
          data={slides}
          onDone={markOnboardingOnFirstLoginAsCompleted}
        />
      </View>
    </Portal>
  )
}

export default OnboardingOnFirstLoginScreen
