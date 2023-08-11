import React, { useState } from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'
import Select, {
  components,
  DropdownIndicatorProps,
  OptionProps,
  SingleValueProps
} from 'react-select'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import colors from '@common/styles/colors'
import common from '@common/styles/utils/common'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import styles from './styles'

interface Props {
  value: {} // @TODO: react-native works with object here, we need to find its type
  defaultValue?: {} // @TODO: react-native works with object here, we need to find its type
  options: any[]
  setValue?: (value: any) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  menuPlacement?: string
  controlStyle?: ViewStyle
  style?: ViewStyle
}

const SelectComponent = ({
  value,
  defaultValue,
  disabled,
  setValue,
  options,
  placeholder,
  label,
  menuPlacement = 'auto',
  controlStyle,
  style
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
    return (
      <components.DropdownIndicator {...props}>
        {isDropdownOpen ? (
          <UpArrowIcon width={34} height={34} />
        ) : (
          <DownArrowIcon width={34} height={34} />
        )}
      </components.DropdownIndicator>
    )
  }

  // @TODO - Typescript support for `data` property
  const IconOption = (props: OptionProps) => (
    <components.Option {...props}>
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        {props.data.icon && (
          <View style={styles.optionIcon}>
            <img src={props.data.icon} />
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
            <img src={props.data.icon} />
          </View>
        )}
        <Text>{props.data.label}</Text>
      </View>
    </components.SingleValue>
  )

  return (
    <>
      {label && <Text style={[spacings.mbMi]}>{label}</Text>}
      <TouchableOpacity
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={disabled}
        // The element should have a zIndex assigned, otherwise the dropdown menu will overlap with the close element.
        style={{ zIndex: 1, ...style }}
      >
        <Select
          options={options}
          defaultValue={defaultValue}
          components={{ DropdownIndicator, Option: IconOption, SingleValue: SingleValueIconOption }}
          styles={{
            placeholder: (baseStyles) => ({
              ...baseStyles,
              ...common.borderRadiusPrimary,
              fontSize: 14,
              color: colors.martinique
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              ...controlStyle,
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
          placeholder={placeholder}
          menuPlacement={menuPlacement}
        />
      </TouchableOpacity>
    </>
  )
}

export default React.memo(SelectComponent)
