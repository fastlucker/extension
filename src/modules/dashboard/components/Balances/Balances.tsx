import React from 'react'
import { ActivityIndicator, LayoutAnimation, TouchableOpacity, View } from 'react-native'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import networks from '@modules/common/constants/networks'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
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
  const otherPositiveBalances = otherBalances.filter(
    ({ network, total }: any) => network !== selectedNetwork?.id && total.full > 0
  )
  const networkDetails = (network: any) => networks.find(({ id }) => id === network)

  const handleGoToSend = () => navigation.navigate('send')
  const handleGoToReceive = () => navigation.navigate('receive')

  return (
    <View style={[spacings.mb, flexboxStyles.alignCenter]}>
      <Rewards />

      <Text fontSize={42} weight="regular">
        <Text fontSize={26} weight="regular" style={[textStyles.highlightSecondary]}>
          ${' '}
        </Text>
        {isBalanceLoading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <>
            {balance.total?.truncated}
            <Text fontSize={26} weight="regular">
              .{balance.total?.decimals}
            </Text>
          </>
        )}
      </Text>

      <TouchableOpacity onPress={handleGoToSend}>
        <Text fontSize={14} style={textStyles.bold}>
          {t('Send')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGoToReceive}>
        <Text fontSize={14} style={textStyles.bold}>
          {t('Receive')}
        </Text>
      </TouchableOpacity>

      {otherPositiveBalances.length > 0 && (
        <View style={styles.otherBalancesContainer}>
          <Text fontSize={20}>{t('You also have')} </Text>
          {otherPositiveBalances.map(({ network, total }: any, i: number) => {
            const { chainId, name, Icon }: any = networkDetails(network)
            const hasOneMore = otherPositiveBalances.length - 1 !== i
            const onNetworkChange = () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
              setNetwork(network)
            }

            return (
              <Text key={chainId}>
                <Text key={network} fontSize={20} onPress={onNetworkChange}>
                  <Text fontSize={20} style={textStyles.highlightSecondary}>
                    {'$ '}
                  </Text>
                  {total.truncated}
                  <Text fontSize={20} style={textStyles.highlightSecondary}>
                    .{total.decimals}{' '}
                  </Text>
                  <Text fontSize={20}>{`${t('on')} `}</Text>
                  <Icon width={25} />
                  <Text fontSize={20} style={styles.otherBalancesTextHighlight}>{` ${name} `}</Text>
                </Text>

                {hasOneMore && <Text fontSize={20}>{`${t('and')} `}</Text>}
              </Text>
            )
          })}
        </View>
      )}
    </View>
  )
}

export default Balances
