import { Address } from 'ambire-common/src/hooks/useAddressBook'
import { isKnownTokenOrContract, isValidAddress } from 'ambire-common/src/services/address'
import { getBip44Items, resolveENSDomain } from 'ambire-common/src/services/ensDomains'
import { resolveUDomain } from 'ambire-common/src/services/unstoppableDomains'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Input from '@common/components/Input'
import RecipientInput from '@common/components/RecipientInput'
import Title from '@common/components/Title'
import { useTranslation } from '@common/config/localization'
import useAddressBook from '@common/hooks/useAddressBook'
import useConstants from '@common/hooks/useConstants'
import useNetwork from '@common/hooks/useNetwork'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

export type AddReferralFormValues = {
  address: Address['address']
  hexAddress: Address['address']
  type: Address['type']
}

interface Props {
  initialValue: string
  onSubmit: ({ address, type }: AddReferralFormValues) => void
}

const AddReferralForm = ({ onSubmit, initialValue }: Props) => {
  const { t } = useTranslation()
  const [addr, setAddr] = useState<string>(initialValue || '')
  const [uDAddress, setUDAddress] = useState<string>('')
  const [ensAddress, setEnsAddress] = useState<string>('')

  const timer: any = useRef(null)
  const checkedIsUDAddress: any = useRef(false)
  const { network }: any = useNetwork()

  useEffect(() => {
    ;(async () => {
      if (addr) {
        checkedIsUDAddress.current = true
      }
    })()
  }, [addr, uDAddress])

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    const validate = async () => {
      const uDAddr = await resolveUDomain(addr, null, network.unstoppableDomainsChain)
      const bip44Item = getBip44Items(null)
      const ensAddr = await resolveENSDomain(addr, bip44Item)
      timer.current = null
      setUDAddress(uDAddr || '')
      setEnsAddress(ensAddr || '')
      checkedIsUDAddress.current = true
    }

    timer.current = setTimeout(async () => {
      return validate()
    }, 300)
  }, [addr, network.unstoppableDomainsChain])

  const handleSubmit = () => {
    onSubmit({
      address: addr,
      hexAddress: uDAddress || ensAddress || addr,
      type: uDAddress ? 'ud' : ensAddress ? 'ens' : 'pub'
    })
  }

  return (
    <>
      <RecipientInput
        onChangeText={setAddr}
        isValidUDomain={!!uDAddress}
        isValidEns={!!ensAddress}
        containerStyle={spacings.mbTy}
        placeholder={t('Address / UDⓇ / ENSⓇ domain')}
        isValid={!!uDAddress || !!ensAddress}
        error={
          checkedIsUDAddress.current &&
          !!addr &&
          !isValidAddress(uDAddress || ensAddress || addr) &&
          (t('Invalid address.') as string)
        }
        value={addr}
      />

      <Button
        style={spacings.mtTy}
        onPress={handleSubmit}
        text={t('Submit')}
        disabled={!addr || !isValidAddress(uDAddress || ensAddress || addr)}
      />
    </>
  )
}

export default AddReferralForm
