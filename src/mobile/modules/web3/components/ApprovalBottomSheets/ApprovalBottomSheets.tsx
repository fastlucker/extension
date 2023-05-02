import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { useEffect } from 'react'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Title from '@common/components/Title'
import useNavigation from '@common/hooks/useNavigation'
import colors from '@common/styles/colors'
import text from '@common/styles/utils/text'
import SwitchNetworkRequest from '@mobile/modules/web3/components/SwitchNetworkRequest'
import { Web3ContextData } from '@mobile/modules/web3/contexts/web3Context/types'

type Props = {
  approval: Web3ContextData['approval']
  selectedDappUrl: string
  checkHasPermission: Web3ContextData['checkHasPermission']
  grantPermission: () => void
}

const ApprovalBottomSheets = ({
  approval,
  selectedDappUrl,
  checkHasPermission,
  grantPermission
}: Props) => {
  const prevSelectedDappUrl: any = usePrevious(selectedDappUrl)
  const prevApproval: any = usePrevious(approval)
  const { goBack } = useNavigation()

  const {
    ref: sheetRefPermission,
    open: openBottomSheetPermission,
    close: closeBottomSheetPermission
  } = useModalize()
  const {
    ref: sheetRefSwitchNetwork,
    open: openBottomSheetSwitchNetwork,
    close: closeBottomSheetSwitchNetwork
  } = useModalize()

  useEffect(() => {
    if (!prevSelectedDappUrl && selectedDappUrl) {
      if (!checkHasPermission(selectedDappUrl)) {
        setTimeout(() => {
          openBottomSheetPermission()
        }, 1)
      }
    }
  }, [checkHasPermission, openBottomSheetPermission, prevSelectedDappUrl, selectedDappUrl])

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
        <Title style={text.center}>Allow dApp to Connect</Title>
        <Button
          text="Allow"
          onPress={() => {
            grantPermission()
            closeBottomSheetPermission()
          }}
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
