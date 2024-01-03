import React from 'react'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'

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
    try {
      if (!onChangeText) return
      if (!value) return onChangeText('')
      // eslint-disable-next-line no-param-reassign
      value = value.replace(',', '.')
      const afterDecimals = value?.split('.')[1]
      if (afterDecimals && afterDecimals.length > precision) return

      const isIntOrFloat = /^[0-9]+\.{0,1}[0-9]*$/g.test(value)
      isIntOrFloat && onChangeText(value)
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
  return (
    <>
      {!!label && (
        <Text weight="regular" appearance="secondaryText" fontSize={14} style={[spacings.mbMi]}>
          {label}
        </Text>
      )}
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

export default React.memo(NumberInput)
