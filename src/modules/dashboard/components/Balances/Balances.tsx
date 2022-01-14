import React from 'react'
import { ActivityIndicator, LayoutAnimation, View } from 'react-native'

import { useTranslation } from '@config/localization'
import PolygonLogo from '@modules/common/assets/svg/networks/PolygonLogo'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import networks from '@modules/common/constants/networks'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const Balances = () => {
  const { t } = useTranslation()
  const { balance, isBalanceLoading, otherBalances } = usePortfolio()
  const { network: selectedNetwork, setNetwork } = useNetwork()
  const otherPositiveBalances = otherBalances.filter(
    ({ network, total }) => network !== selectedNetwork?.id && total.full > 0
  )
  const networkDetails = (network) => networks.find(({ id }) => id === network)

  return (
    <Panel>
      <Title>{t('Balance')}</Title>
      <Text style={styles.text}>
        <Text style={[textStyles.highlightPrimary, styles.text]}>$</Text>{' '}
        {isBalanceLoading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <>
            {balance.total?.truncated}
            <Text style={[textStyles.highlightPrimary, styles.text]}>
              .{balance.total?.decimals}
            </Text>
          </>
        )}
      </Text>

      {otherPositiveBalances.length > 0 && (
        <View style={styles.otherBalancesContainer}>
          <Text style={styles.otherBalancesText}>{t('You also have')} </Text>
          {otherPositiveBalances.map(({ network, total }, i: number) => {
            const { name, Icon } = networkDetails(network)
            const hasOneMore = otherPositiveBalances.length - 1 !== i
            const onNetworkChange = () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
              setNetwork(network)
            }

            return (
              <Text>
                <Text key={network} style={styles.otherBalancesText} onPress={onNetworkChange}>
                  <Text style={[textStyles.highlightSecondary, styles.otherBalancesText]}>
                    {'$ '}
                  </Text>
                  {total.truncated}
                  <Text style={[textStyles.highlightSecondary, styles.otherBalancesText]}>
                    .{total.decimals}{' '}
                  </Text>
                  <Text style={styles.otherBalancesText}>{`${t('on')} `}</Text>
                  <Icon width={25} />
                  <Text
                    style={[styles.otherBalancesText, styles.otherBalancesTextHighlight]}
                  >{` ${name} `}</Text>
                </Text>

                {hasOneMore && <Text style={styles.otherBalancesText}>{`${t('and')} `}</Text>}
              </Text>
            )
          })}
        </View>
      )}
    </Panel>
  )
}

export default Balances
