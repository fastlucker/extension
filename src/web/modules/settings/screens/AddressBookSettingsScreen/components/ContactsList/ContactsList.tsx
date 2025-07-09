import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AccountsFilledIcon from '@common/assets/svg/AccountsFilledIcon'
import WalletFilledIcon from '@common/assets/svg/WalletFilledIcon'
import AddressBookContact from '@common/components/AddressBookContact'
import Button from '@common/components/Button'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import TitleAndIcon from '@common/components/TitleAndIcon'
import useDebounce from '@common/hooks/useDebounce'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'

import Section from '../Section'

const ContactsList = () => {
  const { t } = useTranslation()
  const { contacts } = useAddressBookControllerState()
  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: ''
    }
  })

  const search = watch('search')
  const debouncedSearch = useDebounce({ value: search, delay: 350 })
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      contact.address.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const walletAccountsSourcedContacts = filteredContacts.filter(
    (contact) => contact.isWalletAccount
  )
  const manuallyAddedContacts = filteredContacts.filter((contact) => !contact.isWalletAccount)

  const headerChildren = (
    <View style={[flexbox.flex1, flexbox.directionRow, flexbox.justifyEnd]}>
      <Button
        testID="add-contact-button"
        text={t('Add contact')}
        type="primary"
        style={[spacings.mrTy, { width: 180, height: 48 }]}
        hasBottomSpacing={false}
        onPress={() => {
          console.log('Add contact pressed')
        }}
        // style={[flexbox.alignSelfCenter, flexbox.center, spacings.mtXs, spacings.mbXs]}
      />
      <Search
        testID="search-contacts-input"
        placeholder={t('Search contacts')}
        control={control}
        setValue={setValue}
        height={48}
        // TODO: it should be responsive
        containerStyle={{ width: '50%', height: 48 }}
      />
    </View>
  )

  return (
    <Section title="Address Book" headerChildren={headerChildren}>
      <ScrollableWrapper style={flexbox.flex1}>
        {walletAccountsSourcedContacts.length > 0 ? (
          <>
            <TitleAndIcon title={t('My wallets')} icon={WalletFilledIcon} />
            {walletAccountsSourcedContacts.map((contact) => (
              <AddressBookContact
                testID={`name-${contact.name.toLowerCase().replace(/\s+/g, '-')}`}
                key={`${contact.address}-${!contact.isWalletAccount ? 'wallet' : 'address'}`}
                name={contact.name}
                address={contact.address}
                isManageable={!contact.isWalletAccount}
                isEditable
              />
            ))}
          </>
        ) : null}
        {manuallyAddedContacts.length > 0 ? (
          <>
            <TitleAndIcon title={t('Contacts')} icon={AccountsFilledIcon} />
            {manuallyAddedContacts.map((contact) => (
              <AddressBookContact
                testID={`contact-name-text`}
                key={`${contact.address}-${!contact.isWalletAccount ? 'wallet' : 'address'}`}
                name={contact.name}
                address={contact.address}
                isManageable={!contact.isWalletAccount}
                isEditable
              />
            ))}
          </>
        ) : null}
        {!contacts.length ? (
          <>
            <Text fontSize={14}>{t('Your Address Book is empty.')}</Text>
            <Text fontSize={14} style={spacings.mbXl}>
              {t('Why not add addresses you often interact with to your Address Book?')}
            </Text>
          </>
        ) : null}
      </ScrollableWrapper>
    </Section>
  )
}

export default ContactsList
