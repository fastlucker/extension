import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import LogIcon from '@common/assets/svg/LogIcon'
import ControlOption from '@common/components/ControlOption'
import Toggle from '@common/components/Toggle'
import spacings from '@common/styles/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useWalletStateController from '@web/hooks/useWalletStateController'
import { LOG_LEVEL_DEV, LOG_LEVEL_PROD } from '@web/utils/logger'

const LogLevelControlOption = () => {
  const { t } = useTranslation()
  const { logLevel } = useWalletStateController()
  const { dispatch } = useBackgroundService()

  const handleToggleLogLevel = useCallback(() => {
    const nextLogLevel = logLevel === LOG_LEVEL_DEV ? LOG_LEVEL_PROD : LOG_LEVEL_DEV

    dispatch({ type: 'SET_LOG_LEVEL', params: { logLevel: nextLogLevel } })
  }, [dispatch, logLevel])

  return (
    <ControlOption
      style={spacings.mbTy}
      title={t('Development logs')}
      description={t('Includes essential technical details that may help Ambire Support.')}
      renderIcon={<LogIcon />}
    >
      <Toggle isOn={logLevel === LOG_LEVEL_DEV} onToggle={handleToggleLogLevel} />
    </ControlOption>
  )
}

export default React.memo(LogLevelControlOption)
