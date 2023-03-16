import React from 'react'

import Text from '@common/components/Text'
import colors from '@common/styles/colors'

type Props = {
  id: string
  isOn: boolean
  onToggle: React.ChangeEventHandler<HTMLInputElement> | undefined
  label?: string
}

const Toggle: React.FC<Props> = ({ id, isOn, onToggle, label }) => {
  return (
    <label className="toggle" htmlFor={id}>
      <input className="toggle__input" type="checkbox" checked={isOn} id={id} onChange={onToggle} />
      <div className="toggle__fill" />
      <Text fontSize={18} weight="regular" color={colors.martinique}>
        {label}
      </Text>
    </label>
  )
}

export default Toggle
