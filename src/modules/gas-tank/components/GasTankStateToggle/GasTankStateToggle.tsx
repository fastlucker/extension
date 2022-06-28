import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import useGasTank from '@modules/common/hooks/useGasTank'
import { colorPalette as colors } from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

const GasTankStateToggle = () => {
  const { currentAccGasTankState, gasTankState, setGasTankState } = useGasTank()
  const { t } = useTranslation()

  const handleGasTankEnable = () => {
    const updatedGasTankDetails = gasTankState.map((item) =>
      item.account === currentAccGasTankState.account ? { ...item, isEnabled: true } : item
    )
    setGasTankState(updatedGasTankDetails)
  }

  const handleGasTankDisable = () => {
    const updatedGasTankDetails = gasTankState.map((item) =>
      item.account === currentAccGasTankState.account ? { ...item, isEnabled: false } : item
    )
    setGasTankState(updatedGasTankDetails)
  }

  return (
    <View style={flexboxStyles.alignCenter}>
      <View style={styles.toggleWrapper}>
        <Button
          text={t('Enabled')}
          hasBottomSpacing={false}
          size="small"
          type={currentAccGasTankState.isEnabled ? 'outline' : 'secondary'}
          style={[
            { borderWidth: 1 },
            !currentAccGasTankState.isEnabled && {
              backgroundColor: 'transparent',
              borderColor: 'transparent'
            }
          ]}
          textStyle={!currentAccGasTankState.isEnabled && { color: colors.titan_50 }}
          onPress={handleGasTankEnable}
        />
        <Button
          text={t('Disabled')}
          hasBottomSpacing={false}
          size="small"
          type="secondary"
          style={[
            { borderWidth: 1 },
            currentAccGasTankState.isEnabled && { backgroundColor: 'transparent' },
            !currentAccGasTankState.isEnabled && { borderColor: colors.waikawaGray }
          ]}
          textStyle={currentAccGasTankState.isEnabled && { color: colors.titan_50 }}
          onPress={handleGasTankDisable}
        />
      </View>
    </View>
  )
}

export default React.memo(GasTankStateToggle)
