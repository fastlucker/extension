import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, TextInput, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { Contact } from '@ambire-common/controllers/addressBook/addressBook'
import { ITransferController } from '@ambire-common/interfaces/transfer'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { findAccountDomainFromPartialDomain } from '@ambire-common/utils/domains'
import AccountsFilledIcon from '@common/assets/svg/AccountsFilledIcon'
import CloseIcon from '@common/assets/svg/CloseIcon'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import SettingsIcon from '@common/assets/svg/SettingsIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import WalletFilledIcon from '@common/assets/svg/WalletFilledIcon'
import AddressInput from '@common/components/AddressInput'
import { AddressValidation } from '@common/components/AddressInput/AddressInput'
import { InputProps } from '@common/components/Input'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'
import useDomainsControllerState from '@web/hooks/useDomainsController/useDomainsController'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

import AddressBookContact from '../AddressBookContact'
import Button from '../Button'
import { SectionedSelect } from '../Select'
import { RenderSelectedOptionParams, SectionedSelectProps, SelectValue } from '../Select/types'
import TitleAndIcon from '../TitleAndIcon'
import AddContactBottomSheet from './AddContactBottomSheet'
import ConfirmAddress from './ConfirmAddress'
import styles from './styles'

interface Props extends InputProps {
  setAddress: (text: string) => void
  address: string
  ensAddress: string
  addressValidationMsg: string
  isRecipientHumanizerKnownTokenOrSmartContract: boolean
  isRecipientAddressUnknown: boolean
  isRecipientAddressUnknownAgreed: ITransferController['isRecipientAddressUnknownAgreed']
  onRecipientCheckboxClick: () => void
  validation: AddressValidation
  isRecipientDomainResolving: boolean
  isSWWarningVisible: boolean
  isSWWarningAgreed: boolean
  recipientMenuClosedAutomaticallyRef: React.MutableRefObject<boolean>
  selectedTokenSymbol?: TokenResult['symbol']
  menuPosition?: 'top' | 'bottom'
}

const ADDRESS_BOOK_VISIBLE_VALIDATION = {
  isError: true, // Don't let the user submit, just in case there is an error
  message: ''
}

const SelectedMenuOption: React.FC<{
  selectRef: React.RefObject<any>
  validation: AddressValidation
  isMenuOpen: boolean
  ensAddress: string
  isRecipientDomainResolving: boolean
  address: string
  setAddress: (text: string) => void
  disabled?: boolean
  toggleMenu: () => void
  setIsMenuOpen: (isMenuOpen: boolean) => void
  openAddToAddressBook: () => void
  filteredContacts: Contact[]
  recipientMenuClosedAutomaticallyRef: React.MutableRefObject<boolean>
}> = ({
  selectRef,
  filteredContacts,
  validation,
  isMenuOpen,
  ensAddress,
  isRecipientDomainResolving,
  address,
  setAddress,
  disabled,
  setIsMenuOpen,
  openAddToAddressBook,
  toggleMenu,
  recipientMenuClosedAutomaticallyRef
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const inputRef = useRef<TextInput | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  const setInputRef = useCallback((ref: TextInput | null) => {
    if (ref) inputRef.current = ref
  }, [])

  const sessionValidation = useMemo(
    () => (isMenuOpen ? ADDRESS_BOOK_VISIBLE_VALIDATION : validation),
    [isMenuOpen, validation]
  )

  useEffect(() => {
    if (isMenuOpen && !filteredContacts.length) {
      toggleMenu()
      // eslint-disable-next-line no-param-reassign
      recipientMenuClosedAutomaticallyRef.current = true
    } else if (
      recipientMenuClosedAutomaticallyRef.current &&
      !isMenuOpen &&
      filteredContacts.length &&
      // Reopen the menu only if the address is invalid
      // Otherwise we will reopen it while the user is done with this field
      // and wants to proceed
      sessionValidation.isError
    ) {
      toggleMenu()
      // eslint-disable-next-line no-param-reassign
      recipientMenuClosedAutomaticallyRef.current = false
    }
  }, [
    address,
    filteredContacts.length,
    isMenuOpen,
    recipientMenuClosedAutomaticallyRef,
    toggleMenu,
    sessionValidation.isError
  ])

  const { message, isError } = validation
  const isValidationInDomainResolvingState = message === 'Resolving domain...'
  const isValid = useMemo(
    () => !isError && !isValidationInDomainResolvingState,
    [isError, isValidationInDomainResolvingState]
  )

  return (
    <AddressInput
      inputBorderWrapperRef={selectRef}
      setInputRef={setInputRef}
      validation={isMenuOpen ? ADDRESS_BOOK_VISIBLE_VALIDATION : validation}
      containerStyle={styles.inputContainer}
      ensAddress={ensAddress}
      isRecipientDomainResolving={isRecipientDomainResolving}
      label="Add recipient"
      value={address}
      onChangeText={setAddress}
      disabled={disabled}
      onFocus={() => {
        setIsMenuOpen(true)
        setIsFocused(true)
      }}
      onBlur={() => {
        setIsFocused(false)
      }}
      childrenBeforeButtons={
        isValid ? (
          <View style={[flexbox.alignCenter, flexbox.directionRow]}>
            <Button
              size="tiny"
              hasBottomSpacing={false}
              text={t('Clear')}
              type="gray"
              style={{ ...spacings.phTy, height: 28 }}
              accentColor={theme.secondaryText}
              onPress={() => {
                !!setAddress && setAddress('')
                setIsMenuOpen(true)
                inputRef?.current?.focus()
              }}
            >
              <CloseIcon width={12} height={12} strokeWidth="1.75" style={spacings.mlMi} />
            </Button>
          </View>
        ) : null
      }
      button={isMenuOpen ? <UpArrowIcon /> : <DownArrowIcon />}
      buttonProps={{ onPress: toggleMenu }}
      buttonStyle={{ ...spacings.pv0, ...spacings.ph, ...spacings.mr0, ...spacings.ml0 }}
      customInputContent={
        isValid && !isFocused ? (
          <Pressable
            style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}
            onPress={() => setIsMenuOpen(true)}
          >
            <AddressBookContact
              avatarSize={36}
              key={address}
              style={{
                borderRadius: 0,
                ...spacings.ph0,
                ...spacings.pv0
              }}
              address={ensAddress || address}
              name={filteredContacts.find((c) => c.address === ensAddress || address)?.name}
              onAddToAddressBookPress={openAddToAddressBook}
            />
          </Pressable>
        ) : null
      }
    />
  )
}

