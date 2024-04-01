import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'

import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'

import AddContactForm from './components/AddContactForm'
import ContactsList from './components/ContactsList'

const AddressBookSettingsScreen = () => {
  const { theme } = useTheme()
  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)

  useEffect(() => {
    setCurrentSettingsPage('address-book')
  }, [setCurrentSettingsPage])

  return (
    <View style={[flexbox.flex1, flexbox.directionRow]}>
      <AddContactForm />
      <View
        style={{
          width: 1,
          height: '100%',
          backgroundColor: theme.secondaryBorder,
          ...spacings.mhXl
        }}
      />
      <ContactsList />
    </View>
  )
}

export default React.memo(AddressBookSettingsScreen)
