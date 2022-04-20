import { LayoutAnimation, LayoutAnimationConfig, UIManager } from 'react-native'

import { isAndroid } from '@config/env'

// FIXME: Temporary disable this on Android, because it is glitchy.
// In order to get Layout API to work on Android.
// {@link https://reactnative.dev/docs/layoutanimation}
if (isAndroid && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export const LINEAR_OPACITY_ANIMATION = LayoutAnimation.create(450, 'linear', 'opacity')

export const triggerLayoutAnimation = (
  config: LayoutAnimationConfig = LayoutAnimation.Presets.spring,
  forceAnimate = false
) => {
  // FIXME: Due to various issues with this API on Android, like
  // the animation executes, but then the whole screen fades away
  // and fades back in in a couple of seconds, temporary disable
  // all animations on Android
  if (isAndroid && !forceAnimate) return

  return LayoutAnimation.configureNext(config)
}
