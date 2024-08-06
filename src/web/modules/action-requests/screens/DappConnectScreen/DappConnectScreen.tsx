/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import { DappRequestAction } from '@ambire-common/controllers/actions/actions'
import InfoIcon from '@common/assets/svg/InfoIcon'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import ExpandableCard from '@common/components/ExpandableCard'
import Label from '@common/components/Label'
import Text from '@common/components/Text'
import { Trans, useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import ManifestImage from '@web/components/ManifestImage'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import ActionFooter from '@web/modules/action-requests/components/ActionFooter'

// Screen for dApps authorization to connect to extension - will be triggered on dApp connect request
const DappConnectScreen = () => {
  const { t } = useTranslation()
  const [isAuthorizing, setIsAuthorizing] = useState(false)

  const { dispatch } = useBackgroundService()
  const state = useActionsControllerState()

  const dappAction = useMemo(() => {
    if (state.currentAction?.type !== 'dappRequest') return undefined

    return state.currentAction as DappRequestAction
  }, [state.currentAction])

  const userRequest = useMemo(() => {
    if (!dappAction) return undefined
    if (dappAction.userRequest.action.kind !== 'dappConnect') return undefined

    return dappAction.userRequest
  }, [dappAction])

  const handleDenyButtonPress = useCallback(() => {
    if (!dappAction) return

    dispatch({
      type: 'MAIN_CONTROLLER_REJECT_USER_REQUEST',
      params: { err: t('User rejected the request.'), id: dappAction.id }
    })
  }, [dappAction, t, dispatch])

  const handleAuthorizeButtonPress = useCallback(() => {
    if (!dappAction) return

    setIsAuthorizing(true)
    dispatch({
      type: 'MAIN_CONTROLLER_RESOLVE_USER_REQUEST',
      params: { data: null, id: dappAction.id }
    })
  }, [dappAction, dispatch])

  return (
    <TabLayoutContainer
      width="full"
      header={<HeaderAccountAndNetworkInfo />}
      footer={
        <ActionFooter
          onReject={handleDenyButtonPress}
          onResolve={handleAuthorizeButtonPress}
          resolveButtonText={isAuthorizing ? t('Connecting...') : t('Connect')}
          resolveDisabled={isAuthorizing}
          resolveButtonTestID="dapp-connect-button"
        />
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mbLg}>
        <Text weight="medium" fontSize={20} style={[spacings.mbXl, textStyles.center]}>
          {t('Connection requested')}
        </Text>
        <View style={[spacings.pvSm, flexbox.alignCenter]}>
          <ManifestImage
            uri={userRequest?.session?.icon}
            size={50}
            fallback={() => <ManifestFallbackIcon width={50} height={50} />}
          />
        </View>

        <Text
          style={[textStyles.center, spacings.phSm, spacings.mb]}
          fontSize={20}
          appearance="secondaryText"
          weight="semiBold"
        >
          {userRequest?.session.origin ? new URL(userRequest.session.origin).hostname : ''}
        </Text>

        <View style={flexbox.alignCenter}>
          <Trans>
            <Text style={[textStyles.center, spacings.phSm, spacings.mbLg, { maxWidth: 520 }]}>
              <Text fontSize={16} weight="medium">
                {'The dApp '}
              </Text>
              <Text fontSize={16} weight="medium" appearance="primary">
                {userRequest?.session?.name || 'Unknown dApp'}
              </Text>
              <Text fontSize={16} weight="medium">
                {' is requesting an authorization to communicate with Ambire Wallet'}
              </Text>
            </Text>
          </Trans>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbLg]}>
            <InfoIcon width={20} height={20} color={iconColors.primary} style={spacings.mrTy} />
            <Text
              fontSize={14}
              style={textStyles.center}
              weight="medium"
              appearance="secondaryText"
            >
              {t('Webpage can be disconnected any time from the Ambire extension settings.')}
            </Text>
          </View>
        </View>
        <ExpandableCard
          enableExpand={false}
          hasArrow={false}
          content={
            <View
              style={[
                flexbox.flex1,
                flexbox.directionRow,
                flexbox.alignCenter,
                flexbox.wrap,
                spacings.mhSm
              ]}
            >
              <Trans>
                <Text fontSize={16} weight="semiBold" appearance="successText">
                  {'Allow'}{' '}
                </Text>
                <ManifestImage
                  uri={userRequest?.session?.icon}
                  size={24}
                  fallback={() => <ManifestFallbackIcon />}
                />
                <Text fontSize={16} weight="semiBold">
                  {' '}
                  {userRequest?.session?.name}{' '}
                </Text>
                <Text fontSize={16} weight="medium" appearance="secondaryText">
                  to{' '}
                </Text>
                <Text fontSize={16} weight="semiBold">
                  see your address{' '}
                </Text>
                <Text fontSize={16} weight="medium" appearance="secondaryText">
                  and{' '}
                </Text>
                <Text fontSize={16} weight="semiBold">
                  propose transactions{' '}
                </Text>
                <Text fontSize={16} weight="medium" appearance="secondaryText">
                  for your review and confirmation.
                </Text>
              </Trans>
            </View>
          }
        >
          <View style={spacings.phLg}>
            <Label text={t('Only connect with sites you trust.')} type="warning" />
          </View>
        </ExpandableCard>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(DappConnectScreen)
