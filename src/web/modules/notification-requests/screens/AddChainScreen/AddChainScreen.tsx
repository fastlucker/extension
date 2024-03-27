/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { NetworkFeature } from '@ambire-common/interfaces/networkDescriptor'
import { CustomNetwork } from '@ambire-common/interfaces/settings'
import { getFeatures } from '@ambire-common/libs/settings/settings'
import CloseIcon from '@common/assets/svg/CloseIcon'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import Alert from '@common/components/Alert'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import ManifestImage from '@web/components/ManifestImage'
import NetworkAvailableFeatures from '@web/components/NetworkAvailableFeatures'
import NetworkDetails from '@web/components/NetworkDetails'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import validateRequestParams from '@web/modules/notification-requests/screens/AddChainScreen/validateRequestParams'

import getStyles from './styles'

const AddChainScreen = () => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { currentNotificationRequest } = useNotificationControllerState()
  const [areParamsValid, setAreParamsValid] = useState<boolean>(false)
  const { maxWidthSize } = useWindowSize()
  const { status, latestMethodCall, networkToAddOrUpdate } = useSettingsControllerState()
  const [features, setFeatures] = useState<NetworkFeature[]>(getFeatures(undefined))
  const [rpcUrlIndex, setRpcUrlIndex] = useState<number>(0)

  const requestData = useMemo(
    () => currentNotificationRequest?.params?.data?.[0],
    [currentNotificationRequest?.params?.data]
  )

  const requestMethod = useMemo(
    () => currentNotificationRequest?.params?.method,
    [currentNotificationRequest?.params?.method]
  )

  const requestSession = useMemo(
    () => currentNotificationRequest?.params?.session,
    [currentNotificationRequest?.params?.session]
  )

  useEffect(() => {
    setAreParamsValid(validateRequestParams(requestMethod, requestData))
  }, [requestMethod, requestData])

  const rpcUrls: string[] = useMemo(() => {
    if (!requestData || !requestData?.rpcUrls) return []

    return requestData.rpcUrls.filter((url: string) => url.startsWith('http'))
  }, [requestData])

  const networkDetails: CustomNetwork | undefined = useMemo(() => {
    if (!areParamsValid || !requestData) return undefined
    if (!requestData.rpcUrls) return
    const name = requestData.chainName
    const nativeAssetSymbol = requestData.nativeCurrency?.symbol

    try {
      return {
        name,
        rpcUrls,
        chainId: BigInt(requestData.chainId),
        nativeAssetSymbol,
        explorerUrl: requestData.blockExplorerUrls?.[0],
        iconUrls: requestData.iconUrls || []
      } as CustomNetwork
    } catch (error) {
      console.error(error)
      return undefined
    }
  }, [areParamsValid, rpcUrls, requestData])

  useEffect(() => {
    if (networkDetails && networkDetails.rpcUrls) {
      dispatch({
        type: 'SETTINGS_CONTROLLER_SET_NETWORK_TO_ADD_OR_UPDATE',
        params: { chainId: networkDetails.chainId, rpcUrls: networkDetails.rpcUrls }
      })
    }
  }, [dispatch, networkDetails])

  useEffect(() => {
    setFeatures(getFeatures(networkToAddOrUpdate?.info))
  }, [networkToAddOrUpdate?.info])

  useEffect(() => {
    if (latestMethodCall === 'addCustomNetwork' && status === 'SUCCESS') {
      dispatch({ type: 'NOTIFICATION_CONTROLLER_RESOLVE_REQUEST', params: { data: null } })
    }
  }, [dispatch, latestMethodCall, status])

  const handleDenyButtonPress = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }, [t, dispatch])

  const handleAddNetworkButtonPress = useCallback(() => {
    if (!networkDetails) return
    dispatch({
      type: 'MAIN_CONTROLLER_ADD_CUSTOM_NETWORK',
      params: networkDetails
    })
  }, [dispatch, networkDetails])

  const handleRetryWithDifferentRpcUrl = useCallback(() => {
    setRpcUrlIndex((prev) => prev + 1)
  }, [])

  return (
    <TabLayoutContainer
      width="full"
      header={<HeaderAccountAndNetworkInfo />}
      footer={
        <>
          <Button
            text={t('Deny')}
            type="danger"
            hasBottomSpacing={false}
            size="large"
            onPress={handleDenyButtonPress}
          >
            <View style={spacings.pl}>
              <CloseIcon color={theme.errorDecorative} />
            </View>
          </Button>
          <Button
            text={
              latestMethodCall === 'addCustomNetwork' && status === 'LOADING'
                ? t('Adding network...')
                : t('Add network')
            }
            disabled={
              !areParamsValid ||
              (latestMethodCall === 'addCustomNetwork' && status === 'LOADING') ||
              (features &&
                (features.some((f) => f.level === 'loading') ||
                  !!features.filter((f) => f.id === 'flagged')[0]))
            }
            type="primary"
            size="large"
            hasBottomSpacing={false}
            onPress={handleAddNetworkButtonPress}
          />
        </>
      }
    >
      <TabLayoutWrapperMainContent
        style={spacings.mbLg}
        contentContainerStyle={[spacings.pvXl, { flexGrow: 1 }]}
      >
        <Text weight="medium" fontSize={20}>
          {t('Add new network')}
        </Text>

        <View style={styles.dappInfoContainer}>
          <View style={spacings.mbSm}>
            <ManifestImage
              uri={requestSession?.icon}
              size={50}
              fallback={() => <ManifestFallbackIcon />}
            />
          </View>
          <View style={styles.dappInfoContent}>
            <View style={[flexbox.flex1, spacings.phLg]}>
              <Trans values={{ name: requestSession?.name || 'The dApp' }}>
                <Text style={text.center}>
                  <Text fontSize={20} appearance="secondaryText">
                    {t('Allow ')}
                  </Text>
                  <Text fontSize={20} weight="semiBold">
                    {'{{name}} '}
                  </Text>
                  <Text fontSize={20} appearance="secondaryText">
                    {t('to add a network')}
                  </Text>
                </Text>
              </Trans>
            </View>
          </View>
        </View>
        {!!areParamsValid && !!networkDetails && (
          <View style={[flexbox.directionRow]}>
            <View style={flexbox.flex1}>
              <NetworkDetails
                name={currentNotificationRequest?.params?.data?.[0]?.chainName}
                iconUrls={networkDetails?.iconUrls || []}
                chainId={Number(networkDetails.chainId).toString()}
                rpcUrls={networkDetails.rpcUrls}
                nativeAssetSymbol={networkDetails.nativeAssetSymbol}
                explorerUrl={networkDetails.explorerUrl}
              />
            </View>
            <View style={[styles.separator, maxWidthSize('xl') ? spacings.mh3Xl : spacings.mhXl]} />
            <View style={flexbox.flex1}>
              <View style={spacings.mb}>
                <Text fontSize={16} weight="semiBold" appearance="secondaryText">
                  {t('Ambire Wallet does not verify custom networks.')}
                </Text>
                <Text>
                  <Text fontSize={14} appearance="secondaryText">
                    {t('Learn about ')}
                  </Text>
                  <Text
                    underline
                    fontSize={14}
                    color={theme.primaryLight}
                    onPress={() =>
                      openInTab('https://help.ambire.com/hc/en-us/articles/13079237341596', false)
                    }
                  >
                    {t('scams and networks security risks')}
                  </Text>
                  <Text fontSize={14} appearance="secondaryText">
                    {t('.')}
                  </Text>
                </Text>
              </View>
              {!!networkDetails && (
                <NetworkAvailableFeatures
                  features={features}
                  networkId={networkDetails.name.toLowerCase()}
                  withRetryButton={!!rpcUrls.length && rpcUrlIndex < rpcUrls.length - 1}
                  handleRetry={handleRetryWithDifferentRpcUrl}
                />
              )}
            </View>
          </View>
        )}
        {(!areParamsValid || !networkDetails) && (
          <View style={[flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}>
            <Alert
              title={t('Invalid Request Params')}
              text={t(
                `${
                  currentNotificationRequest?.params?.session?.name || 'The dApp'
                } provided invalid params for adding a new network.`
              )}
              type="error"
            />
          </View>
        )}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(AddChainScreen)
