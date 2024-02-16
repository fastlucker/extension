import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@common/components/Button'
import { TabLayoutContainer } from '@web/components/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'

interface Props {
  buttons: React.ReactNode
  children: React.ReactElement
}

const BenzinNotificationScreen: FC<Props> = ({ children, buttons }) => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()

  const closeNotification = () => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_RESOLVE_REQUEST',
      params: {
        data: {}
      }
    })
  }

  return (
    <TabLayoutContainer
      footer={
        <>
          <Button
            type="secondary"
            onPress={closeNotification}
            style={{ minWidth: 180 }}
            hasBottomSpacing={false}
            text={t('Close')}
          />
          {buttons}
        </>
      }
    >
      {children}
    </TabLayoutContainer>
  )
}

export default BenzinNotificationScreen
