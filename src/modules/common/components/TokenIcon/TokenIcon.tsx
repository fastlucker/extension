import React from 'react'
import { Image, ImageProps, View } from 'react-native'

import styles from './styles'

interface Props extends ImageProps {}

const TokenIcon: React.FC<Props> = (props) => (
  <View style={styles.container}>
    <Image style={styles.img} {...props} />
  </View>
)

export default TokenIcon
