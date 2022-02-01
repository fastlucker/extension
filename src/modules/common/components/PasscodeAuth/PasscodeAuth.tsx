import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import CodeInput from '@modules/common/components/CodeInput'
import P from '@modules/common/components/P'
import Text, { TEXT_TYPES } from '@modules/common/components/Text'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext/constants'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

interface Props {
  onFulfill: (code: string) => void
  hasError: boolean | null
  onValidateLocalAuth: () => any
  state: PASSCODE_STATES
  deviceSupportedAuthTypesLabel: string
  fallbackSupportedAuthTypesLabel: string
  autoFocus: boolean
}

const PasscodeAuth: React.FC<Props> = ({
  onFulfill,
  hasError,
  onValidateLocalAuth,
  state,
  deviceSupportedAuthTypesLabel,
  fallbackSupportedAuthTypesLabel,
  autoFocus
}) => {
  const { t } = useTranslation()

  return (
    <>
      <P style={[textStyles.center, spacings.mtLg]}>
        {t('In order to proceed, please authenticate by entering the app passcode.')}
      </P>
      {hasError && (
        <P type={TEXT_TYPES.DANGER} style={[textStyles.center, spacings.mb0]}>
          {t('Wrong passcode.')}
        </P>
      )}
      <CodeInput
        // TODO: Auto-focus doesn't pop the keyboard
        autoFocus={autoFocus}
        onFulfill={onFulfill}
      />
      {state === PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH && (
        <>
          <Text style={[textStyles.center, spacings.mtTy, spacings.mbLg]}>{t('– or –')}</Text>
          <P style={textStyles.center}>
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
          </P>
          <Button text={t('Authenticate')} onPress={onValidateLocalAuth} />
        </>
      )}
    </>
  )
}

export default PasscodeAuth
