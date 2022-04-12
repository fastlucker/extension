import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import EditIcon from '@assets/svg/EditIcon'
import { useTranslation } from '@config/localization'
import NumberInput from '@modules/common/components/NumberInput'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

type Props = {
  setCustomFee: (val: any) => any
  value: string
  isEditEnabled: boolean
  setEnableEdit: () => void
  symbol: string
  info?: any
}

const CustomFee = ({ setCustomFee, value, isEditEnabled, setEnableEdit, symbol, info }: Props) => {
  const { t } = useTranslation()

  const handleEnableEdit = () => {
    !!setEnableEdit && setEnableEdit()
  }

  if (!isEditEnabled) {
    return (
      <TouchableOpacity
        style={[spacings.mbTy, flexboxStyles.directionRow, flexboxStyles.alignCenter]}
        onPress={handleEnableEdit}
      >
        <View style={spacings.mrMi}>
          <EditIcon />
        </View>
        <Text weight="regular">{t('Edit fee')}</Text>
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
        info={info}
        infoTextStyle={{
          opacity: 1
        }}
        containerStyle={spacings.mbMi}
      />
    </View>
  )
}

export default CustomFee
