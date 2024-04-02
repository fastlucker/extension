import React, { useMemo, useState } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import useTheme from '@common/hooks/useTheme'
import useDappsControllerState from '@web/hooks/useDappsControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import DappControl from '@web/modules/dapp-catalog/components/DappControl'
import ManageDapp from '@web/modules/dapp-catalog/components/ManageDapp'

import getStyles from './styles'

const DAppFooter = () => {
  const { networks } = useSettingsControllerState()
  const { styles } = useTheme(getStyles)
  const { currentDapp } = useDappsControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const [hovered, setHovered] = useState(false)

  const network = useMemo(
    () =>
      networks.filter((n) => Number(n.chainId) === currentDapp?.chainId)[0] ||
      networks.filter((n) => n.id === 'ethereum')[0],
    [currentDapp?.chainId, networks]
  )

  return (
    <View style={styles.footerContainer}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <View style={styles.container}>
          <DappControl
            hasDapp={!!currentDapp}
            isHovered={hovered}
            url={currentDapp?.origin}
            name={currentDapp?.name}
            icon={currentDapp?.icon}
            inModal={false}
            isCurrentDapp
            networkName={network.name}
            isConnected={!!currentDapp?.isConnected}
            openBottomSheet={openBottomSheet}
            closeBottomSheet={closeBottomSheet}
          />
        </View>
      </div>
      <ManageDapp
        url={currentDapp?.origin}
        name={currentDapp?.name}
        icon={currentDapp?.icon}
        isCurrentDapp
        isConnected={!!currentDapp?.isConnected}
        sheetRef={sheetRef}
        openBottomSheet={openBottomSheet}
        closeBottomSheet={closeBottomSheet}
      />
    </View>
  )
}

export default React.memo(DAppFooter)
