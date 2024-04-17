/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, Pressable, View } from 'react-native'

import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useElementSize from '@common/hooks/useElementSize'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { Portal } from '@gorhom/portal'

import getStyles from './styles'
import { SelectProps, SelectValue } from './types'

const Option = React.memo(({ item }: { item: SelectValue }) => {
  const { styles } = useTheme(getStyles)

  if (!item) return null
  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
      {!!item?.icon && typeof item?.icon === 'object' && (
        <View style={styles.optionIcon}>{item.icon}</View>
      )}
      {!!item?.icon && typeof item?.icon === 'string' && (
        <Image source={{ uri: item.icon }} style={styles.optionIcon} />
      )}
      {/* The label can be a string or a React component. If it is a string, it will be rendered as a text element. */}
      {typeof item?.label === 'string' ? <Text fontSize={14}>{item.label}</Text> : item?.label}
    </View>
  )
})

const Select = ({
  label,
  setValue,
  value,
  options,
  placeholder,
  containerStyle,
  selectStyle,
  labelStyle
}: SelectProps) => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, styles } = useTheme(getStyles)
  const selectRef = useRef(null)
  const menuRef = useRef(null)
  const { x, y, height, width } = useElementSize(selectRef)

  // close menu on click outside
  useEffect(() => {
    if (!isWeb) return
    function handleClickOutside(event: MouseEvent) {
      if (!isMenuOpen) return
      // @ts-ignore
      if (menuRef.current && !menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      if (!isWeb) return
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const renderItem = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ item }: { item: SelectValue }) => {
      const isSelected = item.value === value.value
      return (
        <Pressable
          style={({ hovered }: any) => [
            styles.menuOption,
            isSelected && { backgroundColor: theme.tertiaryBackground },
            hovered && { backgroundColor: theme.secondaryBackground }
          ]}
          onPress={() => {
            !!setValue && setValue(item)
            setIsMenuOpen(false)
          }}
        >
          <Option item={item} />
        </Pressable>
      )
    },
    [setValue, styles, value, theme]
  )

  return (
    <View style={[styles.selectContainer, containerStyle]}>
      {!!label && (
        <Text
          appearance="secondaryText"
          fontSize={14}
          weight="regular"
          style={[spacings.mbMi, labelStyle]}
        >
          {label}
        </Text>
      )}
      <Pressable
        style={[styles.selectBorderWrapper, isMenuOpen && { borderColor: theme.infoBackground }]}
        onPress={() => setIsMenuOpen((p) => !p)}
      >
        <View
          ref={selectRef}
          style={[
            styles.select,
            { borderColor: isMenuOpen ? theme.infoDecorative : theme.secondaryBorder },
            selectStyle
          ]}
        >
          {!value && <Text fontSize={14}>{placeholder || t('Select...')}</Text>}
          {!!value && <Option item={value} />}
        </View>
      </Pressable>
      {!!isMenuOpen && (
        <Portal hostName="global">
          <View style={styles.menuBackdrop}>
            <View ref={menuRef} style={[styles.menuContainer, { top: y + height, left: x, width }]}>
              <FlatList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item) => item.value.toString()}
                initialNumToRender={15}
                windowSize={10}
                removeClippedSubviews
              />
            </View>
          </View>
        </Portal>
      )}
    </View>
  )
}

export default React.memo(Select)
