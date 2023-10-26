import React, { CSSProperties, FC, useState } from 'react'
import { Image, Pressable, TextStyle, View, ViewStyle } from 'react-native'
import Select, {
  components,
  DropdownIndicatorProps,
  MenuPlacement,
  OptionProps,
  SingleValueProps
} from 'react-select'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

import NavIconWrapper from '../NavIconWrapper'
import getStyles from './styles'

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
  menuPlacement?: MenuPlacement
  style?: ViewStyle
  controlStyle?: CSSProperties
  iconWidth?: number
  iconHeight?: number
  openMenuOnClick?: boolean
  onDropdownOpen?: () => void
}

const Option = ({ data }: { data: any }) => {
  const { styles } = useTheme(getStyles)

  if (!data) return null
  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
      {!!data?.icon && typeof data?.icon === 'object' && (
        <View style={styles.optionIcon}>{data.icon}</View>
      )}
      {!!data?.icon && typeof data?.icon === 'string' && (
        <Image source={{ uri: data.icon }} style={styles.optionIcon} />
      )}
      {/* The label can be a string or a React component. If it is a string, it will be rendered as a text element. */}
      {typeof data?.label === 'string' ? <Text fontSize={14}>{data.label}</Text> : data?.label}
    </View>
  )
}

const IconOption: FC<OptionProps> = ({ data, ...rest }) => (
  // @ts-ignore
  <components.Option data={data} {...rest}>
    <Option data={data} />
  </components.Option>
)

const SingleValueIconOption: FC<SingleValueProps> = ({ data, ...rest }) => (
  <components.SingleValue data={data} {...rest}>
    <Option data={data} />
  </components.SingleValue>
)

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
  const { theme } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const DropdownIndicator = (props: DropdownIndicatorProps<any>) => {
    return (
      <components.DropdownIndicator {...props}>
        <NavIconWrapper
          onPress={() => (onDropdownOpen ? onDropdownOpen() : setIsDropdownOpen(!isDropdownOpen))}
          width={iconWidth}
          height={iconHeight}
          hoverBackground={theme.primaryLight}
          style={{ borderColor: 'transparent', borderRadius: 10 }}
        >
          <DownArrowIcon width={26} height={26} isActive={isDropdownOpen} withRect={false} />
        </NavIconWrapper>
      </components.DropdownIndicator>
    )
  }

  return (
    <>
      {!!label && (
        <Text weight="regular" style={[spacings.mbTy, spacings.mlTy, labelStyle]}>
          {label}
        </Text>
      )}
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
            dropdownIndicator: (provided) => ({
              ...provided,
              ...(flexbox.alignCenter as CSSProperties),
              padding: 0,
              margin: 8
            }),
            indicatorSeparator: () => ({ display: 'none' }),
            placeholder: (baseStyles) => ({
              ...baseStyles,
              ...(common.borderRadiusPrimary as CSSProperties),
              fontSize: 14,
              color: theme.primaryText
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              background: colors.melrose_15,
              ...(common.borderRadiusPrimary as CSSProperties),
              fontSize: 14,
              color: theme.primaryText,
              ...controlStyle
            }),
            option: (baseStyles) => ({
              ...baseStyles,
              fontSize: 14,
              cursor: 'pointer',
              color: theme.primaryText
            })
          }}
          theme={(incomingTheme) => ({
            ...incomingTheme,
            borderRadius: 0,
            colors: {
              ...incomingTheme.colors,
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
