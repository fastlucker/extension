import React from 'react'
import { useTranslation } from 'react-i18next'

import LogIcon from '@common/assets/svg/LogIcon'
import ControlOption from '@common/components/ControlOption'
import Toggle from '@common/components/Toggle'
import { useLogLevel } from '@common/hooks/useLogLevel'
import spacings from '@common/styles/spacings'

const LogLevelControlOption = () => {
  const { t } = useTranslation()
  const { isLogLevelEnabled, toggleLogLevel } = useLogLevel()

  return (
    <ControlOption
      style={spacings.mbTy}
      title={t('Development logs')}
      description={t('Includes essential technical details that may help Ambire Support.')}
      renderIcon={<LogIcon />}
    >
      <Toggle isOn={isLogLevelEnabled} onToggle={toggleLogLevel} />
    </ControlOption>
  )
}

export default React.memo(LogLevelControlOption)
