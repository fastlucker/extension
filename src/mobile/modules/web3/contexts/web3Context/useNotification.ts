import { useCallback, useMemo } from 'react'

import NotificationService, {
  Approval
} from '@mobile/modules/web3/services/webview-background/services/notification'

const useNotification = ({ web3ViewRef, setApproval }: any) => {
  const openApprovalModal = useCallback(
    (appr: Approval | null) => {
      setApproval(appr)
    },
    [setApproval]
  )

  const notificationService: any = useMemo(
    () => new NotificationService({ openApprovalModal, web3ViewRef }),
    [web3ViewRef, openApprovalModal]
  )

  const requestNotificationServiceMethod = useCallback(
    ({ method, props }: { method: string; props?: { [key: string]: any } }) => {
      return notificationService[method](props)
    },
    [notificationService]
  )

  return {
    requestNotificationServiceMethod
  }
}

export default useNotification
