import React, { useState } from 'react'
import { View } from 'react-native'

import { isAndroid } from '@config/env'
import RequireBluetooth from '@modules/common/components/RequireBluetooth'
import Segments from '@modules/common/components/Segments'
import spacings from '@modules/common/styles/spacings'
import { CONNECTION_TYPE } from '@modules/hardware-wallet/constants'

import LedgerBluetoothConnect from '../LedgerBluetoothConnect/LedgerBluetoothConnect'
import USBConnect from '../USBConnect'

interface Props {
  onSelectDevice: (device: any) => any
  shouldWrap?: boolean
  shouldScan?: boolean
}

const segments = [{ value: CONNECTION_TYPE.BLUETOOTH }, { value: CONNECTION_TYPE.USB }]

const HardwareWalletSelectConnection = ({
  onSelectDevice,
  shouldWrap = true,
  shouldScan = true
}: Props) => {
  const [connectionType, setConnectionType] = useState(CONNECTION_TYPE.BLUETOOTH)

  return (
    <>
      {isAndroid && (
        <View style={[spacings.mbLg, shouldWrap && spacings.ptSm, spacings.ph]}>
          <Segments
            defaultValue={connectionType}
            segments={segments}
            onChange={(value: CONNECTION_TYPE) => setConnectionType(value)}
          />
        </View>
      )}
      {connectionType === CONNECTION_TYPE.BLUETOOTH && (
        <RequireBluetooth>
          <LedgerBluetoothConnect
            onSelectDevice={onSelectDevice}
            shouldScan={shouldScan}
            shouldWrap={shouldWrap}
          />
        </RequireBluetooth>
      )}
      {connectionType === CONNECTION_TYPE.USB && (
        <USBConnect onSelectDevice={onSelectDevice} shouldWrap={shouldWrap} />
      )}
    </>
  )
}

export default HardwareWalletSelectConnection
