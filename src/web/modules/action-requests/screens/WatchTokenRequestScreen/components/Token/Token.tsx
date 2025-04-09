import React, { useMemo } from 'react'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { TokenResult } from '@ambire-common/libs/portfolio'
import Alert from '@common/components/Alert'
import CoingeckoConfirmedBadge from '@common/components/CoingeckoConfirmedBadge'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import TokenIcon from '@common/components/TokenIcon'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import getAndFormatTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import { TokenData } from '@web/modules/action-requests/screens/WatchTokenRequestScreen/WatchTokenRequestScreen'

const Token = ({
  temporaryToken,
  tokenData,
  tokenNetwork,
  isLoading,
  showAlreadyInPortfolioMessage
}: {
  temporaryToken?: TokenResult
  tokenData: TokenData
  tokenNetwork: Network | undefined
  isLoading: boolean
  showAlreadyInPortfolioMessage: boolean
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { networks } = useNetworksControllerState()
  const tokenDetails = useMemo(
    () =>
      temporaryToken &&
      temporaryToken?.flags &&
      getAndFormatTokenDetails(temporaryToken as TokenResult, networks),
    [temporaryToken, networks]
  )

  if (!tokenNetwork?.chainId) return null

  return (
    <>
      <View
        style={[
          flexbox.directionRow,
          flexbox.justifySpaceBetween,
          spacings.phTy,
          spacings.pvTy,
          spacings.mbTy,
          !temporaryToken || !temporaryToken?.priceIn?.length
            ? {
                borderWidth: 1,
                borderColor: theme.warningDecorative,
                borderRadius: BORDER_RADIUS_PRIMARY
              }
            : {}
        ]}
      >
        <View style={[flexbox.flex1]}>
          <View style={[flexbox.directionRow]}>
            <TokenIcon
              withContainer
              chainId={tokenNetwork?.chainId}
              containerHeight={40}
              containerWidth={40}
              address={tokenData?.address}
              width={28}
              height={28}
            />
            <View style={spacings.ml}>
              <Text weight="number_bold" fontSize={16}>
                {tokenDetails?.balance || '0.00'} {tokenData?.symbol}
              </Text>

              {tokenNetwork && (
                <Text fontSize={12}>
                  {t('on')} {tokenNetwork.name}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={{ flex: 0.7 }}>
          <Text fontSize={16} style={{ textAlign: 'left' }}>
            {isLoading ? (
              <View style={[flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}>
                <Spinner style={{ width: 18, height: 18 }} />
              </View>
            ) : (
              tokenDetails?.priceUSDFormatted
            )}
          </Text>
        </View>

        <View style={[flexbox.alignEnd, { flex: temporaryToken?.priceIn?.length ? 0.7 : 0.12 }]}>
          <View style={[flexbox.directionRow, flexbox.alignEnd]}>
            <Text weight="number_bold" fontSize={16} style={flexbox.justifyEnd}>
              {tokenDetails?.balanceUSDFormatted || '-'}
            </Text>
          </View>
        </View>
        {temporaryToken?.priceIn?.length ? (
          <View style={[flexbox.alignEnd, { flex: 0.5 }]}>
            {tokenData && (
              <CoingeckoConfirmedBadge
                text={t('Confirmed')}
                address={tokenData.address}
                network={tokenNetwork}
              />
            )}
          </View>
        ) : null}
      </View>

      {temporaryToken && !temporaryToken?.priceIn?.length && !isLoading ? (
        <Alert type="warning" title={t('This token is not listed in Coingecko.')} />
      ) : null}

      {!temporaryToken && !isLoading && !showAlreadyInPortfolioMessage ? (
        <Alert type="warning" title={t('Cannot find token data.')} />
      ) : null}
    </>
  )
}

export default React.memo(Token)
