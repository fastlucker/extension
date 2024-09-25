import React, { FC, ReactElement, useRef, useState } from 'react'
import { FlatList, Modal, Pressable, TouchableOpacity, View } from 'react-native'

import KebabMenuIcon from '@common/assets/svg/KebabMenuIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'

import styles from './styles'

interface Props {
  data: Array<{ label: string; value: string }>
  onSelect: (item: { label: string; value: string }) => void
  toggle?: number
}

const Dropdown: FC<Props> = ({ data, onSelect, toggle }) => {
  const DropdownButton: any = useRef()
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [parentUpdateCounter, setParentUpdateCounter] = useState(toggle ?? 0)

  const openDropdown = (): void => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setPosition({ x: _px - _w * 2, y: py + h })
    })
    setVisible(true)
  }

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown()
  }

  if (toggle && toggle !== parentUpdateCounter) {
    toggleDropdown()
    setParentUpdateCounter(toggle)
  }

  const onItemPress = (item: any): void => {
    onSelect(item)
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
      <Modal visible={visible && !!position.y} transparent animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={[styles.dropdown, { top: position.y, left: position.x }]}>
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
  /**
   * TODO:Currently this is implemented to open on click, but originally the design was for on hover.
   * The problem was when we use onHoverOut for closing the Dropdown,
   * the menu closes too quickly and flickers.
   * Also it closes when you try to go to the menu and hover on some option
   */
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
