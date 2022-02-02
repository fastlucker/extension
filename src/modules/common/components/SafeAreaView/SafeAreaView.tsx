import React from 'react'
import {
  Platform,
  SafeAreaView as SafeAreaViewRN,
  StatusBar,
  StyleSheet,
  ViewProps
} from 'react-native'

import spacings from '@modules/common/styles/spacings'

const styles = StyleSheet.create({
  wrapper: {
    ...spacings.mhSm,
    ...spacings.mv,
    // SafeAreaView doesn't take into consideration the notch or the status bar
    // of Android devices. So bump up the spacings a bit.
    // {@link https://stackoverflow.com/a/55017347/1333836}
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  }
})

interface Props extends ViewProps {}

const SafeAreaView: React.FC<Props> = ({ children, ...rest }) => (
  <SafeAreaViewRN {...rest} style={[styles.wrapper, rest.style]}>
    {children}
  </SafeAreaViewRN>
)

export default SafeAreaView
