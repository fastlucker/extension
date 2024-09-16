import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import DefaultWalletIcon from '@common/assets/svg/DefaultWalletIcon'
import ControlOption from '@common/components/ControlOption'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useWalletStateController from '@web/hooks/useWalletStateController'

import DefaultWalletToggle from './DefaultWalletToggle/DefaultWalletToggle.web'

const DefaultWalletControlOption = () => {
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { isDefaultWallet } = useWalletStateController()

  const toggleIsDefaultWallet = useCallback(() => {
    dispatch({
      type: 'SET_IS_DEFAULT_WALLET',
      params: { isDefaultWallet: !isDefaultWallet }
    })
  }, [isDefaultWallet, dispatch])

  return (
    <ControlOption
      style={spacings.mbTy}
      title={t('Default wallet')}
      description={t(
        'Ambire Wallet is set as your default browser wallet for connecting with dApps.'
      )}
      renderIcon={<DefaultWalletIcon color={theme.primaryText} />}
    >
      <DefaultWalletToggle isOn={isDefaultWallet} onToggle={toggleIsDefaultWallet} />
    </ControlOption>
  )
}

export default React.memo(DefaultWalletControlOption)
