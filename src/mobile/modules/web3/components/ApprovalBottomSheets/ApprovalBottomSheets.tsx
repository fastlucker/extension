import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { useEffect } from 'react'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import useNavigation from '@common/hooks/useNavigation'
import colors from '@common/styles/colors'
import SwitchNetworkRequest from '@mobile/modules/web3/components/SwitchNetworkRequest'
import { Web3ContextData } from '@mobile/modules/web3/contexts/web3Context/types'

import PermissionRequest from '../PermissionRequest'

type Props = {
  approval: Web3ContextData['approval']
  selectedDappUrl: string
  checkHasPermission: Web3ContextData['checkHasPermission']
  grantPermission: () => void
  sheetRefPermission: React.RefObject<any>
  closeBottomSheetPermission: (dest?: 'default' | 'alwaysOpen' | undefined) => void
  tabSessionData: any
}

const ApprovalBottomSheets = ({
  approval,
  selectedDappUrl,
  checkHasPermission,
  grantPermission,
  sheetRefPermission,
  closeBottomSheetPermission,
  tabSessionData
}: Props) => {
  const prevApproval: any = usePrevious(approval)
  const { goBack } = useNavigation()

  const {
    ref: sheetRefSwitchNetwork,
    open: openBottomSheetSwitchNetwork,
    close: closeBottomSheetSwitchNetwork
  } = useModalize()

  useEffect(() => {
    if (
      prevApproval?.data?.approvalComponent !== 'SwitchNetwork' &&
      approval?.data?.approvalComponent === 'SwitchNetwork'
    ) {
      openBottomSheetSwitchNetwork()
    }
  }, [approval, prevApproval, openBottomSheetSwitchNetwork])

  return (
    <>
      <BottomSheet
        id="allow-dapp-to-connect"
        sheetRef={sheetRefPermission}
        closeBottomSheet={() => {
          setTimeout(() => {
            if (!checkHasPermission(selectedDappUrl)) {
              closeBottomSheetPermission()
              goBack()
            } else {
              closeBottomSheetPermission()
            }
          }, 10)
        }}
      >
        <PermissionRequest
          isInBottomSheet
          tabSessionData={tabSessionData}
          closeBottomSheet={closeBottomSheetPermission}
          grantPermission={grantPermission}
        />
      </BottomSheet>
      <BottomSheet
        id="switch-network-approval"
        sheetRef={sheetRefSwitchNetwork}
        closeBottomSheet={closeBottomSheetSwitchNetwork}
        style={{ backgroundColor: colors.martinique }}
      >
        <SwitchNetworkRequest isInBottomSheet closeBottomSheet={closeBottomSheetSwitchNetwork} />
      </BottomSheet>
    </>
  )
}

export default ApprovalBottomSheets
