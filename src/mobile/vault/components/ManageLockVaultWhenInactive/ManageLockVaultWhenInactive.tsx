import React from 'react'

import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useVault from '@mobile/vault/hooks/useVault'

import styles from './styles'

const ManageLockVaultWhenInactive = () => {
  const { t } = useTranslation()
  const { shouldLockWhenInactive, toggleShouldLockWhenInactive } = useVault()

  return (
    <Panel type="filled" contentContainerStyle={styles.appLockingItemContainer} style={spacings.mb}>
      <Text fontSize={16} weight="regular" numberOfLines={1} style={flexboxStyles.flex1}>
        {t('Lock when inactive')}
      </Text>
      <Toggle
        isOn={shouldLockWhenInactive}
        label={shouldLockWhenInactive ? t('Enabled') : t('Disabled')}
        onToggle={toggleShouldLockWhenInactive}
      />
    </Panel>
  )
}

export default ManageLockVaultWhenInactive
