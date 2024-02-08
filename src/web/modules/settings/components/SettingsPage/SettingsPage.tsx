import React, { FC, Fragment } from 'react'
import { ScrollView, View } from 'react-native'

import Panel from '@common/components/Panel'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'

import Sidebar from './Sidebar'
import getStyles from './styles'

interface Props {
  children: React.ReactElement | React.ReactElement[]
  currentPage: string
  withPanelScrollView?: boolean
}

const SettingsPage: FC<Props> = ({ children, currentPage, withPanelScrollView = true }) => {
  const { styles } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const isScreenXxl = maxWidthSize('xxl')
  const isScreenXl = maxWidthSize('xl')

  const Wrapper = withPanelScrollView ? ScrollView : Fragment

  return (
    <View style={styles.background}>
      <View style={[styles.container, !isScreenXl ? styles.fullWidth : {}]}>
        <Sidebar activeLink={currentPage} />
        <Panel style={[styles.panel, !isScreenXl ? styles.fullWidth : {}]}>
          <Wrapper>{children}</Wrapper>
        </Panel>
        {isScreenXxl ? (
          <View style={styles.sideContainer}>
            <Sidebar activeLink={currentPage} />
          </View>
        ) : null}
      </View>
    </View>
  )
}

export default SettingsPage
