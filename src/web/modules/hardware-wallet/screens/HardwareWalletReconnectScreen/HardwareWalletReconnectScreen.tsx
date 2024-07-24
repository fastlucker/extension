import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import BackButton from '@common/components/BackButton'
import Panel from '@common/components/Panel'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import HardwareWalletSelectorItem from '@web/modules/hardware-wallet/components/HardwareWalletSelectorItem'
import LedgerConnectModal from '@web/modules/hardware-wallet/components/LedgerConnectModal'
import getOptions from '@web/modules/hardware-wallet/screens/HardwareWalletSelectorScreen/options'

const HardwareWalletReconnectScreen = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { theme } = useTheme()
  const [isLedgerConnectModalVisible, setIsLedgerConnectModalVisible] = useState(false)

  const onLedgerPress = useCallback(() => setIsLedgerConnectModalVisible(true), [])
  const onLedgerModalClose = useCallback(() => setIsLedgerConnectModalVisible(false), [])
  const onLedgerConnect = useCallback(() => {
    addToast(t('Ledger reconnected successfully.'), { type: 'success' })
    setIsLedgerConnectModalVisible(false)
  }, [addToast, t])

  const options = useMemo(
    // As of v4.28.0, the only hardware wallet with an option to reconnect is Ledger
    () => getOptions({ onLedgerPress }).filter((o) => o.id === 'ledger'),
    [onLedgerPress]
  )

  return (
    <TabLayoutContainer
      width="lg"
      backgroundColor={theme.secondaryBackground}
      footer={<BackButton fallbackBackRoute={ROUTES.dashboard} />}
      style={spacings.mtLg}
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Reconnect hardware wallet')}>
          <View style={[flexbox.directionRow]}>
            {options.map((option) => (
              <HardwareWalletSelectorItem
                key={option.title}
                title={option.title}
                models={option.models}
                image={option.image}
                onPress={option.onPress}
              />
            ))}
          </View>
        </Panel>
        <LedgerConnectModal
          isVisible={isLedgerConnectModalVisible}
          handleClose={onLedgerModalClose}
          handleOnConnect={onLedgerConnect}
        />
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(HardwareWalletReconnectScreen)
