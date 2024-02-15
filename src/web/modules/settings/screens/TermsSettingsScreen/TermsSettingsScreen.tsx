import React from 'react'

import SettingsPage from '@web/modules/settings/components/SettingsPage'
import TermsComponent from '@web/modules/terms/components'

import SettingsPageHeader from '../../components/SettingsPageHeader'

const TermsSettingsScreen = () => {
  return (
    <SettingsPage currentPage="terms-of-service">
      <SettingsPageHeader title="Terms of Service" />
      <TermsComponent />
    </SettingsPage>
  )
}

export default TermsSettingsScreen
