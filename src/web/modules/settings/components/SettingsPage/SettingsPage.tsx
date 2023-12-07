import React, { FC, Fragment } from 'react'
import { ScrollView, View } from 'react-native'

import Panel from '@common/components/Panel'
import useTheme from '@common/hooks/useTheme'

import Sidebar from './Sidebar'
import getStyles from './styles'

interface Props {
  children: React.ReactElement | React.ReactElement[]
  currentPage: string
  withPanelScrollView?: boolean
}

const SettingsPage: FC<Props> = ({ children, currentPage, withPanelScrollView = true }) => {
  const { styles } = useTheme(getStyles)

  const Wrapper = withPanelScrollView ? ScrollView : Fragment

  return (
    <View style={styles.container}>
      <Sidebar activeLink={currentPage} />
      <Panel style={styles.panel}>
        <Wrapper>{children}</Wrapper>
      </Panel>
    </View>
  )
}

export default SettingsPage
