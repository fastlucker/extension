/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

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
import ManifestImage from '@web/components/ManifestImage'
import NetworkForm from '@web/modules/settings/screens/NetworksSettingsScreen/NetworkForm'

import getStyles from './styles'

type Props = {
  name: string
  iconUrl?: string
  rpcUrl: string
  chainId: string
  explorerUrl: string
  nativeAssetSymbol: string
}

const NetworkDetails = ({
  name,
  iconUrl,
  rpcUrl,
  chainId,
  explorerUrl,
  nativeAssetSymbol
}: Props) => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { pathname } = useRoute()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const isEmpty = useMemo(
    () => [name, rpcUrl, chainId].some((p) => p === '-'),
    [chainId, name, rpcUrl]
  )

  const shouldDisplayEditButton = useMemo(
    () => pathname?.includes(ROUTES.networksSettings) && !isEmpty,
    [pathname, isEmpty]
  )

  const renderInfoItem = useCallback(
    (title: string, value: string, withBottomSpacing = true) => {
      return (
        <View
          style={[flexbox.directionRow, flexbox.alignCenter, !!withBottomSpacing && spacings.mb]}
        >
          <Text
            fontSize={14}
            appearance="tertiaryText"
            style={[flexbox.flex1, spacings.mr]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            {title === 'Network Name' && value !== '-' && (
              <View style={spacings.mrMi}>
                <ManifestImage
                  uri={iconUrl || ''}
                  size={32}
                  fallback={() => <NetworkIcon size={32} name={name.toLowerCase() as any} />}
                />
              </View>
            )}
            <Text
              fontSize={14}
              appearance={value === 'Invalid Chain ID' ? 'errorText' : 'primaryText'}
            >
              {value}
            </Text>
          </View>
        </View>
      )
    },
    [name, iconUrl]
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
          <Text fontSize={18} weight="medium" style={flexbox.flex1}>
            {t('Network details')}
          </Text>
          {!!shouldDisplayEditButton && (
            <Button
              style={{ maxHeight: 32 }}
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
        </View>
        <View style={flexbox.flex1}>
          {renderInfoItem(t('Network Name'), name)}
          {renderInfoItem(t('RPC URL'), rpcUrl)}
          {renderInfoItem(t('Chain ID'), chainId)}
          {renderInfoItem(t('Currency Symbol'), nativeAssetSymbol)}
          {renderInfoItem(t('Block Explorer URL'), explorerUrl, false)}
        </View>
      </View>
      <BottomSheet
        id="edit-network-bottom-sheet"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        backgroundColor="primaryBackground"
        style={{ ...spacings.ph0, ...spacings.pv0, overflow: 'hidden' }}
      >
        <NetworkForm selectedNetworkId={name.toLowerCase()} onSaved={closeBottomSheet} />
      </BottomSheet>
    </>
  )
}

export default React.memo(NetworkDetails)
