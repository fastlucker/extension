import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AddressBookContact from '@common/components/AddressBookContact'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'

import Section from '../Section'

const ContactsList = () => {
  const { t } = useTranslation()
  const { contacts } = useAddressBookControllerState()

  return (
    <Section title="Address Book">
      <ScrollableWrapper style={flexbox.flex1}>
        <View style={spacings.mbLg}>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <AddressBookContact
                testID={`name-${contact.name.toLowerCase().replace(/\s+/g, '-')}`}
                key={`${contact.address}-${!contact.isWalletAccount ? 'wallet' : 'address'}`}
                name={contact.name}
                address={contact.address}
                isManageable={!contact.isWalletAccount}
                isEditable
              />
            ))
          ) : (
            <>
              <Text fontSize={14}>{t('Your Address Book is empty.')}</Text>
              <Text fontSize={14} style={spacings.mbXl}>
                {t('Why not add addresses you often interact with to your address book?')}
              </Text>
            </>
          )}
        </View>
      </ScrollableWrapper>
    </Section>
  )
}

export default ContactsList
