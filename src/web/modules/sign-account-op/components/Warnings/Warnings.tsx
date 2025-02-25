import React, { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Alert from '@common/components/Alert'
import Checkbox from '@common/components/Checkbox'
import NoKeysToSignAlert from '@common/components/NoKeysToSignAlert'
import Text from '@common/components/Text/'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'

import getStyles from './styles'

interface Props {
  hasEstimation: boolean
  slowRequest: boolean
  slowPaymasterRequest: boolean
  isViewOnly: boolean
  rbfDetected: boolean
  bundlerFailure: boolean
}

const Warnings: FC<Props> = ({
  hasEstimation,
  slowRequest,
  slowPaymasterRequest,
  isViewOnly,
  rbfDetected,
  bundlerFailure
}) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const signAccountOpState = useSignAccountOpControllerState()
  const { dispatch } = useBackgroundService()

  const onGasUsedTooHighAgreed = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
      params: { gasUsedTooHighAgreed: !signAccountOpState?.gasUsedTooHighAgreed }
    })
  }, [signAccountOpState?.gasUsedTooHighAgreed, dispatch])

  const warnings = useMemo(() => {
    return signAccountOpState?.warnings.filter((warning) => warning.displayBeforeSign)
  }, [signAccountOpState?.warnings])

  if (!signAccountOpState) return null

  return (
    <View style={styles.container}>
      {!!rbfDetected && (
        <View style={spacings.ptTy}>
          <Alert
            type="warning"
            title="RBF (replace by fee) detected. You are trying to replace the current transaction in the mempool with a new one. To do so, standard gas prices have been increased by 12.5%"
          />
        </View>
      )}

      {!signAccountOpState?.errors.length &&
        signAccountOpState.isInitialized &&
        warnings &&
        warnings
          .filter(({ id }) => id !== 'feeTokenPriceUnavailable')
          .map((warning, index) => {
            const isLast = warnings.length - 1 === index
            const isSingle = warnings.length === 1

            return (
              <Alert
                key={warning.id}
                type="warning"
                text={warning.text}
                title={warning.title}
                style={!isSingle && !isLast ? spacings.mbSm : {}}
              />
            )
          })}

      {!!hasEstimation && bundlerFailure && (
        <View style={spacings.ptTy}>
          <Alert
            type="warning"
            title={t(
              'Smart account fee options are temporarily unavailable. You can pay fee with a Basic account or try again later'
            )}
          />
        </View>
      )}

      {!!hasEstimation && signAccountOpState.gasUsedTooHigh && !signAccountOpState?.errors.length && (
        <View style={spacings.ptTy}>
          <Alert
            type="warning"
            title="Estimation for this request is enormously high (more than 25% of the block gas limit). The transaction may be invalid. Are you sure you want to proceed?"
          />
          <Checkbox
            value={signAccountOpState.gasUsedTooHighAgreed}
            onValueChange={onGasUsedTooHighAgreed}
            style={spacings.mtSm}
          >
            <Text fontSize={14} onPress={onGasUsedTooHighAgreed}>
              {t('I understand the risks')}
            </Text>
          </Checkbox>
        </View>
      )}

      {!hasEstimation && !!slowRequest && !signAccountOpState?.errors.length ? (
        <View style={spacings.ptTy}>
          <Alert
            type="warning"
            title="Estimating this transaction is taking an unexpectedly long time. We'll keep trying, but it is possible that there's an issue with this network or RPC - please change your RPC provider or contact Ambire support if this issue persists."
          />
        </View>
      ) : null}

      {slowPaymasterRequest && (
        <View style={spacings.ptTy}>
          <Alert
            type="warning"
            title={t(
              'Requesting the paymaster is taking an unexpectedly long time. Waiting for response...'
            )}
          />
        </View>
      )}

      {!!signAccountOpState?.errors.length && !isViewOnly ? (
        <View style={spacings.ptTy}>
          <Alert type="error" title={signAccountOpState?.errors[0]} />
        </View>
      ) : null}
      {isViewOnly && <NoKeysToSignAlert style={spacings.ptTy} />}
    </View>
  )
}

export default Warnings
