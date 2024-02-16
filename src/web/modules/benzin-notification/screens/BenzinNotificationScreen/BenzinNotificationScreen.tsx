import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import Benzin from '@benzin/screens/BenzinScreen/components/Benzin/Benzin'
import Buttons from '@benzin/screens/BenzinScreen/components/Buttons'
import useBenzin from '@benzin/screens/BenzinScreen/hooks/useBenzin'
import Button from '@common/components/Button'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutContainer } from '@web/components/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'

const BenzinNotificationScreen = () => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()

  const closeNotification = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_RESOLVE_REQUEST',
      params: {
        data: {}
      }
    })
  }, [dispatch])

  const state = useBenzin({
    onOpenExplorer: closeNotification
  })

  return (
    <TabLayoutContainer
      width="full"
      footer={
        <>
          <Button
            type="secondary"
            onPress={closeNotification}
            style={{ minWidth: 180 }}
            hasBottomSpacing={false}
            text={t('Close')}
          />
          {state?.handleCopyText && state?.handleOpenExplorer ? (
            <Buttons
              handleCopyText={state.handleCopyText}
              handleOpenExplorer={state.handleOpenExplorer}
              style={{ ...flexbox.directionRow, ...spacings.mb0 }}
            />
          ) : null}
        </>
      }
    >
      <Benzin state={state} />
    </TabLayoutContainer>
  )
}

export default BenzinNotificationScreen
