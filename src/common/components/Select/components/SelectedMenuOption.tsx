import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from '../styles'
import { SelectProps } from '../types'
import { Option } from './MenuOption'

type SelectedMenuOptionProps = Pick<
  SelectProps,
  'disabled' | 'value' | 'placeholder' | 'selectStyle'
> & {
  isMenuOpen: boolean
  selectRef: React.RefObject<View>
  toggleMenu: () => void
}

const SelectedMenuOption: FC<SelectedMenuOptionProps> = ({
  disabled,
  isMenuOpen,
  selectRef,
  toggleMenu,
  value,
  placeholder,
  selectStyle
}) => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)

  return (
    <Pressable
      disabled={disabled}
      style={[
        styles.selectBorderWrapper,
        disabled && { opacity: 0.6 },
        isMenuOpen && { borderColor: theme.infoBackground }
      ]}
      onPress={toggleMenu}
    >
      <View
        ref={selectRef}
        style={[
          styles.select,
          { borderColor: isMenuOpen ? theme.primary : theme.secondaryBorder },
          selectStyle
        ]}
      >
        <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter, spacings.prTy]}>
          {!!value && <Option item={value} />}
          {!value && (
            <Text fontSize={14} appearance="secondaryText">
              {placeholder || t('Select...')}
            </Text>
          )}
        </View>
        {!!isMenuOpen && <UpArrowIcon />}
        {!isMenuOpen && <DownArrowIcon />}
      </View>
    </Pressable>
  )
}

export default SelectedMenuOption
