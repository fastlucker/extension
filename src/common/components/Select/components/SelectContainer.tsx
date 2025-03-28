/* eslint-disable react/prop-types */
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import BottomSheetHeader from '@common/components/Select/components/BottomSheetHeader'
import BottomSheetContainer from './BottomSheetContainer'
import getStyles, { DEFAULT_SELECT_SIZE } from '../styles'
import { CommonSelectProps } from '../types'
import useSelectInternal from '../useSelectInternal'
import MenuContainer from './MenuContainer'
import SelectedMenuOption from './SelectedMenuOption'

type Props = CommonSelectProps &
  ReturnType<typeof useSelectInternal> & {
    children: React.ReactNode
  }

const SelectContainer: FC<Props> = ({
  label,
  value,
  placeholder,
  containerStyle,
  selectStyle,
  labelStyle,
  menuStyle,
  disabled,
  withSearch = true,
  searchPlaceholder,
  isMenuOpen,
  selectRef,
  menuProps,
  menuLeftHorizontalOffset,
  menuRef,
  toggleMenu,
  control,
  children,
  size = DEFAULT_SELECT_SIZE,
  mode = 'select',
  testID,
  renderSelectedOption
}) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  return (
    <View style={[styles.selectContainer, containerStyle]} testID={testID}>
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
      {renderSelectedOption ? (
        renderSelectedOption({ toggleMenu, isMenuOpen, selectRef })
      ) : (
        <SelectedMenuOption
          disabled={disabled}
          isMenuOpen={isMenuOpen}
          selectRef={selectRef}
          toggleMenu={toggleMenu}
          value={value}
          placeholder={placeholder}
          selectStyle={selectStyle}
          size={size}
        />
      )}

      {mode === 'select' ? (
        isMenuOpen && (
          <MenuContainer
            menuRef={menuRef}
            menuStyle={menuStyle}
            menuProps={menuProps}
            menuLeftHorizontalOffset={menuLeftHorizontalOffset}
          >
            {!!withSearch && menuProps.position === 'bottom' && (
              <Search
                placeholder={searchPlaceholder || t('Search...')}
                autoFocus
                control={control}
                containerStyle={spacings.mb0}
                borderWrapperStyle={styles.searchBorderWrapperStyle}
                inputWrapperStyle={styles.bottomSearchInputWrapperStyle}
                leftIconStyle={spacings.pl}
              />
            )}
            {children}
            {!!withSearch && menuProps.position === 'top' && (
              <Search
                placeholder={searchPlaceholder || t('Search...')}
                autoFocus
                control={control}
                containerStyle={spacings.mb0}
                borderWrapperStyle={styles.searchBorderWrapperStyle}
                inputWrapperStyle={styles.topSearchInputWrapperStyle}
                leftIconStyle={spacings.pl}
              />
            )}
          </MenuContainer>
        )
      ) : (
        <BottomSheetContainer isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}>
          <BottomSheetHeader label={label} toggleMenu={toggleMenu} />
          <View style={[spacings.phMd, { height: 600 }]}>
            <Search
              placeholder={searchPlaceholder || t('Search...')}
              // TODO: when autoFocus is enabled, BottomSheet animation is broken
              autoFocus={false}
              control={control}
              containerStyle={spacings.mb}
              leftIconStyle={spacings.pl}
              height={48}
            />
            {children}
          </View>
        </BottomSheetContainer>
      )}
    </View>
  )
}

export default React.memo(SelectContainer)
