import React, { useContext, useEffect } from 'react'

import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'
import TermsComponent from '@web/modules/terms/components'

import SettingsPageHeader from '../../components/SettingsPageHeader'

const TermsSettingsScreen = () => {
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)

  useEffect(() => {
    setCurrentSettingsPage('terms-of-service')
  }, [setCurrentSettingsPage])

  return (
    <>
      <SettingsPageHeader title="Terms of Service" />
      <TermsComponent />
    </>
  )
}

export default React.memo(TermsSettingsScreen)
