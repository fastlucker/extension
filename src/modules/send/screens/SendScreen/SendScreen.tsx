import React from 'react'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button, { BUTTON_TYPES } from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import NumberInput from '@modules/common/components/NumberInput'
import P from '@modules/common/components/P'
import Panel from '@modules/common/components/Panel'
import Select from '@modules/common/components/Select'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import AddressList from '@modules/send/components/AddressList'
import AddAddressForm from '@modules/send/components/AddressList/AddAddressForm'
import ConfirmAddress from '@modules/send/components/ConfirmAddress'
import useRequestTransaction from '@modules/send/hooks/useRequestTransaction'

import styles from './styles'

const SendScreen = () => {
  const { t } = useTranslation()
  const {
    sheetRef: sheetRefAddrAdd,
    openBottomSheet: openBottomSheetAddrAdd,
    closeBottomSheet: closeBottomSheetAddrAdd,
    isOpen: isOpenBottomSheetAddrAdd
  } = useBottomSheet()
  const {
    sheetRef: sheetRefAddrDisplay,
    openBottomSheet: openBottomSheetAddrDisplay,
    closeBottomSheet: closeBottomSheetAddrDisplay,
    isOpen: isOpenBottomSheetAddrDisplay
  } = useBottomSheet()
  const { addAddress } = useAddressBook()
  const {
    asset,
    amount,
    address,
    assetsItems,
    setAsset,
    selectedAsset,
    onAmountChange,
    maxAmount,
    setMaxAmount,
    setAddress,
    sendTransaction,
    isBalanceLoading,
    disabled,
    addressConfirmed,
    setAddressConfirmed,
    validationFormMgs,
    unknownWarning,
    smartContractWarning
  } = useRequestTransaction()

  const handleAddNewAddress = (fieldValues: SubmitHandler<FieldValues>) => {
    // @ts-ignore
    addAddress(fieldValues.name, fieldValues.address)
    closeBottomSheetAddrAdd()
  }

  return (
    <Wrapper>
      {isBalanceLoading && (
        <View style={StyleSheet.absoluteFill}>
          <ActivityIndicator style={StyleSheet.absoluteFill} size="large" />
        </View>
      )}
      {!isBalanceLoading && (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss()
          }}
        >
          <>
            {assetsItems.length ? (
              <Panel>
                <Title>{t('Send')}</Title>
                <Select value={asset} items={assetsItems} setValue={setAsset} />
                <View style={styles.amountContainer}>
                  <Text>{t('Available Amount:')}</Text>
                  <Text style={styles.amountValue}>
                    {maxAmount} {selectedAsset?.symbol}
                  </Text>
                </View>
                <NumberInput
                  onChangeText={onAmountChange}
                  value={amount.toString()}
                  buttonText={t('MAX')}
                  placeholder={t('0')}
                  onButtonPress={setMaxAmount}
                />
                {!!validationFormMgs.messages?.amount && (
                  <P type={TEXT_TYPES.DANGER}>{validationFormMgs.messages.amount}</P>
                )}
                <Input
                  placeholder={t('Recipient')}
                  info={t(
                    'Please double-check the recipient address, blockchain transactions are not reversible.'
                  )}
                  value={address}
                  onChangeText={setAddress}
                />
                {!!validationFormMgs.messages?.address && (
                  <P type={TEXT_TYPES.DANGER}>{validationFormMgs.messages.address}</P>
                )}
                {!smartContractWarning && !!unknownWarning && (
                  <ConfirmAddress
                    addressConfirmed={addressConfirmed}
                    setAddressConfirmed={setAddressConfirmed}
                    onAddToAddressBook={openBottomSheetAddrAdd}
                  />
                )}
                <Button
                  type={BUTTON_TYPES.SECONDARY}
                  onPress={openBottomSheetAddrDisplay}
                  text={t('Address Book')}
                />
                <Button
                  text={t('Send')}
                  disabled={disabled}
                  onPress={() => {
                    Keyboard.dismiss()
                    sendTransaction()
                  }}
                />
              </Panel>
            ) : (
              <P>{t("You don't have any funds on this account.")}</P>
            )}
            <Panel>
              <AddressList
                onSelectAddress={(item): any => setAddress(item.address)}
                onOpenBottomSheet={openBottomSheetAddrAdd}
              />
            </Panel>
          </>
        </TouchableWithoutFeedback>
      )}
      <BottomSheet
        sheetRef={sheetRefAddrDisplay}
        isOpen={isOpenBottomSheetAddrDisplay}
        closeBottomSheet={closeBottomSheetAddrDisplay}
        dynamicInitialHeight={false}
      >
        <AddressList
          onSelectAddress={(item): any => {
            closeBottomSheetAddrDisplay()
            setAddress(item.address)
          }}
          onOpenBottomSheet={openBottomSheetAddrAdd}
        />
      </BottomSheet>
      <BottomSheet
        sheetRef={sheetRefAddrAdd}
        isOpen={isOpenBottomSheetAddrAdd}
        closeBottomSheet={closeBottomSheetAddrAdd}
        maxInitialHeightPercentage={1}
      >
        <AddAddressForm
          onSubmit={handleAddNewAddress}
          address={!smartContractWarning && !!unknownWarning && !!address ? address : ''}
        />
      </BottomSheet>
    </Wrapper>
  )
}

export default SendScreen
