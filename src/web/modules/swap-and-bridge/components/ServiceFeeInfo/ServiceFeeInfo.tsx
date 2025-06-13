import React, { FC } from 'react'
import { View } from 'react-native'

import { EstimationStatus } from '@ambire-common/controllers/estimation/types'
import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import { SwapAndBridgeSendTxRequest } from '@ambire-common/interfaces/swapAndBridge'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'

type Props = {
  swapTxn: SwapAndBridgeSendTxRequest | undefined
}

const ServiceFeeInfo: FC<Props> = ({ swapTxn }) => {
  const { formStatus, signAccountOpController, swapSignErrors } = useSwapAndBridgeControllerState()

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.justifySpaceBetween,
        {
          height: 25 // Prevents layout shifts
        },
        spacings.mbLg
      ]}
    >
      {swapSignErrors.length === 0 &&
        [
          SwapAndBridgeFormStatus.InvalidRouteSelected,
          SwapAndBridgeFormStatus.ReadyToEstimate,
          SwapAndBridgeFormStatus.ReadyToSubmit,
          SwapAndBridgeFormStatus.Proceeded
        ].includes(formStatus) &&
        signAccountOpController?.estimation.status === EstimationStatus.Success &&
        swapTxn &&
        swapTxn.serviceFee.length && (
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <View style={[flexbox.directionRow, flexbox.alignCenter]}>
              {swapTxn.serviceFee.map((fee) => (
                <Text appearance="tertiaryText" fontSize={14} weight="medium" key={fee.name}>
                  {fee.description} {fee.amountUSD}
                </Text>
              ))}
            </View>
          </View>
        )}
    </View>
  )
}

export default ServiceFeeInfo
