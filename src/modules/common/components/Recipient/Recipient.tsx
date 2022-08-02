import React from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, View } from 'react-native'

import DownArrowIcon from '@assets/svg/DownArrowIcon'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import Input, { InputProps } from '@modules/common/components/Input'
import spacings from '@modules/common/styles/spacings'
import AddressList from '@modules/send/components/AddressList'
import AddAddressForm from '@modules/send/components/AddressList/AddAddressForm'
import ConfirmAddress from '@modules/send/components/ConfirmAddress'

import BottomSheet from '../BottomSheet'
import useBottomSheet from '../BottomSheet/hooks/useBottomSheet'
import NavIconWrapper from '../NavIconWrapper'
import RecipientInput from '../RecipientInput'

interface Props extends InputProps {
  setAddress: (text: string) => void
  addAddress: (name: string, address: string, isUD: boolean) => void
  address: string
  uDAddress: string
  ensAddress: string
  addressValidationMsg: string
  setAddressConfirmed: React.Dispatch<React.SetStateAction<boolean>>
  addressConfirmed: boolean
}

const Recipient: React.FC<Props> = ({
  setAddress,
  addAddress,
  address,
  uDAddress,
  ensAddress,
  addressValidationMsg,
  setAddressConfirmed,
  addressConfirmed
}) => {
  const { t } = useTranslation()

  const {
    sheetRef: sheetRefAddrAdd,
    openBottomSheet: openBottomSheetAddrAdd,
    closeBottomSheet: closeBottomSheetAddrAdd,
    isOpen: isOpenAddrAdd
  } = useBottomSheet()
  const {
    sheetRef: sheetRefAddrDisplay,
    openBottomSheet: openBottomSheetAddrDisplay,
    closeBottomSheet: closeBottomSheetAddrDisplay,
    isOpen: isOpenAddrDisplay
  } = useBottomSheet()

  const handleAddNewAddress = (fieldValues: { name: string; address: string; isUD: boolean }) => {
    addAddress(fieldValues.name, fieldValues.address, fieldValues.isUD)
    closeBottomSheetAddrAdd()
    openBottomSheetAddrDisplay()
  }

  const setValidationLabel = () => {
    if (uDAddress) {
      return t('Valid Unstoppable domainsⓇ domain')
    }
    if (ensAddress) {
      return t('Valid Ethereum Name ServicesⓇ domain')
    }
    return ''
  }

  return (
    <>
      <RecipientInput
        containerStyle={spacings.mb}
        isValidUDomain={!!uDAddress}
        isValidEns={!!ensAddress}
        placeholder={t('Recipient')}
        info={t(
          'Please double-check the recipient address, blockchain transactions are not reversible.'
        )}
        isValid={address.length > 1 && !addressValidationMsg && (!!uDAddress || !!ensAddress)}
        validLabel={setValidationLabel()}
        error={addressValidationMsg}
        value={address}
        onChangeText={setAddress}
      />

      <ConfirmAddress
        address={address}
        uDAddress={uDAddress}
        ensAddress={ensAddress}
        addressConfirmed={addressConfirmed}
        setAddressConfirmed={setAddressConfirmed}
        onAddToAddressBook={openBottomSheetAddrAdd}
      />

      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss()
          openBottomSheetAddrDisplay()
        }}
      >
        <View pointerEvents="none">
          <Input
            value={t('Address Book')}
            containerStyle={spacings.mbSm}
            button={
              <NavIconWrapper onPress={() => null}>
                <DownArrowIcon width={34} height={34} />
              </NavIconWrapper>
            }
          />
        </View>
      </TouchableOpacity>

      <BottomSheet
        id="addresses-list"
        isOpen={isOpenAddrDisplay}
        sheetRef={sheetRefAddrDisplay}
        closeBottomSheet={closeBottomSheetAddrDisplay}
      >
        <AddressList
          onSelectAddress={(item): any => setAddress(item.address)}
          onCloseBottomSheet={closeBottomSheetAddrDisplay}
          onOpenBottomSheet={openBottomSheetAddrAdd}
        />
      </BottomSheet>
      <BottomSheet
        id="add-address"
        isOpen={isOpenAddrAdd}
        sheetRef={sheetRefAddrAdd}
        closeBottomSheet={closeBottomSheetAddrAdd}
        dynamicInitialHeight={false}
      >
        <AddAddressForm
          onSubmit={handleAddNewAddress}
          address={address}
          uDAddr={uDAddress}
          ensAddr={ensAddress}
        />
      </BottomSheet>
    </>
  )
}

export default React.memo(Recipient)
