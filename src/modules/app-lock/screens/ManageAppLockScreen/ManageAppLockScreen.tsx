import React from 'react'

import { useTranslation } from '@config/localization'
import useAppLock from '@modules/app-lock/hooks/useAppLock'
import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import Toggle from '@modules/common/components/Toggle'
import Wrapper from '@modules/common/components/Wrapper'
import useBiometrics from '@modules/common/hooks/useBiometrics'
import useToast from '@modules/common/hooks/useToast'
import alert from '@modules/common/services/alert'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

const ManageAppLockScreen = () => {
  const { t } = useTranslation()
  const { lockWhenInactive, enableLockWhenInactive, disableLockWhenInactive } = useAppLock()

  const renderContent = () => {
    return (
      <Panel
        type="filled"
        contentContainerStyle={styles.appLockingItemContainer}
        style={spacings.mb}
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
    )
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>{renderContent()}</Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default ManageAppLockScreen
