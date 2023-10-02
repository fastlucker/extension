import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button from '@common/components/Button'
import RecipientInput from '@common/components/RecipientInput'
import Text from '@common/components/Text'

import styles from './styles'

const CollectibleTransfer = () => {
  const { control } = useForm()
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Transfer')}</Text>
      <Controller
        name="recipientAddr"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text style={styles.inputLabel} fontSize={16} weight="medium">
              {t('Recipient')}
            </Text>
            <RecipientInput
              style={styles.input}
              containerStyle={styles.inputContainer}
              onChange={onChange}
              value={value}
            />
          </View>
        )}
      />
      <Button
        onPress={() => {
          // TODO:
        }}
        style={styles.button}
        text={t('Send')}
      />
    </View>
  )
}

export default CollectibleTransfer
