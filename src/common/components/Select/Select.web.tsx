import React, { useState } from 'react'
import { Pressable, TextStyle, View, ViewStyle } from 'react-native'
import Select, { components, DropdownIndicatorProps, OptionProps } from 'react-select'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

import NavIconWrapper from '../NavIconWrapper'
import styles from './styles'

export type OptionType = OptionProps['data']

interface Props {
  value: {} // @TODO: react-native works with object here, we need to find its type
  defaultValue?: {} // @TODO: react-native works with object here, we need to find its type
  options: any[]
  setValue?: (value: any) => void
  placeholder?: string
  label?: string
  labelStyle?: TextStyle
  disabled?: boolean
  menuPlacement?: string
  style?: ViewStyle
  controlStyle?: ViewStyle
  iconWidth?: number
  iconHeight?: number
  openMenuOnClick?: boolean
  onDropdownOpen?: () => void
}

const SelectComponent = ({
  value,
  defaultValue,
  disabled,
  setValue,
  options,
  placeholder,
  label,
  labelStyle,
  menuPlacement = 'auto',
  style,
  controlStyle,
  iconWidth = 36,
  iconHeight = 36,
  openMenuOnClick = true,
  onDropdownOpen
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
    return (
      <components.DropdownIndicator {...props}>
        <NavIconWrapper
          onPress={() => (onDropdownOpen ? onDropdownOpen() : setIsDropdownOpen(!isDropdownOpen))}
          width={iconWidth}
          height={iconHeight}
          hoverBackground={colors.lightViolet}
          style={{ borderColor: 'transparent', borderRadius: 10 }}
        >
          <DownArrowIcon width={26} height={26} isActive={isDropdownOpen} withRect={false} />
        </NavIconWrapper>
      </components.DropdownIndicator>
    )
  }

  // @TODO - Typescript support for `data` property
  const IconOption = (props: OptionProps) => (
    <components.Option {...props}>
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        {!!props.data.icon && typeof props.data.icon === 'function' && (
          <View style={styles.optionIcon}>{props.data.icon}</View>
        )}
        {!!props.data.icon && typeof props.data.icon === 'string' && (
          <img src={props.data.icon} style={styles.optionIcon} />
        )}
        {/* The label can be a string or a React component. If it is a string, it will be rendered as a text element. */}
        {typeof props.data.label === 'string' ? (
          <Text fontSize={14}>{props.data.label}</Text>
        ) : (
          props.data.label
        )}
      </View>
    </components.Option>
  )
  // @TODO - Typescript support for `data` property
  const SingleValueIconOption = (props: SingleValueProps) => (
    <components.SingleValue {...props}>
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        {!!props.data.icon && typeof props.data.icon === 'function' && (
          <View style={styles.optionIcon}>{props.data.icon}</View>
        )}
        {!!props.data.icon && typeof props.data.icon === 'string' && (
          <img src={props.data.icon} style={styles.optionIcon} />
        )}
        {/* The label can be a string or a React component. If it is a string, it will be rendered as a text element. */}
        {typeof props.data.label === 'string' ? (
          <Text fontSize={14}>{props.data.label}</Text>
        ) : (
          props.data.label
        )}
      </View>
    </components.SingleValue>
  )

  return (
    <>
      {label && <Text style={[spacings.mbMi, labelStyle]}>{label}</Text>}
      <Pressable
        onPress={() => {
          if (!openMenuOnClick) return
          onDropdownOpen ? onDropdownOpen() : setIsDropdownOpen(!isDropdownOpen)
        }}
        disabled={disabled}
        style={style}
      >
        <Select
          options={options}
          defaultValue={defaultValue}
          menuPortalTarget={document.body}
          // It fixes z-index/overlapping issue with the next closest element.
          // If we don't set it, the Select dropdown menu overlaps the next element once we show the menu.
          menuPosition="fixed"
          components={{ DropdownIndicator, Option: IconOption, SingleValue: SingleValueIconOption }}
          styles={{
            dropdownIndicator: (provided, state) => ({
              ...provided,
              ...flexbox.alignCenter,
              padding: 0,
              margin: 8
            }),
            indicatorSeparator: (styles) => ({ display: 'none' }),
            placeholder: (baseStyles) => ({
              ...baseStyles,
              ...common.borderRadiusPrimary,
              fontSize: 14,
              color: colors.martinique
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              background: colors.melrose_15,
              ...common.borderRadiusPrimary,
              fontSize: 14,
              color: colors.martinique,
              ...controlStyle
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
          placeholder={placeholder}
          openMenuOnClick={openMenuOnClick}
          menuPlacement={menuPlacement}
        />
      </Pressable>
    </>
  )
}

export default React.memo(SelectComponent)
