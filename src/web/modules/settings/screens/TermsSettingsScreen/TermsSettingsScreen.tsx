import React, { useContext, useEffect } from 'react'

import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'
import TermsComponent from '@web/modules/terms/components'

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
