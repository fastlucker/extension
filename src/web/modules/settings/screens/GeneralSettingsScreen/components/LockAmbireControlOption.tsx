import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import LockIcon from '@common/assets/svg/LockIcon'
import Button from '@common/components/Button'
import ControlOption from '@common/components/ControlOption'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'

const LockAmbireControlOption = () => {
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const { theme } = useTheme()

  const handleLockAmbire = useCallback(() => {
    dispatch({
      type: 'KEYSTORE_CONTROLLER_LOCK'
    })

    dispatch({
      type: 'EMAIL_VAULT_CONTROLLER_CLEAN_MAGIC_AND_SESSION_KEYS'
    })
  }, [dispatch])

  return (
    <ControlOption
      style={spacings.mbTy}
      title={t('Lock Ambire')}
      description={t(
        'Lock the Ambire Wallet extension, requiring your password the next time you use it.'
      )}
      renderIcon={<LockIcon color={theme.primaryText} />}
    >
      <Button
        testID="lock-extension-button"
        size="small"
        hasBottomSpacing={false}
        style={{
          width: 80
        }}
        text={t('Lock')}
        onPress={handleLockAmbire}
      />
    </ControlOption>
  )
}

export default React.memo(LockAmbireControlOption)
