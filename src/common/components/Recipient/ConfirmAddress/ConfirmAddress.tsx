import React, { useCallback } from 'react'
import { View } from 'react-native'

import { TransferControllerState } from '@ambire-common/interfaces/transfer'
import { TokenResult } from '@ambire-common/libs/portfolio'
import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'

type Props = {
  onAddToAddressBook: () => any
  isRecipientHumanizerKnownTokenOrSmartContract: TransferControllerState['isRecipientHumanizerKnownTokenOrSmartContract']
  isRecipientAddressUnknown: TransferControllerState['isRecipientAddressUnknown']
  isRecipientAddressUnknownAgreed: TransferControllerState['isRecipientAddressUnknownAgreed']
  onRecipientAddressUnknownCheckboxClick: () => void
  addressValidationMsg: string
  isSWWarningVisible: boolean
  isSWWarningAgreed: boolean
  selectedTokenSymbol?: TokenResult['symbol']
}

const UNSUPPORTED_SW_PLATFORMS = ['Binance', 'Huobi', 'KuCoin', 'Gate.io', 'FTX']

const ConfirmAddress = ({
  onAddToAddressBook,
  onRecipientAddressUnknownCheckboxClick,
  isRecipientHumanizerKnownTokenOrSmartContract,
  isRecipientAddressUnknown,
  isRecipientAddressUnknownAgreed,
  addressValidationMsg,
  isSWWarningVisible,
  isSWWarningAgreed,
  selectedTokenSymbol
}: Props) => {
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()
  const [bindAnim, animStyle] = useHover({
    preset: 'opacityInverted'
  })

  const onSWWarningCheckboxClick = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
      params: {
        isSWWarningAgreed: true
      }
    })
  }, [dispatch])

  return !isRecipientHumanizerKnownTokenOrSmartContract &&
    !!isRecipientAddressUnknown &&
    addressValidationMsg !== 'Invalid address.' ? (
    <>
      <View style={spacings.mbMd}>
        <Checkbox
          value={isRecipientAddressUnknownAgreed}
          onValueChange={onRecipientAddressUnknownCheckboxClick}
          label={t('Confirm sending to a previously unknown address')}
          style={isSWWarningVisible ? spacings.mbSm : spacings.mb0}
        />

        {isSWWarningVisible ? (
          <Checkbox
            value={isSWWarningAgreed}
            style={spacings.mb0}
            onValueChange={onSWWarningCheckboxClick}
          >
            <Text fontSize={12} onPress={onSWWarningCheckboxClick}>
              {
                t(
                  'I confirm this address is not a {{platforms}} address: These platforms do not support {{token}} deposits from smart wallets.',
                  {
                    platforms: UNSUPPORTED_SW_PLATFORMS.join(' / '),
                    token: selectedTokenSymbol
                  }
                ) as string
              }
            </Text>
          </Checkbox>
        ) : null}
      </View>
      <AnimatedPressable style={animStyle} onPress={onAddToAddressBook} {...bindAnim}>
        <Text
          style={{
            textDecorationLine: 'underline',
            ...spacings.mbMd
          }}
          fontSize={14}
          appearance="primary"
        >
          {t('+ Add to Address Book')}
        </Text>
      </AnimatedPressable>
    </>
  ) : null
}

export default ConfirmAddress
