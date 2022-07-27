import { isKnownTokenOrContract, isValidAddress } from 'ambire-common/src/services/address'
import { resolveUDomain } from 'ambire-common/src/services/unstoppableDomains'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import { useBottomSheetInternal } from '@gorhom/bottom-sheet'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import RecipientInput from '@modules/common/components/RecipientInput'
import Title from '@modules/common/components/Title'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import useNetwork from '@modules/common/hooks/useNetwork'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Props {
  onSubmit: ({ name, address, isUD }: { name: string; address: string; isUD: boolean }) => void
  address: string
  uDAddr: string
}

const AddAddressForm = ({ onSubmit, address, uDAddr }: Props) => {
  const { t } = useTranslation()
  const [addrName, setAddrName] = useState<string>('')
  const [addr, setAddr] = useState<string>('')
  const [uDAddress, setUDAddress] = useState<string>('')

  const { isKnownAddress } = useAddressBook()

  const parsedAddr = uDAddr || address || ''

  const unknownWarning = useMemo(() => {
    if (uDAddress || uDAddr) {
      return !isKnownAddress(address)
    }
    return isValidAddress(address) && !isKnownAddress(address)
  }, [address, uDAddress, isKnownAddress, uDAddr])

  const smartContractWarning = useMemo(() => isKnownTokenOrContract(parsedAddr), [parsedAddr])

  const timer: any = useRef(null)
  const checkedIsUDAddress: any = useRef(false)
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal()
  const { network }: any = useNetwork()

  useEffect(() => {
    ;(async () => {
      console.log(address, uDAddr, smartContractWarning, unknownWarning)
      if (address && !smartContractWarning && !!unknownWarning) {
        setAddr(address)
        // const uDAddr = await resolveUDomain(addr, null, network.unstoppableDomainsChain)
        setUDAddress(uDAddr)
        checkedIsUDAddress.current = true
      }
    })()
  }, [address, uDAddr, smartContractWarning, unknownWarning])

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    const validate = async () => {
      const uDAddr = await resolveUDomain(addr, null, network.unstoppableDomainsChain)
      timer.current = null
      setUDAddress(uDAddr || '')
      checkedIsUDAddress.current = true
    }

    timer.current = setTimeout(async () => {
      return validate()
    }, 300)
  }, [addr, network.unstoppableDomainsChain])

  const onAddrNameChange = (value: string) => {
    setAddrName(value)
  }

  const onAddrChange = (value: string) => {
    setAddr(value)
  }

  const handleSubmit = () => {
    onSubmit({
      name: addrName,
      address: addr,
      isUD: !!uDAddress
    })
  }

  return (
    <>
      <View style={[spacings.mbSm, flexboxStyles.alignCenter]}>
        <Title>{t('Add New Address')}</Title>
      </View>

      <Input
        onBlur={() => {
          shouldHandleKeyboardEvents.value = false
        }}
        onFocus={() => {
          shouldHandleKeyboardEvents.value = true
        }}
        containerStyle={spacings.mbTy}
        placeholder={t('Address Name')}
        onChangeText={onAddrNameChange}
      />

      <RecipientInput
        onBlur={() => {
          shouldHandleKeyboardEvents.value = false
        }}
        onFocus={() => {
          shouldHandleKeyboardEvents.value = true
        }}
        onChangeText={onAddrChange}
        isValidUDomain={!!uDAddress}
        containerStyle={spacings.mbTy}
        placeholder={t('Address / Unstoppable domainsⓇ')}
        isValid={!!uDAddress}
        validLabel={uDAddress ? t('Valid Unstoppable domainsⓇ domain') : ''}
        error={
          checkedIsUDAddress.current &&
          !!addr &&
          !isValidAddress(uDAddress || addr) &&
          (t('Invalid address.') as string)
        }
        value={addr}
      />

      <Button
        onPress={handleSubmit}
        type="outline"
        text={t('Add Address')}
        disabled={!addrName || !isValidAddress(uDAddress || addr)}
      />
    </>
  )
}

export default AddAddressForm
