import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Blockies from '@common/components/Blockies'
import NetworkIcon from '@common/components/NetworkIcon'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import useAccounts from '@common/hooks/useAccounts'
import useNetwork from '@common/hooks/useNetwork'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

import styles from './styles'

const SigningWithAccount = () => {
  const { t } = useTranslation()
  const { account } = useAccounts()
  const { network } = useNetwork()

  return (
    <Panel>
      <Title style={textStyles.center} type="small">
        {t('Signing with account')}
      </Title>

      <View style={styles.itemContainer}>
        <Blockies seed={account.id} />
        <View style={[flexboxStyles.flex1, spacings.plTy]}>
          <Text fontSize={12} numberOfLines={1} ellipsizeMode="middle">
            {account.id}
          </Text>
          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
            {!!account.id && (
              <Text fontSize={10} color={colors.titan_50}>
                {t('on')}
              </Text>
            )}
            <NetworkIcon name={network?.id} width={18} height={18} />
            <Text fontSize={10} color={colors.titan_50}>{`${network?.name}`}</Text>
          </View>
        </View>
      </View>
    </Panel>
  )
}

export default React.memo(SigningWithAccount)
