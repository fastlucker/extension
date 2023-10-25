import React, { FC } from 'react'
import { View } from 'react-native'

import Sidebar from './Sidebar'

interface Props {
  children: React.ReactElement | React.ReactElement[]
  currentPage: string
}

const SettingsPage: FC<Props> = ({ children, currentPage }) => {
  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: '#F2F3FA' }}>
      <Sidebar activeLink={currentPage} />
      <View
        style={{
          marginLeft: 32,
          marginRight: 96,
          marginVertical: 36,
          flex: 1,
          backgroundColor: '#FFFFFF',
          borderColor: '#B8BDE0',
          borderWidth: 1,
          paddingVertical: 32,
          paddingHorizontal: 64,
          borderRadius: 6
        }}
      >
        {children}
      </View>
    </View>
  )
}

export default SettingsPage
