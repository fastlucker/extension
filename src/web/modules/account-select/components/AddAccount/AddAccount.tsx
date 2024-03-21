import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Option from '@common/components/Option'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import spacings from '@common/styles/spacings'

import { getAddAccountOptions } from './helpers/getAddAccountOptions'

const AddAccount = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const options = useMemo(() => getAddAccountOptions({ navigate, t }), [navigate, t])

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
          hasLargerBottomSpace={option.hasLargerBottomSpace}
        />
      ))}
    </View>
  )
}

export default React.memo(AddAccount)
