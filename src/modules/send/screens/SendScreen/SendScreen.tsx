import React, { useRef } from 'react'
import { View } from 'react-native'

import BottomSheet from '@modules/common/components/BottomSheet'
import Button from '@modules/common/components/Button'
import Placeholder from '@modules/common/components/Placeholder'
import Text from '@modules/common/components/Text'

import styles from './styles'

const SendScreen = () => {
  const sheetRef = useRef<any>(0)

  const handleOpen = () => sheetRef.current?.snapTo(1)
  const handleClose = () => sheetRef.current?.snapTo(0)

  return (
    <View style={styles.container}>
      <Button text="Bottom sheet" onPress={handleOpen} />

      <BottomSheet sheetRef={sheetRef}>
        <Text>Hello world!</Text>
      </BottomSheet>
    </View>
  )
}

export default SendScreen
