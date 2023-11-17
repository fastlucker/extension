import React, { FC } from 'react'
import { View } from 'react-native'

import Panel from '@common/components/Panel'
import useTheme from '@common/hooks/useTheme'

import Sidebar from './Sidebar'
import getStyles from './styles'

interface Props {
  children: React.ReactElement | React.ReactElement[]
  currentPage: string
}

const SettingsPage: FC<Props> = ({ children, currentPage }) => {
  const { styles } = useTheme(getStyles)
  return (
    <View style={{ flexDirection: 'row', flex: 1, backgroundColor: '#F2F3FA' }}>
      <Sidebar activeLink={currentPage} />
      <Panel style={styles.container}>{children}</Panel>
    </View>
  )
}

export default SettingsPage
