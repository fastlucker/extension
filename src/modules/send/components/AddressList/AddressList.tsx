import React, { useMemo } from 'react'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import { FlatList, Keyboard, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import colors from '@modules/common/styles/colors'

import AddAddressForm from './AddAddressForm'

type Props = {
  onSelectAddress?: (item: { name: string; address: string }) => void
}

const AddressList = ({ onSelectAddress }: Props) => {
  const { t } = useTranslation()
  const { sheetRef, openBottomSheet, closeBottomSheet } = useBottomSheet()
  const { addresses, addAddress, removeAddress } = useAddressBook()

  const items = useMemo(
    () => addresses.filter(({ isAccount }: { isAccount: boolean }) => !isAccount),
    [addresses]
  )

  const handleAddNewAddress = (fieldValues: SubmitHandler<FieldValues>) => {
    // @ts-ignore
    addAddress(fieldValues.name, fieldValues.address)
    closeBottomSheet()
  }

  const renderItem: any = ({ item }: any) => (
    <TouchableOpacity
      style={{
        padding: 8,
        backgroundColor: colors.inputBackgroundColor,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
      }}
      activeOpacity={0.8}
      onPress={() => {
        !!onSelectAddress && onSelectAddress(item)
      }}
    >
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1}>{item.name}</Text>
        <Text numberOfLines={1}>{item.address}</Text>
      </View>
      <TouchableOpacity onPress={() => removeAddress(item.name, item.address)}>
        <Text>❌</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const renderAddresses = () => (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.address + item.name}
    />
  )

  return (
    <>
      <Panel>
        <Title>{t('Address Book')}</Title>
        {!!items.length && renderAddresses()}
        {!items.length && <P>{t('Your address book is empty')}</P>}
        <Button onPress={openBottomSheet} text={t('➕ Add Address')} />
      </Panel>
      <BottomSheet
        sheetRef={sheetRef}
        maxInitialHeightPercentage={1}
        onCloseEnd={() => {
          Keyboard.dismiss()
        }}
      >
        <AddAddressForm onSubmit={handleAddNewAddress} />
      </BottomSheet>
    </>
  )
}

export default AddressList
