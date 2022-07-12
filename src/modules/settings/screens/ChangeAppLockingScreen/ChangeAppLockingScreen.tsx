import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import Toggle from '@modules/common/components/Toggle'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import usePasscode from '@modules/common/hooks/usePasscode'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { useNavigation } from '@react-navigation/native'

import styles from './styles'

const ChangeAppLockingScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    state,
    lockOnStartup,
    lockWhenInactive,
    enableLockOnStartup,
    disableLockOnStartup,
    enableLockWhenInactive,
    disableLockWhenInactive
  } = usePasscode()

  const renderContent = () => {
    if (state === PASSCODE_STATES.NO_PASSCODE) {
      return (
        <>
          <TextWarning>
            {t('In order to enable it, first you need to create a passcode.')}
          </TextWarning>
          <Button
            text={t('Create passcode')}
            onPress={() => navigation.navigate('passcode-change')}
          />
        </>
      )
    }

    return (
      <>
        <Panel
          type="filled"
          contentContainerStyle={styles.appLockingItemContainer}
          style={spacings.mbTy}
        >
          <Text fontSize={16} weight="regular" numberOfLines={1} style={flexboxStyles.flex1}>
            {t('Lock on startup')}
          </Text>
          <Toggle
            isOn={lockOnStartup}
            label={lockOnStartup ? t('Enabled') : t('Disabled')}
            onToggle={lockOnStartup ? disableLockOnStartup : enableLockOnStartup}
          />
        </Panel>
        <Panel
          type="filled"
          contentContainerStyle={styles.appLockingItemContainer}
          style={spacings.mbTy}
        >
          <Text fontSize={16} weight="regular" numberOfLines={1} style={flexboxStyles.flex1}>
            {t('Lock when inactive')}
          </Text>
          <Toggle
            isOn={lockWhenInactive}
            label={lockWhenInactive ? t('Enabled') : t('Disabled')}
            onToggle={lockWhenInactive ? disableLockWhenInactive : enableLockWhenInactive}
          />
        </Panel>
      </>
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>{renderContent()}</Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ChangeAppLockingScreen
