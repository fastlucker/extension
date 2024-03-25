import React, { useMemo } from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import Alert from '@common/components/Alert'
import CoingeckoConfirmedBadge from '@common/components/CoingeckoConfirmedBadge'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import getTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { TokenData } from '@web/modules/notification-requests/screens/WatchTokenRequestScreen/WatchTokenRequestScreen'

const Token = ({
  portfolioFoundToken,
  tokenData,
  tokenNetwork,
  isLoading
}: {
  portfolioFoundToken: TokenResult
  tokenData: TokenData | CustomToken | undefined
  tokenNetwork: NetworkDescriptor | undefined
  isLoading: boolean
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const tokenDetails = useMemo(
    () =>
      portfolioFoundToken &&
      portfolioFoundToken?.flags &&
      getTokenDetails(portfolioFoundToken as TokenResult),
    [portfolioFoundToken]
  )

  if (!tokenNetwork?.id) return

  return (
    <>
      <View
        style={[
          flexbox.directionRow,
          flexbox.justifySpaceBetween,
          spacings.phTy,
          spacings.pvTy,
          spacings.mbTy,
          !portfolioFoundToken || !portfolioFoundToken?.priceIn?.length
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
              uri={tokenData?.image}
              networkId={tokenNetwork?.id}
              containerHeight={40}
              containerWidth={40}
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

        <View
          style={[flexbox.alignEnd, { flex: portfolioFoundToken?.priceIn?.length ? 0.7 : 0.12 }]}
        >
          <View style={[flexbox.directionRow, flexbox.alignEnd]}>
            <Text weight="number_bold" fontSize={16} style={flexbox.justifyEnd}>
              {tokenDetails?.balanceUSDFormatted || '-'}
            </Text>
          </View>
        </View>
        {portfolioFoundToken?.priceIn?.length ? (
          <View style={[flexbox.alignEnd, { flex: 0.5 }]}>
            <CoingeckoConfirmedBadge
              text={t('Confirmed')}
              address={tokenData?.address}
              networkId={tokenNetwork?.id}
            />
          </View>
        ) : null}
      </View>

      {!portfolioFoundToken?.priceIn?.length && !isLoading ? (
        <Alert type="warning" title={t('This token is not listed in Coingecko.')} />
      ) : null}
    </>
  )
}

export default React.memo(Token)
