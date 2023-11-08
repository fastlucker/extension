import './styles.css'

import React from 'react'

import Text from '@common/components/Text'

import { ToggleProps } from './types'

const Toggle: React.FC<ToggleProps> = ({ id, isOn, onToggle, label }) => {
  const handleOnToggle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onToggle(e.target.checked)
  }

  return (
    <label className="toggle" htmlFor={id}>
      <input
        className="toggle__input"
        type="checkbox"
        checked={isOn}
        id={id}
        onChange={handleOnToggle}
      />
      <div className="toggle__fill" />
      <Text fontSize={12} weight="medium">
        {label}
      </Text>
    </label>
  )
}

export default Toggle
