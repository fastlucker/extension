import React, { useEffect } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import { MOBILE_ROUTES } from '@common/modules/router/constants/common'
import alert from '@common/services/alert'
import spacings from '@common/styles/spacings'
import text from '@common/styles/utils/text'
import { Portal } from '@gorhom/portal'

import useOnboardingOnFirstLogin from '../../hooks/useOnboardingOnFirstLogin'

const slides = [
  {
    key: '1',
    title: 'Title 1',
    text: 'Description.\nNew line!\nSay something cool!',
    image:
      'https://fastly.picsum.photos/id/794/500/500.jpg?hmac=1saBjisE0yXnOU6Y-GFe2H_t66Mc3rqlzja4DPy_mXA',
    backgroundColor: '#59b2ab',
    textColor: '#000'
  },
  {
    key: '2',
    title: 'Title 2',
    text: 'Other cool stuff',
    image:
      'https://fastly.picsum.photos/id/835/500/500.jpg?hmac=QnpnNG0BSK7JQNhA9VokyFMyhTwTtifkHYHWSsd2YAU',
    backgroundColor: '#febe29',
    textColor: '#000'
  },
  {
    key: '3',
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image:
      'https://fastly.picsum.photos/id/82/500/500.jpg?hmac=SBl_t1w-gmq7jLkcwDJHDQG5MsYX_Pdr3_gTaYW_UaU',
    backgroundColor: '#22bcb5',
    textColor: '#000'
  }
]

const OnboardingOnFirstLoginScreen = () => {
  const { navigate } = useNavigation()
  const { markOnboardingOnFirstLoginAsCompleted, hasCompletedOnboarding } =
    useOnboardingOnFirstLogin()

  useEffect(() => {
    if (hasCompletedOnboarding) {
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
      <Text color={item.textColor} fontSize={20} style={[text.center, spacings.mb]}>
        {item.title}
      </Text>
      <Image
        style={[{ width: '100%', height: 500 }, spacings.mb]}
        resizeMode="contain"
        source={{ uri: item.image }}
      />
      <Text color={item.textColor} style={text.center}>
        {item.text}
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
