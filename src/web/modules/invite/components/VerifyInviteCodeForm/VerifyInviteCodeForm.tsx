import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { INVITE_STATUS } from '@ambire-common/controllers/invite/invite'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { isDev, isTesting, isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import spacings from '@common/styles/spacings'
import { DEFAULT_INVITATION_CODE_DEV } from '@env'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useInviteControllerState from '@web/hooks/useInviteControllerState'

const VerifyInviteCodeForm: React.FC<any> = () => {
  const { navigate } = useNavigation()
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const { inviteStatus } = useInviteControllerState()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    mode: 'all',
    defaultValues: {
      code: isDev && !isTesting ? DEFAULT_INVITATION_CODE_DEV ?? '' : ''
    }
  })

  // If the invite status verified, navigate out from this route to 1) navigate
  // on success and 2) prevent someone from navigating to this route directly.
  useEffect(() => {
    if (inviteStatus === INVITE_STATUS.VERIFIED) {
      navigate('/')
    }
  }, [inviteStatus, navigate, t])

  const handleFormSubmit = useCallback(
    () =>
      handleSubmit(({ code }) => {
        dispatch({
          type: 'INVITE_CONTROLLER_VERIFY',
          params: { code }
        })
      })(),
    [dispatch, handleSubmit]
  )

  return (
    <>
      <Text style={[spacings.mvXl]} fontSize={20} weight="medium">
        {t('Enter an invite code')}
      </Text>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            testID="verify-invite-code-input"
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={handleFormSubmit}
            value={value}
            autoFocus={isWeb}
            isValid={!errors.code && value.length > 0}
            error={errors.code && (t('You need an invite, in order to proceed.') as string)}
          />
        )}
        name="code"
      />

      <Button
        testID="verify-invite-code-submit"
        disabled={isSubmitting || !isValid}
        type="primary"
        text={isSubmitting ? t('Validating...') : t('Continue')}
        onPress={handleFormSubmit}
      />
    </>
  )
}

export default VerifyInviteCodeForm
