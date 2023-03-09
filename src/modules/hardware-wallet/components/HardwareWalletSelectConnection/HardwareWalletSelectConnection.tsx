import React, { useState } from 'react'

// import { View } from 'react-native'
// import { isAndroid } from '@config/env'
import RequireBluetooth from '@common/components/RequireBluetooth'
// import Segments from '@modules/common/components/Segments'
// import spacings from '@modules/common/styles/spacings'
import { CONNECTION_TYPE } from '@modules/hardware-wallet/constants'

import LedgerBluetoothConnect from '../LedgerBluetoothConnect/LedgerBluetoothConnect'

// There is an issue with the package: @ledgerhq/react-native-hid after updating to Expo SDK 46:
// This package is responsible for the USB connection of HW devices to an Android phones and temporary this functionality will be hidden
// for the mobile app until ledger resolves this issue
// TODO: uncomment
// import USBConnect from '../USBConnect'

interface Props {
  onSelectDevice: (device: any) => any
  shouldWrap?: boolean
  shouldScan?: boolean
}

// const segments = [{ value: CONNECTION_TYPE.BLUETOOTH }, { value: CONNECTION_TYPE.USB }]

const HardwareWalletSelectConnection = ({
  onSelectDevice,
  shouldWrap = true,
  shouldScan = true
}: Props) => {
  const [connectionType, setConnectionType] = useState(CONNECTION_TYPE.BLUETOOTH)

  return (
    <>
      {/* {isAndroid && (
        <View style={[spacings.mbLg, shouldWrap && spacings.ptSm, spacings.ph]}>
          <Segments
            defaultValue={connectionType}
            segments={segments}
            onChange={(value: CONNECTION_TYPE) => setConnectionType(value)}
          />
        </View>
      )} */}
      {connectionType === CONNECTION_TYPE.BLUETOOTH && (
        <RequireBluetooth>
          <LedgerBluetoothConnect
            onSelectDevice={onSelectDevice}
            shouldScan={shouldScan}
            shouldWrap={shouldWrap}
          />
        </RequireBluetooth>
      )}
      {/* {connectionType === CONNECTION_TYPE.USB && (
        <USBConnect onSelectDevice={onSelectDevice} shouldWrap={shouldWrap} />
      )} */}
    </>
  )
}

export default HardwareWalletSelectConnection
