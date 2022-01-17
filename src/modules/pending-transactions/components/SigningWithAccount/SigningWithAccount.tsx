import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import Blockies from '@modules/common/components/Blockies'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

const SigningWithAccount = () => {
  const { t } = useTranslation()
  const { account } = useAccounts()
  const { network } = useNetwork()
  const Icon: any = network?.Icon
  return (
    <Panel>
      <View style={[flexboxStyles.directionRow, flexboxStyles.center, spacings.mb]}>
        <MaterialCommunityIcons
          style={spacings.mrTy}
          name="account-circle-outline"
          size={22}
          color={colors.primaryAccentColor}
        />
        <Title hasBottomSpacing={false} color={colors.primaryAccentColor}>
          {t('Signing with account')}
        </Title>
      </View>
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mbTy]}>
        <Blockies seed={account.id} size={7.5} />
        <View style={flexboxStyles.flex1}>
          <Text style={[spacings.plTy, textStyles.bold]} fontSize={15}>
            {account.id}
          </Text>
        </View>
      </View>
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        {!!account.id && <Text>{' on '}</Text>}
        <Icon width={25} />
        <Text style={textStyles.bold}>{` ${network?.name}`}</Text>
      </View>
    </Panel>
  )
}

export default SigningWithAccount
