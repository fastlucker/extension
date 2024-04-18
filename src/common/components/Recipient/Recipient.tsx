import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { TransferControllerState } from '@ambire-common/interfaces/transfer'
import { TokenResult } from '@ambire-common/libs/portfolio'
import AccountsFilledIcon from '@common/assets/svg/AccountsFilledIcon'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import AddressInput from '@common/components/AddressInput'
import { AddressValidation } from '@common/components/AddressInput/AddressInput'
import { InputProps } from '@common/components/Input'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'

import AddContactBottomSheet from './AddContactBottomSheet'
import AddressBookDropdown from './AddressBookDropdown'
import ConfirmAddress from './ConfirmAddress'
import styles from './styles'

interface Props extends InputProps {
  setAddress: (text: string) => void
  address: string
  uDAddress: string
  ensAddress: string
  addressValidationMsg: string
  isRecipientHumanizerKnownTokenOrSmartContract: TransferControllerState['isRecipientHumanizerKnownTokenOrSmartContract']
  isRecipientAddressUnknown: TransferControllerState['isRecipientAddressUnknown']
  isRecipientAddressUnknownAgreed: TransferControllerState['isRecipientAddressUnknownAgreed']
  onRecipientAddressUnknownCheckboxClick: () => void
  validation: AddressValidation
  isRecipientDomainResolving: boolean
  isSWWarningVisible: boolean
  isSWWarningAgreed: boolean
  selectedTokenSymbol?: TokenResult['symbol']
}

const Recipient: React.FC<Props> = ({
  setAddress,
  address,
  uDAddress,
  ensAddress,
  addressValidationMsg,
  isRecipientAddressUnknownAgreed,
  onRecipientAddressUnknownCheckboxClick,
  isRecipientHumanizerKnownTokenOrSmartContract,
  isRecipientAddressUnknown,
  validation,
  isRecipientDomainResolving,
  disabled,
  isSWWarningVisible,
  isSWWarningAgreed,
  selectedTokenSymbol
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { contacts } = useAddressBookControllerState()
  const [isAddressBookVisible, setIsAddressBookVisible] = useState(false)
  const addressBookRef = useRef(null)
  const isAddressInAddressBook = contacts.some((contact) => {
    const actualAddress = ensAddress || uDAddress || address

    return actualAddress.toLowerCase() === contact.address.toLowerCase()
  })

  const onFocus = () => setIsAddressBookVisible(true)

  const setAddressAndCloseAddressBook = (newAddress: string) => {
    setIsAddressBookVisible(false)
    setAddress(newAddress)
  }

  // Close the address book on click outside
  useEffect(() => {
    if (!isWeb) return
    function handleClickOutside(event: MouseEvent) {
      // @ts-ignore
      if (addressBookRef.current && !addressBookRef.current?.contains(event.target)) {
        setIsAddressBookVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      if (!isWeb) return

      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [addressBookRef])

  return (
    <>
      <AddressInput
        testID='recepient-address-field'
        validation={validation}
        containerStyle={styles.inputContainer}
        udAddress={uDAddress}
        ensAddress={ensAddress}
        isRecipientDomainResolving={isRecipientDomainResolving}
        label="Add Recipient"
        value={address}
        onChangeText={setAddressAndCloseAddressBook}
        disabled={disabled}
        onFocus={onFocus}
        childrenBelowInput={
          <AddressBookDropdown
            isVisible={isAddressBookVisible}
            passRef={addressBookRef}
            onContactPress={setAddressAndCloseAddressBook}
          />
        }
        childrenBeforeButtons={
          <AccountsFilledIcon
            color={theme[isAddressInAddressBook ? 'primary' : 'secondaryText']}
            opacity={isAddressInAddressBook ? 1 : 0.25}
            style={spacings.mrTy}
            width={24}
            height={24}
          />
        }
        button={isAddressBookVisible ? <UpArrowIcon /> : <DownArrowIcon />}
        buttonProps={{
          onPress: () => {
            if (!isAddressBookVisible) {
              setIsAddressBookVisible(true)
            }
            // If the address book is visible and the user clicks on the button
            // the address book will be closed by the click outside event listener
          }
        }}
      />
      <View style={styles.inputBottom}>
        <Text
          style={styles.doubleCheckMessage}
          weight="regular"
          fontSize={12}
          appearance="secondaryText"
        >
          {t(
            'Please double-check the recipient address, blockchain transactions are not reversible.'
          )}
        </Text>

        <ConfirmAddress
          onRecipientAddressUnknownCheckboxClick={onRecipientAddressUnknownCheckboxClick}
          isRecipientHumanizerKnownTokenOrSmartContract={
            isRecipientHumanizerKnownTokenOrSmartContract
          }
          isRecipientAddressUnknown={isRecipientAddressUnknown}
          isRecipientAddressUnknownAgreed={isRecipientAddressUnknownAgreed}
          addressValidationMsg={addressValidationMsg}
          onAddToAddressBook={openBottomSheet}
          isSWWarningVisible={isSWWarningVisible}
          isSWWarningAgreed={isSWWarningAgreed}
          selectedTokenSymbol={selectedTokenSymbol}
        />
      </View>
      <AddContactBottomSheet
        sheetRef={sheetRef}
        address={ensAddress || uDAddress || address}
        closeBottomSheet={closeBottomSheet}
      />
    </>
  )
}

export default React.memo(Recipient)
