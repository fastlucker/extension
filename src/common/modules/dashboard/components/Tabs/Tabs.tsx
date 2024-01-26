import React from 'react'
import { View } from 'react-native'

import useTheme from '@common/hooks/useTheme'

import getStyles from './styles'
import Tab from './Tab'

interface Props {
  openTab: 'tokens' | 'collectibles' | 'defi'
  setOpenTab: React.Dispatch<React.SetStateAction<'tokens' | 'collectibles' | 'defi'>>
  handleChangeQuery: (openTab: string) => void
}

const Tabs: React.FC<Props> = ({ openTab, setOpenTab, handleChangeQuery }) => {
  const { styles, theme } = useTheme(getStyles)

  return (
    <View style={styles.container}>
      <Tab
        openTab={openTab}
        tab="tokens"
        tabLabel="Tokens"
        setOpenTab={setOpenTab}
        handleChangeQuery={handleChangeQuery}
      />
      <View
        style={{
          width: 1,
          height: 24,
          backgroundColor: openTab === 'defi' ? theme.secondaryBorder : 'transparent'
        }}
      />
      <Tab
        openTab={openTab}
        tab="collectibles"
        tabLabel="NFTs"
        setOpenTab={setOpenTab}
        handleChangeQuery={handleChangeQuery}
      />
      <View
        style={{
          width: 1,
          height: 24,
          backgroundColor: openTab === 'tokens' ? theme.secondaryBorder : 'transparent'
        }}
      />
      <Tab
        openTab={openTab}
        tab="defi"
        tabLabel="DeFi positions"
        setOpenTab={setOpenTab}
        handleChangeQuery={handleChangeQuery}
      />
    </View>
  )
}

export default Tabs
