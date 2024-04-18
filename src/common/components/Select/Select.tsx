/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC } from 'react'
import { Image, View } from 'react-native'
import Select, { components, OptionProps, SingleValueProps } from 'react-select'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import Text from '@common/components/Text'
import { FONT_FAMILIES } from '@common/hooks/useFonts'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'
import { Props } from './types'

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
                color: theme.secondaryText,
                fontFamily: FONT_FAMILIES.REGULAR
              } as any),
            control: (baseStyles) =>
              ({
                ...baseStyles,
                height: 50,
                background: theme.secondaryBackground,
                ...common.borderRadiusPrimary,
                borderColor: `${theme.secondaryBorder as any} !important`,
                fontSize: 14,
                fontFamily: FONT_FAMILIES.REGULAR,
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
                fontFamily: FONT_FAMILIES.REGULAR,
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

export default React.memo(SelectComponent)
