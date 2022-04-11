import React, { useLayoutEffect } from 'react'
import { LayoutAnimation, TouchableOpacity, View } from 'react-native'

import ReceiveIcon from '@assets/svg/ReceiveIcon'
import SendIcon from '@assets/svg/SendIcon'
import { isiOS } from '@config/env'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import networks from '@modules/common/constants/networks'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import usePrevious from '@modules/common/hooks/usePrevious'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

import Rewards from '../Rewards'
import styles from './styles'

const Balances = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { balance, isBalanceLoading, otherBalances } = usePortfolio()
  const { network: selectedNetwork, setNetwork } = useNetwork()
  const prevIsBalanceLoading = usePrevious(isBalanceLoading)

  useLayoutEffect(() => {
    if (!isBalanceLoading && prevIsBalanceLoading) {
      // Restrict this for iOS only, because on Android,
      // the animation executes, but then the whole screen fades away
      // and fades back in in a couple of seconds. Assuming this is a bug
      // in the `LayoutAnimation` module when executed in `useLayoutEffect` or
      // `useEffect` hooks. Blah.
      if (isiOS) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      }
    }
  }, [isBalanceLoading, prevIsBalanceLoading])

  const otherPositiveBalances = otherBalances.filter(
    ({ network, total }: any) => network !== selectedNetwork?.id && total.full > 0
  )
  const networkDetails = (network: any) => networks.find(({ id }) => id === network)

  const handleGoToSend = () => navigation.navigate('send')
  const handleGoToReceive = () => navigation.navigate('receive')

  const content = (
    <>
      <Rewards />

      <Text fontSize={42} weight="regular" style={spacings.mbTy}>
        <Text fontSize={26} weight="regular" style={[textStyles.highlightSecondary]}>
          ${' '}
        </Text>
        {balance.total?.truncated}
        <Text fontSize={26} weight="regular">
          .{balance.total?.decimals}
        </Text>
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
          {otherPositiveBalances.map(({ network, total }: any, i: number) => {
            const { chainId, name, Icon }: any = networkDetails(network)
            const isLast = i + 1 === otherPositiveBalances.length

            const onNetworkChange = () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
              setNetwork(network)
            }

            return (
              <TouchableOpacity
                key={chainId}
                onPress={onNetworkChange}
                style={[styles.otherBalancesContainer, isLast && { borderBottomWidth: 0 }]}
              >
                <Text numberOfLines={1} style={flexboxStyles.flex1}>
                  <Text style={textStyles.highlightSecondary}>{'$ '}</Text>
                  {total.truncated}.{total.decimals}
                </Text>
                <Text>{` ${t('on')} `}</Text>
                <Icon width={24} height={24} />
                <Text numberOfLines={1} style={flexboxStyles.flex1}>{` ${name}`}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </>
  )

  return (
    <View style={flexboxStyles.alignCenter}>
      {isBalanceLoading ? (
        <View style={[styles.loadingContainer, flexboxStyles.center]}>
          <Spinner />
        </View>
      ) : (
        content
      )}
    </View>
  )
}

export default Balances
