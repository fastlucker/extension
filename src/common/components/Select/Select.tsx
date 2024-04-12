/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { CSSProperties, FC, useState } from 'react'
import { Image, Pressable, TextStyle, View, ViewStyle } from 'react-native'
import Select, {
  components,
  MenuPlacement,
  OptionProps,
  Props as SelectProps,
  SingleValueProps
} from 'react-select'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

export type OptionType = OptionProps['data']

interface Props extends SelectProps {
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
  menuStyle?: ViewStyle
  controlStyle?: CSSProperties
  openMenuOnClick?: boolean
  onDropdownOpen?: () => void
  withSearch?: boolean
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
  menuStyle,
  openMenuOnClick = true,
  onDropdownOpen,
  withSearch,
  components: componentsProps,
  ...rest
}: Props) => {
  const { theme } = useTheme()

  const DropdownIndicator = () => {
    return (
      <View style={spacings.mrSm}>
        <DownArrowIcon />
      </View>
    )
  }

  return (
    <>
      {!!label && (
        <Text
          fontSize={14}
          weight="regular"
          appearance="secondaryText"
          style={[spacings.mbMi, labelStyle]}
        >
          {label}
        </Text>
      )}
      <View style={withSearch ? {} : style}>
        <Select
          {...(disabled
            ? {
                menuIsOpen: false,
                autoFocus: false
              }
            : {})}
          options={options}
          defaultValue={defaultValue}
          menuPortalTarget={document.body}
          // It fixes z-index/overlapping issue with the next closest element.
          // If we don't set it, the Select dropdown menu overlaps the next element once we show the menu.
          menuPosition="fixed"
          components={{
            DropdownIndicator,
            Option: IconOption,
            SingleValue: SingleValueIconOption,
            IndicatorSeparator: null,
            ...componentsProps
          }}
          styles={{
            placeholder: (baseStyles) =>
              ({
                ...baseStyles,
                ...common.borderRadiusPrimary,
                fontSize: 14,
                color: theme.primaryText
              } as any),
            control: (baseStyles) =>
              ({
                ...baseStyles,
                height: 50,
                background: theme.secondaryBackground,
                ...common.borderRadiusPrimary,
                borderColor: `${theme.secondaryBorder as any} !important`,
                fontSize: 14,
                color: theme.primaryText,
                outline: 'none',
                'box-shadow': 'none !important',
                cursor: 'pointer !important',
                ...controlStyle
              } as any),
            valueContainer: (baseStyles) => ({
              ...baseStyles,
              overflow: 'visible'
            }),
            singleValue: (baseStyles) => ({
              ...baseStyles,
              paddingTop: 0,
              paddingBottom: 0,
              overflow: 'visible'
            }),
            menu: (baseStyles) =>
              ({
                ...baseStyles,
                overflow: 'hidden',
                'box-shadow': 'none',
                'border-style': 'solid',
                borderWidth: 1,
                borderRadius: BORDER_RADIUS_PRIMARY,
                borderColor: theme.secondaryBorder,
                'box-sizing': 'border-box',
                ...menuStyle
              } as any),
            menuPortal: (baseStyles) => ({ ...baseStyles, zIndex: 9999 }),
            option: (baseStyles) =>
              ({
                ...baseStyles,
                fontSize: 14,
                cursor: 'pointer',
                color: theme.primaryText
              } as any),
            menuList: (baseStyles) => ({
              ...baseStyles,
              padding: 0
            })
          }}
          theme={(incomingTheme) => ({
            ...incomingTheme,
            borderRadius: 0,
            colors: {
              ...incomingTheme.colors,
              primary25: String(theme.secondaryBackground),
              primary: String(theme.tertiaryBackground)
            }
          })}
          isSearchable={false}
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          openMenuOnClick={openMenuOnClick}
          menuPlacement={menuPlacement}
          {...rest}
        />
      </View>
    </>
  )
}

const SelectWithSearch = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setValue, disabled, openMenuOnClick = true, style } = props

  const { styles } = useTheme(getStyles)

  return (
    <View style={[disabled && { opacity: 0.6 }, style]}>
      <Pressable
        onPress={() => {
          if (!openMenuOnClick) return
          setIsMenuOpen((p) => !p)
        }}
        disabled={disabled}
      >
        <SelectComponent
          {...props}
          withSearch
          menuIsOpen={false}
          autoFocus={false}
          components={{ IndicatorSeparator: null }}
        />
      </Pressable>
      {!!isMenuOpen && (
        <View style={styles.menuContainer}>
          <SelectComponent
            {...props}
            label={undefined}
            autoFocus
            menuIsOpen
            onChange={(newValue) => {
              !!setValue && setValue(newValue)
              setIsMenuOpen(false)
            }}
            isSearchable
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            isClearable={false}
            placeholder="Search..."
            components={{ DropdownIndicator: null, IndicatorSeparator: null }}
            controlStyle={{
              height: 40,
              borderWidth: 1,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
            menuStyle={{
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              marginTop: 0,
              borderTopWidth: 0
            }}
            backspaceRemovesValue={false}
          />
        </View>
      )}
      {!!isMenuOpen && (
        <div
          style={{
            bottom: 0,
            left: 0,
            top: 0,
            right: 0,
            position: 'fixed',
            zIndex: 1
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </View>
  )
}

export { SelectWithSearch }

export default React.memo(SelectComponent)
