import React from 'react'
import { Image, View } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import alert from '@common/services/alert'
import spacings from '@common/styles/spacings'
import text from '@common/styles/utils/text'

const slides = [
  {
    key: '1',
    title: 'Title 1',
    text: 'Description.\nNew line!\nSay something cool!',
    image:
      'https://fastly.picsum.photos/id/816/500/900.jpg?hmac=mF5xS8Kh-icfX2kApvgG9OflK7n-ky_OG86d7DU6mgM',
    backgroundColor: '#59b2ab',
    textColor: '#000'
  },
  {
    key: '2',
    title: 'Title 2',
    text: 'Other cool stuff',
    image:
      'https://fastly.picsum.photos/id/350/500/900.jpg?hmac=utE97R4tx3izZgIA71K3rWI5Agcr0YsJTVNmZHK4TUU',
    backgroundColor: '#febe29',
    textColor: '#000'
  },
  {
    key: '3',
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image:
      'https://fastly.picsum.photos/id/910/500/900.jpg?hmac=ReicwXrm5i65h5jgEm4CyLRubkOzaBIoKhJ0jCSN-aM',
    backgroundColor: '#22bcb5',
    textColor: '#000'
  }
]

const OnboardingOnFirstLoginScreen = () => {
  // const [state, setState] = useState<STATES>(STATES.STORY_VIEW_NOT_VISIBLE)

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

  return <AppIntroSlider renderItem={renderItem} data={slides} onDone={() => console.log('done')} />
}

export default OnboardingOnFirstLoginScreen
