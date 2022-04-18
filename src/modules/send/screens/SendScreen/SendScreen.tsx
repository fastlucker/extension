import React from 'react'
import { FieldValues, SubmitHandler } from 'react-hook-form'
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'

import DownArrowIcon from '@assets/svg/DownArrowIcon'
import { isiOS } from '@config/env'
import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import Checkbox from '@modules/common/components/Checkbox'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Input from '@modules/common/components/Input'
import InputOrScan from '@modules/common/components/InputOrScan/InputOrScan'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import NumberInput from '@modules/common/components/NumberInput'
import Panel from '@modules/common/components/Panel'
import Select from '@modules/common/components/Select'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import AddressList from '@modules/send/components/AddressList'
import AddAddressForm from '@modules/send/components/AddressList/AddAddressForm'
import ConfirmAddress from '@modules/send/components/ConfirmAddress'
import useRequestTransaction from '@modules/send/hooks/useRequestTransaction'

import styles from './styles'

const unsupportedSWPlatforms = ['Binance', 'Huobi', 'KuCoin', 'Gate.io', 'FTX']

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
    smartContractWarning,
    showSWAddressWarning,
    sWAddressConfirmed,
    setSWAddressConfirmed
  } = useRequestTransaction()

  const handleAddNewAddress = (fieldValues: SubmitHandler<FieldValues>) => {
    // @ts-ignore
    addAddress(fieldValues.name, fieldValues.address)
    closeBottomSheetAddrAdd()
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper
        keyboardDismissMode="on-drag"
        type={isiOS ? WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW : WRAPPER_TYPES.SCROLL_VIEW}
        extraHeight={250}
        hasBottomTabNav
      >
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
            {assetsItems.length ? (
              <>
                <Panel style={spacings.mb0}>
                  <Title style={textStyles.center}>{t('Send')}</Title>
                  <View style={spacings.mbMi}>
                    <Select value={asset} items={assetsItems} setValue={setAsset} />
                  </View>
                  <View style={styles.amountContainer}>
                    <Text>{t('Available Amount:')}</Text>
                    <Text style={styles.amountValue}>
                      {maxAmount} {selectedAsset?.symbol}
                    </Text>
                  </View>
                  <NumberInput
                    onChangeText={onAmountChange}
                    containerStyle={spacings.mbTy}
                    value={amount.toString()}
                    buttonText={t('MAX')}
                    placeholder={t('0')}
                    onButtonPress={setMaxAmount}
                    error={
                      validationFormMgs.messages?.amount
                        ? validationFormMgs.messages.amount
                        : undefined
                    }
                  />
                  <InputOrScan
                    containerStyle={spacings.mb}
                    placeholder={t('Recipient')}
                    info={t(
                      'Please double-check the recipient address, blockchain transactions are not reversible.'
                    )}
                    value={address}
                    onChangeText={setAddress}
                  />
                  {!!validationFormMgs.messages?.address && (
                    <Text appearance="danger" style={spacings.mbSm}>
                      {validationFormMgs.messages.address}
                    </Text>
                  )}
                  {!smartContractWarning && !!unknownWarning && (
                    <ConfirmAddress
                      addressConfirmed={addressConfirmed}
                      setAddressConfirmed={setAddressConfirmed}
                      onAddToAddressBook={openBottomSheetAddrAdd}
                    />
                  )}
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
                        buttonText={
                          <NavIconWrapper onPress={() => null}>
                            <DownArrowIcon width={34} height={34} />
                          </NavIconWrapper>
                        }
                      />
                    </View>
                  </TouchableOpacity>
                  {showSWAddressWarning && (
                    <Checkbox
                      value={sWAddressConfirmed}
                      onValueChange={() => setSWAddressConfirmed(!sWAddressConfirmed)}
                    >
                      <Text
                        fontSize={12}
                        onPress={() => setSWAddressConfirmed(!sWAddressConfirmed)}
                      >
                        {
                          t(
                            'I confirm this address is not a {{platforms}} address: These platforms do not support {{token}} deposits from smart wallets.',
                            {
                              platforms: unsupportedSWPlatforms.join(' / '),
                              token: selectedAsset?.symbol
                            }
                          ) as string
                        }
                      </Text>
                    </Checkbox>
                  )}
                </Panel>
                <View style={[spacings.phSm, spacings.mbMd]}>
                  <Button
                    text={t('Send')}
                    disabled={disabled || (showSWAddressWarning && !sWAddressConfirmed)}
                    onPress={() => {
                      Keyboard.dismiss()
                      sendTransaction()
                    }}
                  />
                </View>
              </>
            ) : (
              <Panel style={{ flexGrow: 1 }}>
                <Text fontSize={16} style={textStyles.center}>
                  {t("You don't have any funds on this account.")}
                </Text>
              </Panel>
            )}
          </TouchableWithoutFeedback>
        )}
        <BottomSheet
          id="addresses-list"
          sheetRef={sheetRefAddrDisplay}
          isOpen={isOpenBottomSheetAddrDisplay}
          closeBottomSheet={closeBottomSheetAddrDisplay}
          dynamicInitialHeight={false}
        >
          <AddressList
            onSelectAddress={(item): any => setAddress(item.address)}
            onCloseBottomSheet={closeBottomSheetAddrDisplay}
            onOpenBottomSheet={openBottomSheetAddrAdd}
          />
        </BottomSheet>
        <BottomSheet
          id="add-address"
          sheetRef={sheetRefAddrAdd}
          isOpen={isOpenBottomSheetAddrAdd}
          closeBottomSheet={closeBottomSheetAddrAdd}
          dynamicInitialHeight={false}
        >
          <AddAddressForm
            onSubmit={handleAddNewAddress}
            address={!smartContractWarning && !!unknownWarning && !!address ? address : ''}
          />
        </BottomSheet>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default SendScreen
