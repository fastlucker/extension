/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { networks as predefinedNetworks } from '@ambire-common/consts/networks'
import CloseIcon from '@common/assets/svg/CloseIcon'
import EditPenIcon from '@common/assets/svg/EditPenIcon'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import NetworkForm from '@web/modules/settings/screens/NetworksSettingsScreen/NetworkForm'

import getStyles from './styles'

type Props = {
  name: string
  iconUrls?: string[]
  rpcUrls: string[]
  chainId: string
  explorerUrl: string
  nativeAssetSymbol: string
  handleRemoveNetwork?: (chainId: string | number) => void
}

const NetworkDetails = ({
  name,
  iconUrls = [],
  rpcUrls,
  chainId,
  explorerUrl,
  nativeAssetSymbol,
  handleRemoveNetwork
}: Props) => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { pathname } = useRoute()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const isEmpty = useMemo(
    () => [name, rpcUrls[0], chainId].some((p) => p === '-'),
    [chainId, name, rpcUrls]
  )

  const shouldDisplayEditButton = useMemo(
    () => pathname?.includes(ROUTES.networksSettings) && !isEmpty,
    [pathname, isEmpty]
  )

  const shouldDisplayRemoveButton = useMemo(
    () =>
      pathname?.includes(ROUTES.networksSettings) &&
      !isEmpty &&
      !predefinedNetworks.find((n) => Number(n.chainId) === Number(chainId)) &&
      handleRemoveNetwork,
    [pathname, chainId, isEmpty, handleRemoveNetwork]
  )

  const renderInfoItem = useCallback(
    (title: string, value: string, withBottomSpacing = true) => {
      return (
        <View
          style={[flexbox.directionRow, flexbox.alignCenter, !!withBottomSpacing && spacings.mb]}
        >
          <Text fontSize={14} appearance="tertiaryText" style={[spacings.mr]} numberOfLines={1}>
            {title}
          </Text>
          <View
            style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1, flexbox.justifyEnd]}
          >
            {title === 'Network Name' && value !== '-' && (
              <View style={spacings.mrMi}>
                <NetworkIcon
                  size={32}
                  uris={iconUrls.length ? iconUrls : undefined}
                  id={name.toLowerCase() as any}
                />
              </View>
            )}
            <Text
              fontSize={14}
              appearance={value === 'Invalid Chain ID' ? 'errorText' : 'primaryText'}
              numberOfLines={1}
            >
              {value}
            </Text>
          </View>
        </View>
      )
    },
    [name, iconUrls]
  )

  return (
    <>
      <View style={[styles.container, shouldDisplayEditButton && spacings.ptSm]}>
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            shouldDisplayEditButton ? spacings.mbLg : spacings.mbMd
          ]}
        >
          <Text
            fontSize={18}
            weight="medium"
            style={[flexbox.flex1, spacings.mrTy]}
            numberOfLines={1}
          >
            {t('Network details')}
          </Text>
          {!!shouldDisplayEditButton && (
            <Button
              style={[{ maxHeight: 32 }, !!shouldDisplayRemoveButton && spacings.mrTy]}
              text={t('Edit')}
              type="secondary"
              onPress={openBottomSheet as any}
              hasBottomSpacing={false}
            >
              <View style={spacings.plTy}>
                <EditPenIcon width={12} height={12} color={theme.primary} />
              </View>
            </Button>
          )}
          {!!shouldDisplayRemoveButton && (
            <Button
              style={{ maxHeight: 32 }}
              text={t('Remove')}
              type="danger"
              onPress={() => {
                !!handleRemoveNetwork && handleRemoveNetwork(chainId)
              }}
              hasBottomSpacing={false}
            >
              <View style={spacings.plTy}>
                <CloseIcon width={12} height={12} color={theme.errorDecorative} />
              </View>
            </Button>
          )}
        </View>
        <View style={flexbox.flex1}>
          {renderInfoItem(t('Network Name'), name)}
          {/* TODO: show all urls */}
          {renderInfoItem(t('RPC URL'), rpcUrls[0])}
          {renderInfoItem(t('Chain ID'), chainId)}
          {renderInfoItem(t('Currency Symbol'), nativeAssetSymbol)}
          {renderInfoItem(t('Block Explorer URL'), explorerUrl, false)}
        </View>
      </View>
      <BottomSheet
        id="edit-network-bottom-sheet"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        scrollViewProps={{
          scrollEnabled: false,
          contentContainerStyle: { flex: 1 }
        }}
        containerInnerWrapperStyles={{ flex: 1 }}
        backgroundColor="primaryBackground"
        style={{ ...spacings.ph0, ...spacings.pv0, overflow: 'hidden' }}
      >
        <NetworkForm selectedNetworkId={name.toLowerCase()} onSaved={closeBottomSheet} />
      </BottomSheet>
    </>
  )
}

export default React.memo(NetworkDetails)
