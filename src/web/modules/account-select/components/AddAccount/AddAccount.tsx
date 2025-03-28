import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Option from '@common/components/Option'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import useMainControllerState from '@web/hooks/useMainControllerState'
import { useGetAddAccountOptions } from '@web/modules/account-select/components/AddAccount/helpers/useGetAddAccountOptions'

const AddAccount = () => {
  const { t } = useTranslation()

  const options = useGetAddAccountOptions()
  const mainControllerState = useMainControllerState()

  return (
    <View style={spacings.ptSm}>
      <Text fontSize={16} weight="medium" style={spacings.mbLg}>
        {t('Select one of the following options')}
      </Text>
      {options.map((option) => (
        <Option
          key={option.text}
          text={option.text}
          icon={option.icon}
          onPress={option.onPress}
          testID={option.testID}
          disabled={mainControllerState.statuses.onAccountAdderSuccess !== 'INITIAL'}
        />
      ))}
    </View>
  )
}

export default React.memo(AddAccount)
