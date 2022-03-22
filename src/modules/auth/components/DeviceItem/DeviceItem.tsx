import React, { useState } from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import styles from '@modules/common/components/Button/styles'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

const DeviceItem = ({ device, onSelect, type }: any) => {
  const [pending, setPending] = useState(false)

  const handleSelectDevice = async () => {
    setPending(true)
    try {
      await onSelect(device, type)

      setTimeout(() => {
        setPending(false)
      }, 15000)
    } finally {
      setPending(false)
    }
  }

  return (
    <TouchableOpacity
      onPress={handleSelectDevice}
      style={[
        styles.buttonContainer,
        styles.buttonContainerStylesSizeRegular,
        styles.buttonContainerOutline,
        flexboxStyles.directionRow
      ]}
    >
      <Text style={[styles.buttonTextOutline, styles.buttonTextStylesSizeRegular]}>
        {` ${device?.name} `}
      </Text>
      {pending ? <ActivityIndicator color={colors.primaryIconColor} /> : null}
    </TouchableOpacity>
  )
}

export default DeviceItem
