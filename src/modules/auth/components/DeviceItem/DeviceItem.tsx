import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import styles from '@modules/common/components/Button/styles'
import Text from '@modules/common/components/Text'
import useLoader from '@modules/common/hooks/useLoader'
import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

const DeviceItem = ({ device, onSelect }: any) => {
  const { showLoader, hideLoader } = useLoader()

  const handleSelectDevice = async () => {
    showLoader()
    try {
      await onSelect(device)

      setTimeout(() => {
        hideLoader()
      }, 15000)
    } finally {
      hideLoader()
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
    </TouchableOpacity>
  )
}

export default DeviceItem
