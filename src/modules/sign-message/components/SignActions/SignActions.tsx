import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button, { BUTTON_TYPES } from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import P from '@modules/common/components/P'
import { TEXT_TYPES } from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'

import styles from './styles'

const SignActions = ({ isLoading, approve, resolve }: any) => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      code: '',
      password: ''
    }
  })
  return (
    <View>
      <View style={spacings.mbTy}>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t('Account password')}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry
              autoCorrect={false}
              value={value}
            />
          )}
          name="password"
        />
      </View>
      {!!errors.password && <P type={TEXT_TYPES.DANGER}>{t('Password is required.')}</P>}
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            type={BUTTON_TYPES.DANGER}
            text={t('Reject')}
            onPress={() => resolve({ message: 'signature denied' })}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button text={t('Sign')} onPress={handleSubmit(approve)} disabled={isLoading} />
        </View>
      </View>
    </View>
  )
}

export default SignActions
