import React, { useState } from 'react'
import { Pressable, View, ViewStyle } from 'react-native'
import Select, { components, DropdownIndicatorProps } from 'react-select'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

import NavIconWrapper from '../NavIconWrapper'
import styles from './styles'

interface Props {
  value: object | null
  options: any[]
  setValue?: (value: any) => void
  label?: string
  disabled?: boolean
  menuPlacement?: string
  style?: ViewStyle
  controlStyle?: ViewStyle
  iconWidth?: number
  iconHeight?: number
}

const SelectComponent = ({
  value,
  disabled,
  setValue,
  options,
  label,
  menuPlacement = 'auto',
  style,
  controlStyle,
  iconWidth = 36,
  iconHeight = 36
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
    return (
      <components.DropdownIndicator {...props}>
        <NavIconWrapper
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
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
        {props.data.icon && (
          <View style={styles.optionIcon}>
            {React.isValidElement(props.data.icon) ? (
              props.data.icon
            ) : (
              <img src={props.data.icon} />
            )}
          </View>
        )}
        <Text>{props.data.label}</Text>
      </View>
    </components.Option>
  )

  // @TODO - Typescript support for `data` property
  const SingleValueIconOption = (props: SingleValueProps) => (
    <components.SingleValue {...props}>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.plTy]}>
        {props.data.icon && (
          <View style={styles.optionIcon}>
            {React.isValidElement(props.data.icon) ? (
              props.data.icon
            ) : (
              <img src={props.data.icon} />
            )}
          </View>
        )}
        <Text>{props.data.label}</Text>
      </View>
    </components.SingleValue>
  )

  return (
    <Pressable style={style} onPress={() => setIsDropdownOpen(!isDropdownOpen)} disabled={disabled}>
      <Select
        options={options}
        components={{ DropdownIndicator, Option: IconOption, SingleValue: SingleValueIconOption }}
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
        placeholder={label}
        menuPlacement={menuPlacement}
      />
    </Pressable>
  )
}

export default React.memo(SelectComponent)