const Recipient: React.FC<Props> = ({
  setAddress,
  address,
  ensAddress,
  addressValidationMsg,
  isRecipientAddressUnknownAgreed,
  onRecipientCheckboxClick,
  isRecipientHumanizerKnownTokenOrSmartContract,
  isRecipientAddressUnknown,
  validation,
  isRecipientDomainResolving,
  disabled,
  isSWWarningVisible,
  recipientMenuClosedAutomaticallyRef
}) => {
  const { account } = useSelectedAccountControllerState()
  const actualAddress = ensAddress || address
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { contacts } = useAddressBookControllerState()
  const { domains } = useDomainsControllerState()
  const [bindManageBtnAnim, manageBtnAnimStyle] = useHover({
    preset: 'opacityInverted'
  })

  const onManagePress = useCallback(() => {
    navigate(ROUTES.addressBook)
  }, [navigate])

  const filteredContacts = useMemo(
    () =>
      contacts.filter((contact) => {
        if (!actualAddress) return true

        const lowercaseActualAddress = actualAddress.toLowerCase()
        const lowercaseName = contact.name.toLowerCase()
        const lowercaseAddress = contact.address.toLowerCase()
        const doesDomainMatch = findAccountDomainFromPartialDomain(
          contact.address,
          actualAddress,
          domains
        )

        return (
          lowercaseAddress.includes(lowercaseActualAddress) ||
          lowercaseName.includes(lowercaseActualAddress) ||
          doesDomainMatch
        )
      }),
    [contacts, actualAddress, domains]
  )

  const setAddressWrapped = useCallback(
    ({ value: newAddress }: Pick<SelectValue, 'value'>) => {
      if (typeof newAddress !== 'string') return

      const correspondingDomain = domains[newAddress]?.ens

      setAddress(correspondingDomain || newAddress)
    },
    [domains, setAddress]
  )

  const walletAccountsSourcedContactOptions = useMemo(
    () =>
      filteredContacts
        .filter((contact) => contact.isWalletAccount)
        .map((contact, index) => ({
          value: contact.address,
          label: (
            <AddressBookContact
              avatarSize={32}
              testID={`address-book-my-wallet-contact-${index + 1}`}
              key={contact.address}
              style={{
                borderRadius: 0,
                ...spacings.ph0,
                ...spacings.pv0
              }}
              address={contact.address}
              name={contact.name}
            />
          )
        })),
    [filteredContacts]
  )

  const manuallyAddedContactOptions = useMemo(
    () =>
      filteredContacts
        .filter((contact) => !contact.isWalletAccount)
        .map((contact) => ({
          value: contact.address,
          label: (
            <AddressBookContact
              avatarSize={32}
              key={contact.address}
              style={{
                borderRadius: 0,
                ...spacings.ph0,
                ...spacings.pv0
              }}
              address={contact.address}
              name={contact.name}
            />
          )
        })),
    [filteredContacts]
  )

  const selectedOption = useMemo(
    () =>
      walletAccountsSourcedContactOptions.find((contact) => contact.value === address) ||
      manuallyAddedContactOptions.find((contact) => contact.value === address),
    [walletAccountsSourcedContactOptions, manuallyAddedContactOptions, address]
  )

  const sections = useMemo(() => {
    if (!walletAccountsSourcedContactOptions.length && !manuallyAddedContactOptions.length)
      return []

    return [
      {
        data: walletAccountsSourcedContactOptions,
        key: 'my-wallets'
      },
      {
        data: manuallyAddedContactOptions,
        key: 'contacts'
      }
    ]
  }, [walletAccountsSourcedContactOptions, manuallyAddedContactOptions])

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionedSelectProps['sections'][0] }) => {
      if (section.data.length === 0) return null

      return section.key === 'contacts' ? (
        <TitleAndIcon title={t('Address Book')} icon={AccountsFilledIcon}>
          <AnimatedPressable
            style={[flexbox.directionRow, flexbox.alignCenter, manageBtnAnimStyle]}
            onPress={onManagePress}
            {...bindManageBtnAnim}
          >
            <SettingsIcon width={18} height={18} color={theme.secondaryText} />
            <Text fontSize={14} style={spacings.mlMi} appearance="secondaryText">
              {t('Manage contacts')}
            </Text>
          </AnimatedPressable>
        </TitleAndIcon>
      ) : (
        <TitleAndIcon title={t('My wallets')} icon={WalletFilledIcon} />
      )
    },
    [bindManageBtnAnim, manageBtnAnimStyle, onManagePress, t, theme.secondaryText]
  )

  const renderSelectedOption = useCallback(
    ({ toggleMenu, setIsMenuOpen, isMenuOpen, selectRef }: RenderSelectedOptionParams) => {
      return (
        <SelectedMenuOption
          toggleMenu={toggleMenu}
          setIsMenuOpen={setIsMenuOpen}
          openAddToAddressBook={openBottomSheet}
          selectRef={selectRef}
          filteredContacts={filteredContacts}
          isMenuOpen={isMenuOpen}
          validation={validation}
          ensAddress={ensAddress}
          isRecipientDomainResolving={isRecipientDomainResolving}
          address={address}
          setAddress={setAddress}
          disabled={disabled}
          recipientMenuClosedAutomaticallyRef={recipientMenuClosedAutomaticallyRef}
        />
      )
    },
    [
      filteredContacts,
      validation,
      ensAddress,
      isRecipientDomainResolving,
      address,
      setAddress,
      disabled,
      recipientMenuClosedAutomaticallyRef
    ]
  )

  return (
    <>
      <SectionedSelect
        value={selectedOption}
        setValue={setAddressWrapped}
        sections={sections}
        headerHeight={32}
        menuOptionHeight={54}
        withSearch={false}
        renderSectionHeader={renderSectionHeader}
        renderSelectedOption={renderSelectedOption}
        emptyListPlaceholderText={t('No contacts found')}
        menuPosition="bottom"
      />
      <View style={styles.inputBottom}>
        <ConfirmAddress
          onRecipientCheckboxClick={onRecipientCheckboxClick}
          isRecipientHumanizerKnownTokenOrSmartContract={
            isRecipientHumanizerKnownTokenOrSmartContract
          }
          isRecipientAddressUnknown={isRecipientAddressUnknown}
          isRecipientAddressUnknownAgreed={isRecipientAddressUnknownAgreed}
          isRecipientAddressSameAsSender={actualAddress === account?.addr}
          addressValidationMsg={addressValidationMsg}
          isSWWarningVisible={isSWWarningVisible}
        />
      </View>
      <AddContactBottomSheet
        sheetRef={sheetRef}
        address={ensAddress || address}
        closeBottomSheet={closeBottomSheet}
      />
    </>
  )
}

export default React.memo(Recipient)
