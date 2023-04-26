import React, { createContext, useCallback, useMemo, useState } from 'react'

import NotificationService, {
  Approval
} from '@mobile/modules/web3/services/webview-background/services/notification'

type NotificationContextData = {
  requestNotificationServiceMethod: ({
    method,
    props
  }: {
    method: string
    props?: { [key: string]: any }
  }) => any
  approval: Approval | null
  setApproval: React.Dispatch<React.SetStateAction<Approval | null>>
  setWebViewRef: React.Dispatch<any>
}

const NotificationContext = createContext<NotificationContextData>({
  requestNotificationServiceMethod: () => {},
  approval: null,
  setApproval: () => {},
  setWebViewRef: () => {}
})

const NotificationProvider: React.FC<any> = ({ children }) => {
  const [approval, setApproval] = useState<Approval | null>(null)
  const [webViewRef, setWebViewRef] = useState<any>(null)

  const openApprovalModal = (appr: Approval | null) => {
    setApproval(appr)
  }

  const notificationService: any = useMemo(
    () => new NotificationService({ openApprovalModal, webViewRef }),
    []
  )

  const requestNotificationServiceMethod = useCallback(
    ({ method, props }: { method: string; props?: { [key: string]: any } }) => {
      return notificationService[method](props)
    },
    [notificationService]
  )

  return (
    <NotificationContext.Provider
      value={useMemo(
        () => ({
          requestNotificationServiceMethod,
          approval,
          setApproval,
          setWebViewRef
        }),
        [requestNotificationServiceMethod, approval, setApproval]
      )}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export { NotificationContext, NotificationProvider }
