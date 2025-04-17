import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import { getUiType } from '@web/utils/uiType'

type Props = {
  isNotReadyToProceed: boolean
  isBridge: boolean
  handleSubmitForm: (isOneClickMode: boolean) => void
}

const { isActionWindow } = getUiType()

const Buttons: FC<Props> = ({ isNotReadyToProceed, handleSubmitForm, isBridge }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { fromSelectedToken } = useSwapAndBridgeControllerState()
  const { userRequests } = useMainControllerState()
  const { account } = useSelectedAccountControllerState()
  const fromChainId = fromSelectedToken?.chainId

  const networkUserRequests = fromChainId
    ? userRequests?.filter(
        (r) =>
          r.action.kind === 'calls' &&
          r.meta.accountAddr === account?.addr &&
          r.meta.chainId === fromChainId
      )
    : []

  const oneClickDisabledReason = useMemo(() => {
    if (!isBridge && networkUserRequests.length > 0) {
      return t(
        'You have pending transactions on this network. Please add this transaction to the batch.'
      )
    }

    return ''
  }, [isBridge, networkUserRequests.length, t])

  const batchDisabledReason = useMemo(() => {
    if (isBridge) return t('Batching is not available for bridges.')

    return ''
  }, [isBridge, t])

  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifyEnd]}>
      {!isActionWindow && (
        // @ts-ignore
        <View dataSet={{ tooltipId: 'batch-btn-tooltip' }}>
          <Button
            hasBottomSpacing={false}
            text={!oneClickDisabledReason ? t('Start a batch') : t('Add to batch')}
            disabled={isNotReadyToProceed || !!batchDisabledReason}
            type="secondary"
            style={{ minWidth: 160, ...spacings.phMd }}
            onPress={() => handleSubmitForm(false)}
          >
            {!!networkUserRequests.length && (
              <View style={[spacings.plSm, flexbox.directionRow, flexbox.alignCenter]}>
                <Text
                  fontSize={16}
                  weight="medium"
                  color={theme.primary}
                >{` (${networkUserRequests.length})`}</Text>
              </View>
            )}
          </Button>
        </View>
      )}
      {/* @ts-ignore */}
      <View dataSet={{ tooltipId: 'proceed-btn-tooltip' }}>
        <Button
          text={t('Proceed')}
          disabled={isNotReadyToProceed || !!oneClickDisabledReason}
          style={{ minWidth: 160, ...spacings.mlLg }}
          hasBottomSpacing={false}
          onPress={() => handleSubmitForm(true)}
          testID="proceed-btn"
        />
      </View>
      <Tooltip content={oneClickDisabledReason} id="proceed-btn-tooltip" />
      <Tooltip content={batchDisabledReason} id="batch-btn-tooltip" />
    </View>
  )
}

export default Buttons
