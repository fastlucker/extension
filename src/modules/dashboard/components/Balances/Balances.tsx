import React from 'react'
import { ActivityIndicator, Button, View } from 'react-native'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import networks from '@modules/common/constants/networks'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const Balances = () => {
  const { t } = useTranslation()
  const { balance, isBalanceLoading, otherBalances } = usePortfolio()
  const { network: selectedNetwork, setNetwork } = useNetwork()
  const otherBalancesPresent = otherBalances.filter(
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

      {otherBalancesPresent.length > 0 && (
        <Text style={[styles.otherBalancesContainer, styles.otherBalancesText]}>
          {t('You also have')}{' '}
          {otherBalancesPresent.map(({ network, total }, i) => (
            <Text
              key={network}
              style={styles.otherBalancesText}
              onPress={() => setNetwork(network)}
            >
              <Text style={[textStyles.highlightSecondary, styles.otherBalancesText]}>$</Text>{' '}
              {total.truncated}
              <Text style={[textStyles.highlightSecondary, styles.otherBalancesText]}>
                .{total.decimals}
              </Text>
              {` ${t('on')} `}
              {/* TODO: */}
              {/* <div className="icon" style={{backgroundImage: `url(${networkDetails(network).icon})`}}></div> */}
              {networkDetails(network).name}
              {otherBalancesPresent.length - 1 !== i && ` ${t('and')} `}
            </Text>
          ))}
        </Text>
      )}
    </Panel>
  )
}

export default Balances
