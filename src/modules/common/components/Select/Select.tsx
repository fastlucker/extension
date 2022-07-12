import React, { useState } from 'react'
import { Keyboard, View, ViewProps } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

import CheckIcon from '@assets/svg/CheckIcon'
import CloseIcon from '@assets/svg/CloseIcon'
import i18n from '@config/localization/localization'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import DownArrowIcon from '../../../../assets/svg/DownArrowIcon'
import NavIconWrapper from '../NavIconWrapper'
import styles from './styles'

DropDownPicker.addTranslation('EN', {
  PLACEHOLDER: i18n.t('Please select'),
  SEARCH_PLACEHOLDER: i18n.t('Search...'),
  SELECTED_ITEMS_COUNT_TEXT: i18n.t('{count} item(s) have been selected'),
  NOTHING_TO_SHOW: i18n.t('Nothing found.')
})

interface Props {
  value: string | null
  items: any[]
  setValue?: (value: any) => void
  setItems?: (items: any) => void
  searchable?: boolean
  onChangeValue?: (value: any) => void
  label?: string
  extraText?: string
  containerPropsStyle?: ViewProps['style']
}

const Select = ({
  value,
  setValue,
  items,
  setItems,
  searchable = true,
  onChangeValue,
  label,
  extraText,
  containerPropsStyle
}: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {!!label && <Text style={spacings.mbMi}>{label}</Text>}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={(isOpen) => {
          Keyboard.dismiss()
          setOpen(isOpen)
        }}
        itemKey="label"
        // @ts-ignore
        setValue={setValue}
        onChangeValue={onChangeValue}
        setItems={setItems}
        searchable={searchable}
        iconContainerStyle={styles.iconContainerStyle}
        theme="DARK"
        language="EN"
        style={styles.dropdown}
        labelStyle={styles.labelStyle}
        listItemContainerStyle={styles.listItemContainerStyle}
        selectedItemContainerStyle={styles.selectedItemContainerStyle}
        listItemLabelStyle={styles.listItemLabelStyle}
        searchContainerStyle={styles.searchContainerStyle}
        searchTextInputStyle={styles.searchTextInputStyle}
        containerProps={{ style: containerPropsStyle }}
        modalContentContainerStyle={styles.modalContentContainerStyle}
        disabledItemLabelStyle={{
          opacity: 0.2
        }}
        // So it displays 4 and a half items (indicating there is a scroll)
        maxHeight={290}
        // Using `FLATLIST` as `listMode` is causing a warning:
        // "VirtualizedLists should never be nested inside plain ScrollViews
        // with the same orientation because it can break windowing and other
        // functionality - use another VirtualizedList-backed container instead."
        // {@link https://github.com/hossein-zare/react-native-dropdown-picker/issues/56#issuecomment-841399365}
        // Using `SCROLLVIEW` as `listMode` is glitchy with Android
        // and sometimes iOS, especially when the component is nested
        // in a <Panel> or in many Views.
        // Therefore, because the main Wrapper of the screens is ScrollView,
        // we must use ScrollView for this component too.
        // So the only feasible option that works well for our use-cases
        // is to use it in a  `MODAL`.
        listMode="MODAL"
        ArrowDownIconComponent={() => (
          <View pointerEvents="none">
            {!!extraText && (
              <View style={styles.extra}>
                <Text fontSize={12} color={colors.heliotrope}>
                  {extraText}
                </Text>
              </View>
            )}
            <NavIconWrapper onPress={() => null}>
              <DownArrowIcon width={34} height={34} />
            </NavIconWrapper>
          </View>
        )}
        TickIconComponent={() => <CheckIcon color="transparent" />}
        ListEmptyComponent={() => (
          <View style={[spacings.ptLg, flexboxStyles.alignCenter]}>
            <Text style={textStyles.center}>No tokens were found.</Text>
          </View>
        )}
        CloseIconComponent={() => (
          <View pointerEvents="none">
            <NavIconWrapper onPress={() => null}>
              <CloseIcon />
            </NavIconWrapper>
          </View>
        )}
      />
    </>
  )
}

export default Select
