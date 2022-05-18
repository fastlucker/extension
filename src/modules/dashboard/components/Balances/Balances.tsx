import networks from 'ambire-common/src/constants/networks'
import React, { useLayoutEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'

import ReceiveIcon from '@assets/svg/ReceiveIcon'
import SendIcon from '@assets/svg/SendIcon'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import NetworkIcon from '@modules/common/components/NetworkIcon'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import { triggerLayoutAnimation } from '@modules/common/services/layoutAnimation'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

import Rewards from '../Rewards'
import styles from './styles'

const networkDetails = (network: any) => networks.find(({ id }) => id === network)

const Balances = () => {
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const { balance, isBalanceLoading, otherBalances } = usePortfolio()
  const { network: selectedNetwork, setNetwork } = useNetwork()

  useLayoutEffect(() => {
    triggerLayoutAnimation()
  }, [isBalanceLoading])

  useLayoutEffect(() => {
    triggerLayoutAnimation()
  }, [selectedNetwork])

  const otherPositiveBalances = otherBalances
    .filter(({ network, total }: any) => network !== selectedNetwork?.id && total.full > 0)
    // Exclude displaying balances for networks we don't support
    .filter(({ network }) => !!networkDetails(network))

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
            const { chainId, name, id }: any = networkDetails(network)
            const isLast = i + 1 === otherPositiveBalances.length

            const onNetworkChange = () => {
              triggerLayoutAnimation()
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
                <NetworkIcon name={id} width={24} height={24} />
                <Text numberOfLines={1}>{` ${name}`}</Text>
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

export default React.memo(Balances)
