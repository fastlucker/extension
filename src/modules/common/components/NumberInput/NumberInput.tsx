import React from 'react'

import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import Input from '../Input'
import { InputProps } from '../Input/Input'

interface Props extends InputProps {
  buttonText?: string
  onButtonPress?: () => any
  precision?: any
  label?: string
  labelComponent?: Element
  disabled?: boolean
}

const NumberInput = ({
  onChangeText,
  precision,
  label,
  labelComponent,
  disabled,
  ...rest
}: Props) => {
  const onInputValue = (value: string) => {
    if (!onChangeText) return
    if (!value) return onChangeText('')
    // eslint-disable-next-line no-param-reassign
    value = value.replace(',', '.')
    const afterDecimals = value?.split('.')[1]
    if (afterDecimals && afterDecimals.length > precision) return

    const isIntOrFloat = /^[0-9]+\.{0,1}[0-9]*$/g.test(value)
    isIntOrFloat && onChangeText(value)
  }
  return (
    <>
      {!!label && <Text style={[spacings.mbMi, flexboxStyles.flex1]}>{label}</Text>}
      {!!labelComponent && labelComponent}
      <Input
        keyboardType="numeric"
        autoCapitalize="none"
        disabled={disabled}
        autoCorrect={false}
        onChangeText={onInputValue}
        {...rest}
      />
    </>
  )
}

export default NumberInput
