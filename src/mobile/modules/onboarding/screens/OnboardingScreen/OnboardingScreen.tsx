import React, { useState } from 'react'
import { StoryContainer } from 'react-native-story-view'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Wrapper from '@common/components/Wrapper'
import alert from '@common/services/alert'
import spacings from '@common/styles/spacings'
import { Portal } from '@gorhom/portal'

const stories = [
  {
    id: 0,
    url: 'https://fastly.picsum.photos/id/247/500/1200.jpg?hmac=Qxkcy0i1NQZ8aOzGEYBQe5K2J28vJgbOGwUq6lZbkCg',
    type: 'image',
    duration: 10,
    isSeen: false
  },
  {
    id: 1,
    url: 'https://fastly.picsum.photos/id/119/500/900.jpg?hmac=ZDACITpOW0ZXrLW_r3Uuk54yNB7IvguLGj8EqMecPUg',
    type: 'image',
    duration: 10,
    isSeen: false
  },
  {
    id: 2,
    url: 'https://fastly.picsum.photos/id/612/500/800.jpg?hmac=y65P4B01kX2eEiTXjyL6uJnDkOHYfLs8K15P38sLT14',
    type: 'image',
    duration: 10,
    isSeen: false
  }
]

enum STATES {
  STORY_VIEW_NOT_VISIBLE = 'STORY_VIEW_NOT_SHOWN',
  STORY_VIEW_VISIBLE = 'STORY_VIEW_VISIBLE',
  SEEN = 'SEEN'
}

const OnBoardingScreen = () => {
  const [state, setState] = useState<STATES>(STATES.STORY_VIEW_NOT_VISIBLE)

  if (state === STATES.STORY_VIEW_VISIBLE) {
    return (
      <Portal hostName="global">
        <StoryContainer
          visible
          stories={stories}
          onComplete={() => setState(STATES.SEEN)}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </Portal>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper contentContainerStyle={spacings.pbLg} extraHeight={220}>
        <Button
          text={state === STATES.SEEN ? 'Watch again' : 'Begin'}
          onPress={() => setState(STATES.STORY_VIEW_VISIBLE)}
        />
        {state === STATES.SEEN && <Button text="Go to dashboard" />}
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default OnBoardingScreen
