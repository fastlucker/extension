import React from 'react'
import { TouchableOpacity } from 'react-native'
import Toast, { BaseToast } from 'react-native-toast-message'

import Text from '@modules/common/components/Text'

import styles from './styles'

const toastConfig: any = {
  base: (props: any) => (
    <BaseToast
      {...props}
      style={styles.toast}
      contentContainerStyle={styles.container}
      text1Style={styles.text1}
    />
  ),
  sticky: (props: any) => (
    <BaseToast
      {...props}
      style={styles.toast}
      contentContainerStyle={styles.container}
      text1Style={styles.text1}
      renderTrailingIcon={() => (
        <TouchableOpacity style={styles.trailingIcon} onPress={() => Toast.hide()}>
          <Text>❌</Text>
        </TouchableOpacity>
      )}
    />
  )
}

function ToastComponent() {
  return <Toast position="bottom" bottomOffset={85} visibilityTime={8000} config={toastConfig} />
}

export default ToastComponent
