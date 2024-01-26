import './styles.css'

import React from 'react'
import { View } from 'react-native'

import AmbireLogo from '@common/assets/svg/AmbireLogo'
import MetaMaskLogo from '@common/assets/svg/MetaMaskLogo'

import { ToggleProps } from './types'

const DefaultWalletToggle: React.FC<ToggleProps> = ({ id, isOn, onToggle, label }) => {
  const handleOnToggle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onToggle(e.target.checked)
  }

  return (
    <View>
      <label className="default-wallet-toggle" htmlFor={id}>
        {isOn && (
          <div className="default-wallet-toggle-left-icon">
            <AmbireLogo width={14} />
          </div>
        )}
        {!isOn && (
          <div className="default-wallet-toggle-right-icon">
            <MetaMaskLogo />
          </div>
        )}
        <input
          className="default-wallet-toggle__input"
          type="checkbox"
          checked={isOn}
          id={id}
          onChange={handleOnToggle}
        />
        <div className="default-wallet-toggle__fill" />
      </label>
    </View>
  )
}

export default DefaultWalletToggle
