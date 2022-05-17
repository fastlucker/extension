import { LayoutAnimation, LayoutAnimationConfig, UIManager } from 'react-native'

import { isAndroid } from '@config/env'

type Props = {
  config?: LayoutAnimationConfig
  forceAnimate?: boolean
}

// FIXME: Temporary disable this on Android, because it is glitchy.
// In order to get Layout API to work on Android.
// {@link https://reactnative.dev/docs/layoutanimation}
if (isAndroid && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export const LINEAR_OPACITY_ANIMATION = LayoutAnimation.create(450, 'linear', 'opacity')

export const triggerLayoutAnimation = (
  props: Props = {
    config: LayoutAnimation.Presets.spring,
    forceAnimate: false
  }
) => {
  // FIXME: Due to various issues with this API on Android, like
  // the animation executes, but then the whole screen fades away
  // and fades back in in a couple of seconds, temporary disable
  // all animations on Android
  if (isAndroid && !props.forceAnimate) return

  return LayoutAnimation.configureNext(props.config || LayoutAnimation.Presets.spring)
}
