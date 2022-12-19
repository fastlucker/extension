import React from 'react'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Toggle from '@modules/common/components/Toggle'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import useVault from '@modules/vault/hooks/useVault'

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
