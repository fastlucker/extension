import React, { useState } from 'react'
import {} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

// import styles from './styles'

interface Props {
  value: string | null
  items: any[]
  setValue?: (value: any) => void
  setItems?: (items: any) => void
  searchable?: boolean
}

const Select = ({ value, setValue, items, setItems, searchable = true }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      // @ts-ignore
      setValue={setValue}
      setItems={setItems}
      searchable={searchable}
    />
  )
}

export default Select
