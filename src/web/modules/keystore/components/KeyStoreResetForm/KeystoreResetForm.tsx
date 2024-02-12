import { isValidPassword } from '@ambire-common/services/validations'
import { FC } from 'react'
import { Controller, FieldErrorsImpl } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Input from '@common/components/Input'
import InputPassword from '@common/components/InputPassword'
import { isWeb } from '@common/config/env'
import PasswordSetModal from '@web/components/PasswordSetModal'

import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
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
  isPasswordChanged: boolean
  handleChangeKeystorePassword: () => void
}

const KeystoreResetForm: FC<Props> = ({
  password,
  control,
  errors,
  isPasswordChanged,
  handleChangeKeystorePassword
}) => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

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
            onSubmitEditing={handleChangeKeystorePassword}
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
            onSubmitEditing={handleChangeKeystorePassword}
          />
        )}
        name="confirmPassword"
      />
      <PasswordSetModal isOpen={isPasswordChanged} onPress={() => navigate(ROUTES.dashboard)} />
    </>
  )
}

export default KeystoreResetForm
