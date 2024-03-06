import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import CloseIcon from '@common/assets/svg/CloseIcon'
import DAppsIcon from '@common/assets/svg/DAppsIcon'
import PowerIcon from '@common/assets/svg/PowerIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useDappsControllerState from '@web/hooks/useDappsControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import getStyles from './styles'

type NetworkOption = {
  value: string
  label: JSX.Element
  icon: JSX.Element
}

const DAppFooter = () => {
  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()
  const { styles, theme } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { currentDapp } = useDappsControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const [network, setNetwork] = useState<NetworkDescriptor>(
    networks.filter((n) => Number(n.chainId) === currentDapp?.chainId)[0] ||
      networks.filter((n) => n.id === 'ethereum')[0]
  )

  const currentDappController = useCallback(
    (settingsButtonType: 'open' | 'close') => {
      return (
        <View>
          <View style={styles.titleWrapper}>
            <Text weight="medium" fontSize={10}>
              {t('Manage current dApp')}
            </Text>
          </View>
          <View style={styles.border}>
            {currentDapp ? (
              <View style={styles.currentDApp}>
                <Image
                  source={{ uri: currentDapp?.icon }}
                  resizeMode="contain"
                  style={styles.icon}
                />
                <View style={spacings.mlMi}>
                  <Text fontSize={12} weight="medium">
                    {currentDapp?.name}
                  </Text>
                  <Text
                    weight="regular"
                    color={currentDapp?.isConnected ? theme.successText : theme.errorText}
                    fontSize={10}
                  >
                    {currentDapp?.isConnected
                      ? t(`Connected on ${network.name}`)
                      : t('Not connected')}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.currentDApp}>
                <DAppsIcon width={24} height={24} color={theme.secondaryText} />
                <Text
                  fontSize={14}
                  appearance="secondaryText"
                  weight="regular"
                  style={spacings.mlTy}
                >
                  {t('No DApp found')}
                </Text>
              </View>
            )}
            <View style={flexbox.directionRow}>
              {currentDapp?.isConnected && (
                <Button
                  type="danger"
                  size="small"
                  hasBottomSpacing={false}
                  text={t('Disconnect')}
                  style={spacings.mrSm}
                  onPress={() => {
                    dispatch({
                      type: 'WALLET_CONTROLLER_REMOVE_CONNECTED_SITE',
                      params: { origin: currentDapp.origin }
                    })
                  }}
                >
                  <View style={spacings.plTy}>
                    <PowerIcon />
                  </View>
                </Button>
              )}
              <Button
                type="secondary"
                size="small"
                hasBottomSpacing={false}
                text={t('Settings')}
                disabled={!currentDapp?.isConnected}
                onPress={() => {
                  settingsButtonType === 'open' && openBottomSheet()
                  settingsButtonType === 'close' && closeBottomSheet()
                }}
              >
                <View style={spacings.plTy}>
                  {settingsButtonType === 'open' && <UpArrowIcon color={theme.primary} />}
                  {settingsButtonType === 'close' && <CloseIcon color={theme.primary} />}
                </View>
              </Button>
            </View>
          </View>
        </View>
      )
    },
    [currentDapp, network?.name, styles, theme, openBottomSheet, closeBottomSheet, dispatch, t]
  )

  const handleSetNetworkValue = useCallback(
    (networkOption: NetworkOption) => {
      if (currentDapp?.origin) {
        const newNetwork = networks.filter((net) => net.id === networkOption.value)[0]
        setNetwork(newNetwork)
        dispatch({
          type: 'CHANGE_CURRENT_DAPP_NETWORK',
          params: {
            chainId: Number(newNetwork.chainId),
            origin: currentDapp.origin
          }
        })
      }
    },
    [networks, currentDapp?.origin, dispatch]
  )

  const networksOptions: NetworkOption[] = useMemo(
    () =>
      networks.map((n) => ({
        value: n.id,
        label: <Text weight="medium">{n.name}</Text>,
        icon: <NetworkIcon name={n.id as NetworkIconNameType} />
      })),
    [networks]
  )

  return (
    <View style={styles.footerContainer}>
      <View style={styles.container}>
        {currentDappController('open')}
        <BottomSheet id="dapp-footer" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
          <View style={[spacings.mbLg, spacings.ptSm]}>{currentDappController('close')}</View>
          <View style={styles.networkSelectorContainer}>
            <Text fontSize={14} style={flexbox.flex1}>
              {t('Select Current dApp Network')}
            </Text>
            <Select
              setValue={handleSetNetworkValue}
              style={{ width: 230 }}
              controlStyle={{ height: 40 }}
              options={networksOptions}
              value={networksOptions.filter((opt) => opt.value === network.id)[0]}
            />
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbTy]}>
            <Text style={spacings.mrLg} fontSize={12}>
              {t(
                'Our dApp Catalog is a curated collection of popular and verified decentralized apps. You can personalize it by adding the current dApp to the list, allowing quick and secure navigation in future use.'
              )}
            </Text>
            <Button size="small" type="secondary" text={t('Add to dApp Catalog')} disabled />
          </View>
        </BottomSheet>
      </View>
    </View>
  )
}

export default React.memo(DAppFooter)
