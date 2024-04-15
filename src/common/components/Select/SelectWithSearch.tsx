/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { components } from 'react-select'

import SearchIcon from '@common/assets/svg/SearchIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'

import SelectComponent from './Select'
import getStyles from './styles'
import { Props } from './types'

const SelectWithSearch = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setValue, disabled, openMenuOnClick = true, style } = props
  const { t } = useTranslation()
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
            menuIsOpen={isMenuOpen}
            onChange={(newValue) => {
              !!setValue && setValue(newValue)
              setIsMenuOpen(false)
            }}
            isSearchable
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            isClearable={false}
            placeholder={t('Search...')}
            components={{
              DropdownIndicator: null,
              IndicatorSeparator: null,
              Control: (p: any) => {
                const { children } = p
                return (
                  <components.Control {...p}>
                    <View style={[spacings.plSm]}>
                      <SearchIcon color={iconColors.primary} />
                    </View>
                    {children}
                  </components.Control>
                )
              }
            }}
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

export default React.memo(SelectWithSearch)
