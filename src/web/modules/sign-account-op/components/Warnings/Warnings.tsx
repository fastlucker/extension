import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Alert from '@common/components/Alert'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'

import getStyles from './styles'

interface Props {
  hasEstimation: boolean
  slowRequest: boolean
  slowPaymasterRequest: boolean
  rbfDetected: boolean
  bundlerFailure: boolean
}

const Warnings: FC<Props> = ({
  hasEstimation,
  slowRequest,
  slowPaymasterRequest,
  rbfDetected,
  bundlerFailure
}) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const signAccountOpState = useSignAccountOpControllerState()

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

      {!!hasEstimation && bundlerFailure && (
        <View style={spacings.ptTy}>
          <Alert
            type="warning"
            size="sm"
            title={t(
              'Smart account fee options are temporarily unavailable. You can pay fee with a Basic account or try again later'
            )}
          />
        </View>
      )}

      {!hasEstimation && !!slowRequest && !signAccountOpState?.errors.length ? (
        <View style={spacings.ptTy}>
          <Alert
            type="warning"
            size="sm"
            title="Estimating this transaction is taking an unexpectedly long time. We'll keep trying, but it is possible that there's an issue with this network or RPC - please change your RPC provider or contact Ambire support if this issue persists."
          />
        </View>
      ) : null}

      {slowPaymasterRequest && (
        <View style={spacings.ptTy}>
          <Alert
            type="warning"
            size="sm"
            title={t(
              'Requesting the paymaster is taking an unexpectedly long time. Waiting for response...'
            )}
          />
        </View>
      )}
    </View>
  )
}

export default Warnings
