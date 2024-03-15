/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import EditPenIcon from '@common/assets/svg/EditPenIcon'
import Button from '@common/components/Button'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import ManifestImage from '@web/components/ManifestImage'

import getStyles from './styles'

type Props = {
  name: string
  iconUrl?: string
  rpcUrl: string
  chainId: string
  explorerUrl: string
  nativeAssetSymbol: string
  handleEditButtonPress?: () => void
}

const NetworkDetails = ({
  name,
  iconUrl,
  rpcUrl,
  chainId,
  explorerUrl,
  nativeAssetSymbol,
  handleEditButtonPress
}: Props) => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { pathname } = useRoute()

  const shouldDisplayEditButton = useMemo(
    () => pathname?.includes(ROUTES.networksSettings),
    [pathname]
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
            {title === 'Network Name' && (
              <View style={spacings.mrMi}>
                <ManifestImage
                  uri={iconUrl || ''}
                  size={32}
                  fallback={() => <NetworkIcon size={32} name={name as any} />}
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
            onPress={() => {
              !!handleEditButtonPress && handleEditButtonPress()
            }}
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
  )
}

export default React.memo(NetworkDetails)
