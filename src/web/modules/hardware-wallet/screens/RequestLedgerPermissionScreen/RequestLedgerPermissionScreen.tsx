import React from 'react'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import { hasConnectedLedgerDevice } from '@web/modules/hardware-wallet/utils/ledger'

const RequestLedgerPermissionScreen = () => {
  const { navigate } = useNavigation()

  const onSubmit = async () => {
    // const parent = window.opener
    // try {
    //   const transport = await TransportWebHID.create()
    //   await transport.close()
    //   await wallet.authorizeLedgerHIDPermission()
    //   if (isReconnect) {
    //     wallet.activeFirstApproval()
    //     window.close()
    //     return
    //   }
    //   if (from && from === 'approval') {
    //     setShowSuccess(true)
    //     return
    //   }
    //   if (parent) {
    //     window.postMessage({ success: true }, '*')
    //   } else {
    //     history.push({
    //       pathname: '/import/select-address',
    //       state: {
    //         keyring: HARDWARE_KEYRING_TYPES.Ledger.type,
    //         isWebHID: true,
    //         ledgerLive: false
    //       }
    //     })
    //   }
    // } catch (e) {
    //   if (parent) {
    //     window.postMessage({ success: false }, '*')
    //   }
    // }
  }

  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <Title>Allow Ambire permissions to:</Title>
        <Text>Connect to an HID device</Text>
        <Text>
          Please click "Allow" below and authorize access to your Ledger in the following pop-up
          window.
        </Text>
        <Button text="Allow" onPress={onSubmit} />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default RequestLedgerPermissionScreen
