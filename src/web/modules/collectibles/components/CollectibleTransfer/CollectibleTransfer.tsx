import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button from '@common/components/Button'
import RecipientInput from '@common/components/RecipientInput'
import Text from '@common/components/Text'
import useBanners from '@common/hooks/useBanners'
import colors from '@common/styles/colors'

import styles from './styles'

const CollectibleTransfer = () => {
  const { control } = useForm()
  const { t } = useTranslation()
  const { addBanner } = useBanners()

  return (
    <View style={styles.container}>
      <Text color={colors.martinique} style={styles.title}>
        {t('Transfer')}
      </Text>
      <Controller
        name="recipientAddr"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text style={styles.inputLabel} fontSize={16} weight="medium">
              Recipient
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
          // @TODO: Remove this demo banner.
          addBanner({
            id: '1',
            topic: 'TRANSACTION',
            title: 'Awaiting transaction confirmation',
            text: 'You have an unsigned transaction waiting for confirmation.',
            actions: [
              {
                label: 'Sign',
                onPress: () => console.log('Signed')
              },
              {
                label: 'Reject',
                onPress: () => console.log('Rejected'),
                hidesBanner: true
              }
            ]
          })
        }}
        style={styles.button}
        text="Send"
      />
    </View>
  )
}

export default CollectibleTransfer
