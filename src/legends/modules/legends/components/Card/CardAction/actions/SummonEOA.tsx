import React, { FC, useState } from 'react'

import { isValidAddress } from '@ambire-common/services/address'
import Input from '@legends/components/Input'

import CardActionWrapper from './CardActionWrapper'

type Props = {
  buttonText: string
}

const SummonEOA: FC<Props> = ({ buttonText }) => {
  const [eoaAddress, setEoaAddress] = useState('')

  const isValid = isValidAddress(eoaAddress)

  const onButtonClick = () => {
    alert(`Associated with EOA Address: ${eoaAddress}`)
    setEoaAddress('')
  }

  return (
    <CardActionWrapper buttonText={buttonText} disabled={!isValid} onButtonClick={onButtonClick}>
      <Input
        label="EOA Address"
        placeholder="Enter EOA Address"
        value={eoaAddress}
        state={isValid || !eoaAddress ? 'default' : 'error'}
        onChange={(e) => setEoaAddress(e.target.value)}
      />
    </CardActionWrapper>
  )
}

export default SummonEOA
