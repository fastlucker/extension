import networks, { NetworkId } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React, { useLayoutEffect, useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import GasTankIcon from '@assets/svg/GasTankIcon'
import PrivacyIcon from '@assets/svg/PrivacyIcon'
import ReceiveIcon from '@assets/svg/ReceiveIcon'
import SendIcon from '@assets/svg/SendIcon'
import CONFIG from '@config/env'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import NetworkIcon from '@modules/common/components/NetworkIcon'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import useCacheBreak from '@modules/common/hooks/useCacheBreak'
import usePrivateMode from '@modules/common/hooks/usePrivateMode'
import useRelayerData from '@modules/common/hooks/useRelayerData'
import { triggerLayoutAnimation } from '@modules/common/services/layoutAnimation'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

import Rewards from '../Rewards'
import styles from './styles'

const networkDetails = (network: any) => networks.find(({ id }) => id === network)

interface Props {
  balanceTruncated: any
  balanceDecimals: any
  otherBalances: UsePortfolioReturnType['otherBalances']
  isLoading: boolean
  networkId: NetworkId
  account: UseAccountsReturnType['selectedAcc']
  setNetwork: (networkIdentifier: string | number) => void
}

const relayerURL = CONFIG.RELAYER_URL

const Balances = ({
  balanceTruncated,
  balanceDecimals,
  otherBalances,
  isLoading,
  networkId,
  account,
  setNetwork
}: Props) => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { isPrivateMode, togglePrivateMode, hidePrivateValue } = usePrivateMode()
  const { cacheBreak } = useCacheBreak({})
  const urlGetBalance = relayerURL
    ? `${relayerURL}/gas-tank/${account}/getBalance?cacheBreak=${cacheBreak}`
    : null

  const { data } = useRelayerData(urlGetBalance)

  const balanceLabel = useMemo(
    () =>
      !data
        ? '0.00'
        : data
            .map(({ balanceInUSD }: any) => balanceInUSD)
            .reduce((a: any, b: any) => a + b, 0)
            .toFixed(2),
    [data]
  )

  useLayoutEffect(() => {
    triggerLayoutAnimation()
  }, [isLoading])

  useLayoutEffect(() => {
    triggerLayoutAnimation()
  }, [networkId])

  const otherPositiveBalances = otherBalances
    .filter(({ network, total }: any) => network !== networkId && total.full > 0)
    // Exclude displaying balances for networks we don't support
    .filter(({ network }) => !!networkDetails(network))

  const handleGoToSend = () => navigation.navigate('send')
  const handleGoToReceive = () => navigation.navigate('receive')
  const handleGoToGasTank = () => navigation.navigate('gas-tank')
  const content = (
    <>
      <View style={flexboxStyles.directionRow}>
        <View
          style={[
            flexboxStyles.flex1,
            flexboxStyles.alignEnd,
            flexboxStyles.justifyCenter,
            spacings.mbTy
          ]}
        >
          <TouchableOpacity
            style={spacings.mrSm}
            onPress={togglePrivateMode}
            hitSlop={{ top: 10, bottom: 10, left: 2, right: 2 }}
          >
            <PrivacyIcon isActive={isPrivateMode} />
          </TouchableOpacity>
        </View>
        <Rewards />
        <View style={flexboxStyles.flex1} />
      </View>

      <Text fontSize={42} weight="regular" style={spacings.mbTy}>
        <Text fontSize={26} weight="regular" style={[textStyles.highlightSecondary]}>
          ${' '}
        </Text>
        {isPrivateMode ? (
          <>
            <Text fontSize={42} weight="regular">
              **
            </Text>
            <Text fontSize={26} weight="regular">
              .**
            </Text>
          </>
        ) : (
          <>
            <Text fontSize={42} weight="regular">
              {balanceTruncated}
            </Text>
            <Text fontSize={26} weight="regular">
              .{balanceDecimals}
            </Text>
          </>
        )}
      </Text>

      <View style={[flexboxStyles.directionRow, spacings.mb]}>
        <Button
          style={styles.button}
          textStyle={[{ color: colors.titan }, flexboxStyles.alignSelfCenter]}
          type="secondary"
          hasBottomSpacing={false}
          onPress={handleGoToSend}
        >
          <View style={[flexboxStyles.directionRow, flexboxStyles.center]}>
            <Text
              style={[textStyles.center, flexboxStyles.flex1, flexboxStyles.center, spacings.mlTy]}
            >
              {t('Send')}
            </Text>
            <SendIcon width={22} height={22} style={styles.buttonIcon} />
          </View>
        </Button>
        <Button
          style={styles.button}
          textStyle={[{ color: colors.titan }, flexboxStyles.alignSelfCenter]}
          type="secondary"
          hasBottomSpacing={false}
          onPress={handleGoToReceive}
        >
          <View style={[flexboxStyles.directionRow, flexboxStyles.center]}>
            <Text
              style={[textStyles.center, flexboxStyles.flex1, flexboxStyles.center, spacings.mlMi]}
            >
              {t('Receive')}
            </Text>
            <ReceiveIcon width={22} height={22} style={styles.buttonIcon} />
          </View>
        </Button>
      </View>

      {otherPositiveBalances.length > 0 && (
        <View style={spacings.mb}>
          <Text style={[textStyles.center, spacings.mbTy]}>{t('You also have')}</Text>
          {otherPositiveBalances.map(({ network, total }: any) => {
            const { chainId, name, id }: any = networkDetails(network)

            const onNetworkChange = () => {
              triggerLayoutAnimation()
              setNetwork(network)
            }

            return (
              <TouchableOpacity
                key={chainId}
                onPress={onNetworkChange}
                style={styles.otherBalancesContainer}
              >
                <Text numberOfLines={1} style={flexboxStyles.flex1}>
                  <Text style={textStyles.highlightSecondary}>{'$ '}</Text>
                  {hidePrivateValue(`${total.truncated}.${total.decimals}`)}
                </Text>
                <Text>{` ${t('on')} `}</Text>
                <NetworkIcon name={id} width={24} height={24} />
                <Text numberOfLines={1}>{` ${name}`}</Text>
              </TouchableOpacity>
            )
          })}
          <TouchableOpacity
            onPress={handleGoToGasTank}
            style={[styles.otherBalancesContainer, { borderBottomWidth: 0 }]}
          >
            {!!data && (
              <Text numberOfLines={1} style={flexboxStyles.flex1}>
                <Text style={textStyles.highlightSecondary}>{'$ '}</Text>
                {balanceLabel}
              </Text>
            )}
            <GasTankIcon />
            <Text numberOfLines={1}>{t('Gas Tank Balance')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  )

  return (
    <View style={flexboxStyles.alignCenter}>
      {isLoading ? (
        <View style={[styles.loadingContainer, flexboxStyles.center]}>
          <Spinner />
        </View>
      ) : (
        content
      )}
    </View>
  )
}

export default React.memo(Balances)
