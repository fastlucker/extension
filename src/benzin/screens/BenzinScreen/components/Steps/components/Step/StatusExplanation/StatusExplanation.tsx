import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import InfoIcon from '@common/assets/svg/InfoIcon'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import spacings from '@common/styles/spacings'

const STATUSES_WITH_EXPLANATIONS = ['dropped']

interface Props {
  status: string | undefined
  stepName: string
}

const StatusExplanation: FC<Props> = ({ status, stepName }) => {
  const { t } = useTranslation()
  if (!status || !STATUSES_WITH_EXPLANATIONS.includes(status) || stepName !== 'finalized')
    return null

  return (
    <>
      <InfoIcon width={16} height={16} data-tooltip-id="status-explanation-tooltip" />
      <Tooltip id="status-explanation-tooltip">
        {status === 'dropped' && (
          <View>
            <Text fontSize={14} appearance="secondaryText" style={spacings.mbMi}>
              {t(
                'Dropped transactions are transactions that were initially included in the mempool but were removed before being mined, typically due to higher gas fee transactions replacing them or nonce conflicts.'
              )}
            </Text>
            <Text fontSize={14} appearance="secondaryText">
              {t('You can fix this by resubmitting the same transaction with a higher fee.')}
            </Text>
          </View>
        )}
      </Tooltip>
    </>
  )
}

export default StatusExplanation
