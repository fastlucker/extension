import { isValidPassword } from 'ambire-common/src/services/validations'
import { FC } from 'react'
import { Controller, FieldErrorsImpl } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Input from '@common/components/Input'
import InputPassword from '@common/components/InputPassword'
import { isWeb } from '@common/config/env'
import PasswordSetModal from '@web/components/PasswordSetModal'

import styles from './styles'

interface Props {
  password: string
  control: any
  errors: Partial<
    FieldErrorsImpl<{
      password: string
      confirmPassword: string
    }>
  >
}

const KeystoreResetForm: FC<Props> = ({ password, control, errors }) => {
  const { t } = useTranslation()

  return (
    <>
      <Controller
        control={control}
        rules={{ validate: isValidPassword }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputPassword
            onBlur={onBlur}
            placeholder={t('Enter Passphrase')}
            onChangeText={onChange}
            isValid={isValidPassword(value)}
            autoFocus={isWeb}
            value={value}
            error={
              errors.password &&
              (t('Please fill in at least 8 characters for passphrase.') as string)
            }
            containerStyle={styles.passwordInput}
          />
        )}
        name="password"
      />
      <Controller
        control={control}
        rules={{
          validate: (value) => password === value
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            placeholder={t('Repeat Passphrase')}
            onChangeText={onChange}
            value={value}
            isValid={!!value && password === value}
            secureTextEntry
            error={errors.confirmPassword && (t("Passphrases don't match.") as string)}
            autoCorrect={false}
            containerStyle={styles.confirmPasswordInput}
          />
        )}
        name="confirmPassword"
      />
      <PasswordSetModal isOpen onPress={() => {}} />
    </>
  )
}

export default KeystoreResetForm
