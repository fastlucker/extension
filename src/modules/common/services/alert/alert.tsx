import { Alert, Platform } from 'react-native'

// The alert implementation for React Native for Web is not finished yet.
// So this alert polyfill is a temporary workaround.
// {@link https://github.com/necolas/react-native-web/issues/1026#issuecomment-679102691}
const alertPolyfill = (title?: string, description?: string, options?: any) => {
  // @ts-ignore
  const result = window.confirm([title, description].filter(Boolean).join('\n'))

  if (result) {
    const confirmOption = options.find(({ style }: any) => style !== 'cancel')
    confirmOption && confirmOption.onPress && confirmOption.onPress()
  } else {
    const cancelOption = options.find(({ style }: any) => style === 'cancel')
    cancelOption && cancelOption.onPress && cancelOption.onPress()
  }
}

const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert

export default alert
