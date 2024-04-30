import { Controller, useForm } from 'react-hook-form'

import Button from '@common/components/Button'
import Input from '@common/components/Input'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'

const VerifyInviteCodeForm: React.FC<any> = () => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    mode: 'all',
    defaultValues: {
      code: ''
    }
  })

  return (
    <>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label={t('Please insert your invitation code')}
            onBlur={onBlur}
            placeholder={t('Invite Code')}
            onChangeText={onChange}
            // TODO: v2
            onSubmitEditing={handleSubmit()}
            value={value}
            autoFocus={isWeb}
            isValid={!errors.code && value.length > 0}
            error={errors.code && (t('Please fill in an invite code.') as string)}
          />
        )}
        name="code"
      />

      <Button
        // TODO:
        // disabled={
        //   isSubmitting ||
        //   !watch('code', '')
        // }
        disabled={!isValid}
        type="primary"
        text={isSubmitting ? t('Validating...') : t('Verify')}
        onPress={handleSubmit()}
      />
    </>
  )
}

export default VerifyInviteCodeForm
