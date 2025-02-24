import React, { FC } from 'react'

import { AddressState } from '@ambire-common/interfaces/domains'
import EnsIcon from '@common/assets/svg/EnsIcon'
import UnstoppableDomainIcon from '@common/assets/svg/UnstoppableDomainIcon'

import Input, { InputProps } from '../Input/Input'
import styles from './AddressInput.module.scss'

type Props = {
  addressState: AddressState
  setAddressState: React.Dispatch<React.SetStateAction<AddressState>>
  rightLabel?: string
} & Omit<InputProps, 'onChange' | 'value'>

const AddressInput: FC<Props> = ({
  label,
  rightLabel,
  addressState,
  validation,
  infoLabel,
  setAddressState,
  disabled
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
      <div style={{ display: 'flex' }}>
        <Input.Label label={label} />
        <Input.Label label={rightLabel} className={`${styles.leftLabel}`} />
      </div>
      <div className={styles.inputWrapper}>
        <Input.Field
          value={fieldValue}
          onChange={onChange}
          placeholder="Address / ENS / UD"
          className={styles.input}
          disabled={disabled}
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
