import React, { FC } from 'react'

import { AddressState } from '@ambire-common/interfaces/domains'
import EnsIcon from '@common/assets/svg/EnsIcon'
import UnstoppableDomainIcon from '@common/assets/svg/UnstoppableDomainIcon'

import Input, { InputProps } from '../Input/Input'
import styles from './AddressInput.module.scss'

type Props = {
  addressState: AddressState
  setAddressState: React.Dispatch<React.SetStateAction<AddressState>>
} & Omit<InputProps, 'onChange' | 'value'>

const AddressInput: FC<Props> = ({
  label,
  addressState,
  validation,
  infoLabel,
  setAddressState
}) => {
  const { fieldValue, ensAddress, udAddress } = addressState

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressState((prev) => ({
      ...prev,
      fieldValue: e.target.value
    }))
  }

  return (
    <div className={styles.wrapper}>
      <Input.Label label={label} />
      <div className={styles.inputWrapper}>
        <Input.Field
          value={fieldValue}
          onChange={onChange}
          placeholder="Address / ENS / UD"
          className={styles.input}
        />
        <div className={styles.domainsIcons}>
          <EnsIcon isActive={!!ensAddress} className={styles.ensIcon} />
          <UnstoppableDomainIcon isActive={!!udAddress} className={styles.udIcon} />
        </div>
      </div>
      <Input.ValidationAndInfo validation={validation} infoLabel={infoLabel} />
    </div>
  )
}

export default AddressInput
