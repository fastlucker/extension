import React, { useState } from 'react'
import { TouchableOpacity, ViewStyle } from 'react-native'
import Select, { components, DropdownIndicatorProps } from 'react-select'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import colors from '@common/styles/colors'
import common from '@common/styles/utils/common'

import NavIconWrapper from '../NavIconWrapper'

interface Props {
  value: object | null
  options: any[]
  setValue?: (value: any) => void
  label?: string
  disabled?: boolean
  menuPlacement?: string
  style?: ViewStyle
  controlStyles?: ViewStyle
}

const SelectComponent = ({
  value,
  disabled,
  setValue,
  options,
  label,
  menuPlacement = 'auto',
  style,
  controlStyles
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
    return (
      <components.DropdownIndicator {...props}>
        {isDropdownOpen ? (
          <NavIconWrapper
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            width={25}
            height={25}
            style={{ borderColor: 'transparent', borderRadius: 10 }}
          >
            <DownArrowIcon width={24} height={24} isActive withRect={false} />
          </NavIconWrapper>
        ) : (
          <NavIconWrapper
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            width={25}
            height={25}
            style={{ borderColor: 'transparent', borderRadius: 10 }}
          >
            <DownArrowIcon width={24} height={24} withRect={false} />
          </NavIconWrapper>
        )}
      </components.DropdownIndicator>
    )
  }
  return (
    <TouchableOpacity
      style={style}
      onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      disabled={disabled}
    >
      <Select
        options={options}
        components={{ DropdownIndicator }}
        styles={{
          placeholder: (baseStyles) => ({
            ...baseStyles,
            ...common.borderRadiusPrimary,
            fontSize: 14,
            color: colors.martinique
          }),
          indicatorSeparator: (styles) => ({ display: 'none' }),
          control: (baseStyles) => ({
            ...baseStyles,
            background: colors.melrose_15,
            ...common.borderRadiusPrimary,
            fontSize: 14,
            color: colors.martinique,
            ...controlStyles
          }),
          option: (baseStyles) => ({
            ...baseStyles,
            fontSize: 14,
            cursor: 'pointer',
            color: colors.martinique
          })
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: colors.melrose_15,
            primary: colors.melrose
          }
        })}
        value={value}
        onChange={setValue}
        placeholder={label}
        menuPlacement={menuPlacement}
      />
    </TouchableOpacity>
  )
}

export default React.memo(SelectComponent)
