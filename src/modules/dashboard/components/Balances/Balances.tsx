import React from 'react'
import { ActivityIndicator, Button, View } from 'react-native'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const Balances = () => {
  const { t } = useTranslation()
  const { balance, isBalanceLoading } = usePortfolio()

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
    </Panel>
  )
}

export default Balances
