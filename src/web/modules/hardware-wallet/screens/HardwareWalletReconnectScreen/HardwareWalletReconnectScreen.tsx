import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import { useTranslation } from '@common/config/localization'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import HardwareWalletSelectorItem from '@web/modules/hardware-wallet/components/HardwareWalletSelectorItem'
import LedgerConnectModal from '@web/modules/hardware-wallet/components/LedgerConnectModal'
import useLedger from '@web/modules/hardware-wallet/hooks/useLedger'
import getOptions from '@web/modules/hardware-wallet/screens/HardwareWalletSelectorScreen/options'

const HardwareWalletReconnectScreen = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { theme } = useTheme()
  const [isLedgerConnectModalVisible, setIsLedgerConnectModalVisible] = useState(false)
  const route = useRoute()
  const { isLedgerConnected, setIsLedgerConnected } = useLedger()
  const { dispatch } = useBackgroundService()

  const onLedgerPress = useCallback(() => setIsLedgerConnectModalVisible(true), [])
  const onLedgerModalClose = useCallback(() => setIsLedgerConnectModalVisible(false), [])
  const onLedgerConnect = useCallback(() => {
    addToast(t('Ledger reconnected successfully.'), { type: 'success' })
    setIsLedgerConnectModalVisible(false)
    // Trigger an update manually since listeners might not get triggered
    // (if the Ledger is continuously connected and focus is not lost).
    setIsLedgerConnected(true)
  }, [setIsLedgerConnected, addToast, t])

  const options = useMemo(
    // As of v4.28.0, the only hardware wallet with an option to reconnect is Ledger
    () => getOptions({ onLedgerPress }).filter((o) => o.id === 'ledger'),
    [onLedgerPress]
  )

  const handleOnContinue = useCallback(() => {
    const params = new URLSearchParams(route?.search)
    const actionId = params.get('actionId')
    if (actionId)
      dispatch({ type: 'ACTIONS_CONTROLLER_SET_CURRENT_ACTION_BY_ID', params: { actionId } })

    window.close()
  }, [dispatch, route])

  return (
    <TabLayoutContainer
      width="lg"
      backgroundColor={theme.secondaryBackground}
      footer={
        <View style={[flexbox.flex1, flexbox.alignEnd]}>
          <Button
            size="large"
            onPress={handleOnContinue}
            disabled={!isLedgerConnected}
            hasBottomSpacing={false}
            text={t('Continue')}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </View>
      }
      style={spacings.mtLg}
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Reconnect hardware wallet')}>
          <View style={[flexbox.directionRow]}>
            {options.map((option) => (
              <HardwareWalletSelectorItem
                key={option.title}
                title={
                  option.id !== 'ledger'
                    ? option.title
                    : isLedgerConnected
                    ? 'Ledger (connected ✅)'
                    : option.title
                }
                isDisabled={option.id === 'ledger' && isLedgerConnected}
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
