import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Blockies from '@modules/common/components/Blockies'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const SigningWithAccount = () => {
  const { t } = useTranslation()
  const { account } = useAccounts()
  const { network } = useNetwork()
  const Icon: any = network?.Icon
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
            <Icon width={18} height={18} />
            <Text fontSize={10} color={colors.titan_50}>{`${network?.name}`}</Text>
          </View>
        </View>
      </View>
    </Panel>
  )
}

export default SigningWithAccount
