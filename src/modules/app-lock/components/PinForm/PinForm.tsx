import React from 'react'

import { useTranslation } from '@config/localization'
import { PASSCODE_STATES } from '@modules/app-lock/contexts/appLockContext/constants'
import Button from '@modules/common/components/Button'
import CodeInput from '@modules/common/components/CodeInput'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

import Title from '../../../common/components/Title'

interface Props {
  title?: string
  message?: string
  onFulfill: (code: string) => void
  error: string
  onValidateLocalAuth: () => any
  state: PASSCODE_STATES
  deviceSupportedAuthTypesLabel: string
  fallbackSupportedAuthTypesLabel: string
  autoFocus: boolean
}

const PinForm: React.FC<Props> = ({
  title,
  message,
  onFulfill,
  error,
  onValidateLocalAuth,
  state,
  deviceSupportedAuthTypesLabel,
  fallbackSupportedAuthTypesLabel,
  autoFocus
}) => {
  const { t } = useTranslation()

  return (
    <>
      {title && (
        <Title hasBottomSpacing={false} style={textStyles.center}>
          {title}
        </Title>
      )}
      <Text style={[textStyles.center, spacings.mbSm, spacings.mt]} type="small">
        {message || t('In order to proceed, please enter your PIN.')}
      </Text>
      {!!error && (
        <Text appearance="danger" style={textStyles.center}>
          {error}
        </Text>
      )}
      <CodeInput autoFocus={autoFocus} onFulfill={onFulfill} />
      {state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH && (
        <>
          <Text type="small" style={[textStyles.center, spacings.mtTy, spacings.mb]}>
            {t('– or –')}
          </Text>
          <Text type="small" style={[textStyles.center, spacings.mb]}>
            {deviceSupportedAuthTypesLabel
              ? t(
                  'Authenticate with {{deviceSupportedAuthTypesLabel}} or your phone {{fallbackSupportedAuthTypesLabel}}.',
                  {
                    deviceSupportedAuthTypesLabel,
                    fallbackSupportedAuthTypesLabel
                  }
                )
              : t('Authenticate with your phone {{fallbackSupportedAuthTypesLabel}}.', {
                  fallbackSupportedAuthTypesLabel
                })}
          </Text>
          <Button text={t('Authenticate')} onPress={onValidateLocalAuth} />
        </>
      )}
    </>
  )
}

export default PinForm
