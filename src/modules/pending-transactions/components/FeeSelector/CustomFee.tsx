import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useTranslation } from '@config/localization'
import { FontAwesome5 } from '@expo/vector-icons'
import NumberInput from '@modules/common/components/NumberInput'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

type Props = {
  setCustomFee: (val: any) => any
  value: string
  isEditEnabled: boolean
  setEnableEdit: () => void
  symbol: string
}

const CustomFee = ({ setCustomFee, value, isEditEnabled, setEnableEdit, symbol }: Props) => {
  const { t } = useTranslation()

  const handleEnableEdit = () => {
    !!setEnableEdit && setEnableEdit()
  }

  if (!isEditEnabled) {
    return (
      <TouchableOpacity
        style={[spacings.mb, flexboxStyles.directionRow, flexboxStyles.alignCenter]}
        onPress={handleEnableEdit}
      >
        <FontAwesome5 style={spacings.mrMi} name="edit" size={18} color={colors.textColor} />
        <Text>{t('Edit fee')}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.customFeeContainer}>
      <NumberInput
        label={t('Custom fee ({{symbol}})', { symbol })}
        placeholder={t('Enter amount')}
        onChangeText={setCustomFee}
        value={value}
        autoCorrect={false}
      />
    </View>
  )
}

export default CustomFee
