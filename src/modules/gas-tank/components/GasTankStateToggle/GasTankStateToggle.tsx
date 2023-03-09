import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import useGasTank from '@common/hooks/useGasTank'
import useToast from '@common/hooks/useToast'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { useTranslation } from '@config/localization'

import styles from './styles'

const GasTankStateToggle = ({ disabled }: { disabled: boolean }) => {
  const { currentAccGasTankState, gasTankState, setGasTankState } = useGasTank()
  const { t } = useTranslation()
  const { addToast } = useToast()

  const handleGasTankEnable = () => {
    if (disabled) {
      addToast(t('You should add assets in the Gas Tank to be able to enable it!') as string, {
        error: true
      })
      return
    }

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
    <View style={[flexboxStyles.alignCenter, spacings.pbLg, spacings.ptSm]}>
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
            !currentAccGasTankState.isEnabled && { borderColor: colors.pink }
          ]}
          textStyle={currentAccGasTankState.isEnabled && { color: colors.titan_50 }}
          onPress={handleGasTankDisable}
        />
      </View>
    </View>
  )
}

export default React.memo(GasTankStateToggle)
