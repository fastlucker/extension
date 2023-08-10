import React, { FC, ReactElement, useRef, useState } from 'react'
import { FlatList, Modal, Pressable, TouchableOpacity, View } from 'react-native'

// import { Pressable } from 'react-native-web-hover'
import KebabMenuIcon from '@common/assets/svg/KebabMenuIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'

import styles from './styles'

interface Props {
  label: string
  data: Array<{ label: string; value: string }>
  onSelect: (item: { label: string; value: string }) => void
}

const Dropdown: FC<Props> = ({ label, data, onSelect }) => {
  const DropdownButton = useRef()
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(undefined)
  const [dropdownTop, setDropdownTop] = useState(0)

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown()
  }

  const openDropdown = (): void => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h)
    })
    setVisible(true)
  }

  const onItemPress = (item: any): void => {
    setSelected(item)
    // onSelect(item)
    setVisible(false)
  }

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <Pressable onPress={() => onItemPress(item)}>
      {({ hovered }: any) => (
        <View
          style={[
            styles.item,
            hovered && {
              borderRadius: 8,
              backgroundColor: colors.titanWhite
            }
          ]}
        >
          <Text fontSize={14} shouldScale={false}>
            {item.label}
          </Text>
        </View>
      )}
    </Pressable>
  )

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal visible={visible && !!dropdownTop} transparent animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={[styles.dropdown, { top: dropdownTop, right: 30 }]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  return (
    <Pressable onPress={toggleDropdown} ref={DropdownButton}>
      <View style={styles.button}>
        <KebabMenuIcon />
        {renderDropdown()}
      </View>
    </Pressable>
  )
}

export default Dropdown
