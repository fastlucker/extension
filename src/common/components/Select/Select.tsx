import React, { useMemo, useState } from 'react'
import {
  Keyboard,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableHighlight,
  Modal
} from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isWeb } from '@common/config/env'
import CheckIcon from '@common/assets/svg/CheckIcon'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import BottomSheet from '@common/components/BottomSheet'
import Input from '@common/components/Input'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'
import Dropdown from '@common/components/Select/Dropdown'
// import styles from './styles'

// interface Props {
//   value: string | null
//   options: any[]
//   setValue?: (value: any) => void
//   label?: string
//   extraText?: string
//   hasArrow?: boolean
//   disabled?: boolean
// }

// const Select = ({
//   value,
//   disabled,
//   setValue,
//   options,
//   label,
//   extraText,
//   hasArrow = true
// }: Props) => {
//   const [searchValue, setSearchValue] = useState('')
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const { t } = useTranslation()
//   const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

//   const item = useMemo(() => options?.find((i) => i.value === value), [value, options])

//   const filteredItems = useMemo(
//     () =>
//       searchValue
//         ? options.filter((i: any) => i?.label?.toLowerCase().includes(searchValue.toLowerCase()))
//         : options,
//     [options, searchValue]
//   )

//   const renderItem = ({ item: _item }: any) => {
//     const onSelect = () => {
//       !!setValue && setValue(_item.value)
//       !isWeb && closeBottomSheet()
//     }

//     return (
//       <TouchableOpacity
//         style={[
//           flexboxStyles.directionRow,
//           flexboxStyles.alignCenter,
//           spacings.phTy,
//           spacings.pvMi,
//           commonStyles.borderRadiusPrimary,
//           { backgroundColor: _item.value === value ? colors.howl : 'transparent' },
//           { opacity: _item?.disabled ? 0.3 : 1 }
//         ]}
//         activeOpacity={0.6}
//         onPress={onSelect}
//         disabled={_item?.disabled}
//       >
//         {!!_item.icon && _item.icon()}
//         <View style={[flexboxStyles.flex1, spacings.phTy, { backgroundColor: colors.howl }]}>
//           <Text numberOfLines={1}>{_item.label}</Text>
//         </View>
//         {_item.value === value && <CheckIcon />}
//       </TouchableOpacity>
//     )
//   }
//   console.log(isWeb)
//   return (
//     <>
//       <TouchableOpacity
//         onPress={() => {
//           console.log('onPress', isWeb, isDropdownOpen)
//           // debugger
//           !isWeb && Keyboard.dismiss()
//           !isWeb && openBottomSheet()
//           isWeb && setIsDropdownOpen(!isDropdownOpen)
//         }}
//         disabled={disabled}
//       >
//         <View pointerEvents="none">
//           <Input
//             placeholder={label}
//             value={item?.label}
//             leftIcon={item?.icon}
//             containerStyle={{ width: 250, marginBottom: 0 }}
//             inputStyle={[
//               isDropdownOpen && {
//                 borderBottom: 0,
//                 borderBottomRadius: 0,
//                 borderBottomRightRadius: 0,
//                 borderBottomLeftRadius: 0
//               }
//             ]}
//             button={
//               hasArrow ? (
//                 <View>
//                   {!!extraText && (
//                     <View style={styles.extra}>
//                       <Text fontSize={12} color={colors.heliotrope}>
//                         {extraText}
//                       </Text>
//                     </View>
//                   )}
//                   <NavIconWrapper onPress={() => null}>
//                     {isDropdownOpen ? (
//                       <UpArrowIcon width={34} height={34} />
//                     ) : (
//                       <DownArrowIcon width={34} height={34} />
//                     )}
//                   </NavIconWrapper>
//                 </View>
//               ) : (
//                 <></>
//               )
//             }
//           />
//         </View>
//       </TouchableOpacity>
//       <Dropdown
//         options={options}
//         isDropdownOpen={isDropdownOpen}
//         setIsDropdownOpen={setIsDropdownOpen}
//         selectedValue={value}
//         onSelect={setValue}
//       />
//       {
//         <BottomSheet
//           id="select-bottom-sheet"
//           sheetRef={sheetRef}
//           closeBottomSheet={closeBottomSheet}
//           displayCancel={false}
//           flatListProps={{
//             data: filteredItems || [],
//             renderItem,
//             keyExtractor: (i: any, idx: number) => `${i.value}-${idx}`,
//             ListEmptyComponent: (
//               <View style={[spacings.ptLg, flexboxStyles.alignCenter]}>
//                 <Text style={textStyles.center}>{t('No tokens were found.')}</Text>
//               </View>
//             ),
//             ListHeaderComponent: (
//               <View style={[spacings.pbSm, { backgroundColor: colors.clay }]}>
//                 <Input
//                   value={searchValue}
//                   containerStyle={spacings.mb0}
//                   onChangeText={setSearchValue}
//                   placeholder={t('Search...')}
//                 />
//               </View>
//             ),
//             stickyHeaderIndices: [0]
//           }}
//           // Disable dynamic height, because it breaks when the flat list items change dynamically
//           adjustToContentHeight={false}
//         />
//       }
//     </>
//   )
// }

// export default React.memo(Select)

const Select = ({ value, disabled, setValue, options, label, extraText, hasArrow = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const item = useMemo(() => options?.find((i) => i.value === value), [value, options])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionSelect = (option) => {
    setValue(option.value)
    setIsOpen(false)
  }

  const renderOption = (option) => {
    const optionStyle = value === option ? styles.selectedOption : styles.option
    return (
      <TouchableHighlight
        key={option.value}
        style={optionStyle}
        onPress={() => handleOptionSelect(option)}
        underlayColor="#ddd"
        activeOpacity={0.6}
      >
        <Text style={styles.optionText}>{option.label}</Text>
      </TouchableHighlight>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableHighlight onPress={toggleDropdown} underlayColor="#ddd">
        <View pointerEvents="none">
          <Input
            placeholder={label}
            value={item?.label}
            leftIcon={item?.icon}
            containerStyle={{ width: 250, marginBottom: 0 }}
            // inputWrapperStyle={[
            //   isOpen && {
            //     borderBottom: 0,
            //     borderBottomRightRadius: 0,
            //     borderBottomLeftRadius: 0
            //   }
            // ]}
            button={
              hasArrow ? (
                <View>
                  <NavIconWrapper onPress={() => null}>
                    {isOpen ? (
                      <UpArrowIcon width={34} height={34} />
                    ) : (
                      <DownArrowIcon width={34} height={34} />
                    )}
                  </NavIconWrapper>
                </View>
              ) : (
                <></>
              )
            }
          />
        </View>
      </TouchableHighlight>
      {isOpen && <View style={styles.optionsContainer}>{options.map(renderOption)}</View>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 10,
    zIndex: 9999
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: colors.scampi_20,
    backgroundColor: colors.white,
    maxHeight: 200,
    zIndex: 999,
    overflow: 'auto',
    opacity: 1
  },
  option: {
    padding: 10,
    color: colors.martinique_65,
    borderBottomWidth: 1,
    borderBottomColor: colors.scampi_20
  },
  selectedOption: {
    backgroundColor: '#ddd',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  optionText: {
    color: 'black'
  }
})

export default Select
