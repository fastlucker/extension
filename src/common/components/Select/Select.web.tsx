import React, { useState } from 'react'
import { TouchableOpacity, ViewStyle } from 'react-native'
import Select, { components, DropdownIndicatorProps } from 'react-select'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import colors from '@common/styles/colors'
import common from '@common/styles/utils/common'

interface Props {
  value: object | null
  options: any[]
  setValue?: (value: any) => void
  label?: string
  disabled?: boolean
  menuPlacement?: string
  style?: ViewStyle
}

const SelectComponent = ({
  value,
  disabled,
  setValue,
  options,
  label,
  menuPlacement = 'auto',
  style
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
    return (
      <components.DropdownIndicator {...props}>
        {isDropdownOpen ? (
          <DownArrowIcon width={34} height={34} isActive />
        ) : (
          <DownArrowIcon width={34} height={34} />
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
          control: (baseStyles) => ({
            ...baseStyles,
            width: 260,
            background: colors.melrose_15,
            ...common.borderRadiusPrimary,
            fontSize: 14,
            color: colors.martinique
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
