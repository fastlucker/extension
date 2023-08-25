import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button from '@common/components/Button'
import RecipientInput from '@common/components/RecipientInput'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'

import styles from './styles'

const CollectibleTransfer = () => {
  const { control } = useForm()
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Text color={colors.martinique} style={styles.title}>
        {t('Transfer')}
      </Text>
      <Controller
        name="recipientAddr"
        control={control}
        render={({ field: { onChange, value } }) => (
          <RecipientInput
            style={styles.input}
            containerStyle={styles.inputContainer}
            label="Recipient"
            onChange={onChange}
            value={value}
          />
        )}
      />
      <Button style={styles.button} text="Send" />
    </View>
  )
}

export default CollectibleTransfer
