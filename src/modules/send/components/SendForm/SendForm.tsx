import accountPresets from 'ambire-common/src/constants/accountPresets'
import React from 'react'
import isEqual from 'react-fast-compare'
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import DownArrowIcon from '@assets/svg/DownArrowIcon'
import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import Checkbox from '@modules/common/components/Checkbox'
import Input from '@modules/common/components/Input'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import NumberInput from '@modules/common/components/NumberInput'
import Panel from '@modules/common/components/Panel'
import RecipientInput from '@modules/common/components/RecipientInput'
import Select from '@modules/common/components/Select'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import spacings from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import AddressList from '@modules/send/components/AddressList'
import AddAddressForm from '@modules/send/components/AddressList/AddAddressForm'
import ConfirmAddress from '@modules/send/components/ConfirmAddress'

interface Props {
  isHidden: boolean
  asset: string | null
  address: any
  amount: number
  assetsItems: {
    label: any
    value: any
    icon: () => JSX.Element
  }[]
  maxAmount: string | number
  selectedAsset: any
  disabled: boolean
  addressConfirmed: boolean
  uDAddress: string
  sWAddressConfirmed: boolean
  showSWAddressWarning: boolean
  validationFormMgs: {
    success: {
      amount: boolean
      address: boolean
    }
    messages: {
      amount: string
      address: string
    }
  }
  smartContractWarning: boolean
  unknownWarning: boolean
  onSendPress: () => void
  setAsset: React.Dispatch<React.SetStateAction<string | null>>
  onAmountChange: (value: any) => void
  setMaxAmount: () => void
  setAddress: React.Dispatch<React.SetStateAction<string>>
  addAddress: any
  setAddressConfirmed: React.Dispatch<React.SetStateAction<boolean>>
  setSWAddressConfirmed: React.Dispatch<React.SetStateAction<boolean>>
}

const unsupportedSWPlatforms = ['Binance', 'Huobi', 'KuCoin', 'Gate.io', 'FTX']

const SendForm = ({
  isHidden,
  asset,
  address,
  amount,
  assetsItems,
  maxAmount,
  selectedAsset,
  disabled,
  addressConfirmed,
  uDAddress,
  sWAddressConfirmed,
  showSWAddressWarning,
  validationFormMgs,
  smartContractWarning,
  unknownWarning,
  onSendPress,
  setAsset,
  addAddress,
  onAmountChange,
  setMaxAmount,
  setAddress,
  setAddressConfirmed,
  setSWAddressConfirmed
}: Props) => {
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

  const amountLabel = (
    <View style={[flexboxStyles.directionRow, spacings.mbMi]}>
      <Text style={spacings.mr}>{t('Available Amount:')}</Text>

      <View style={[flexboxStyles.directionRow, flexboxStyles.flex1]}>
        <Text numberOfLines={1} style={{ flex: 1, textAlign: 'right' }} ellipsizeMode="tail">
          {maxAmount}
        </Text>
        {!!selectedAsset && <Text>{` ${selectedAsset?.symbol}`}</Text>}
      </View>
    </View>
  )

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
        }}
      >
        {assetsItems.length ? (
          <>
            <Panel style={[spacings.mb0, isHidden && commonStyles.visibilityHidden]}>
              <Title style={textStyles.center}>{t('Send')}</Title>
              <View style={spacings.mbMi}>
                <Select
                  value={asset}
                  items={assetsItems.sort((a, b) =>
                    a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
                  )}
                  setValue={setAsset}
                />
              </View>
              {amountLabel}
              <NumberInput
                onChangeText={onAmountChange}
                containerStyle={spacings.mbTy}
                value={amount.toString()}
                button={t('MAX')}
                placeholder={t('0')}
                onButtonPress={setMaxAmount}
                error={
                  validationFormMgs.messages?.amount ? validationFormMgs.messages.amount : undefined
                }
              />
              <RecipientInput
                containerStyle={spacings.mb}
                isValidUDomain={!!uDAddress}
                placeholder={t('Recipient')}
                info={t(
                  'Please double-check the recipient address, blockchain transactions are not reversible.'
                )}
                isValid={address.length > 1 && !validationFormMgs.messages?.address && !!uDAddress}
                validLabel={uDAddress ? t('Valid Unstoppable domainsⓇ domain') : ''}
                error={validationFormMgs.messages?.address}
                value={address}
                onChangeText={setAddress}
              />

              <ConfirmAddress
                address={address}
                uDAddress={uDAddress}
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
              {showSWAddressWarning && (
                <Checkbox
                  value={sWAddressConfirmed}
                  onValueChange={() => setSWAddressConfirmed(!sWAddressConfirmed)}
                >
                  <Text fontSize={12} onPress={() => setSWAddressConfirmed(!sWAddressConfirmed)}>
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
            <View style={[spacings.phSm, spacings.mbMd, isHidden && commonStyles.visibilityHidden]}>
              <Button text={t('Send')} disabled={disabled} onPress={onSendPress} />
            </View>
          </>
        ) : (
          <Panel style={[{ flexGrow: 1 }, isHidden && commonStyles.visibilityHidden]}>
            <Text fontSize={16} style={textStyles.center}>
              {t("You don't have any funds on this account.")}
            </Text>
          </Panel>
        )}
      </TouchableWithoutFeedback>

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
        <AddAddressForm onSubmit={handleAddNewAddress} address={address} uDAddr={uDAddress} />
      </BottomSheet>
    </>
  )
}

export default React.memo(SendForm, isEqual)
