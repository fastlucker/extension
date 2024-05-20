import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import Benzin from '@benzin/screens/BenzinScreen/components/Benzin/Benzin'
import Buttons from '@benzin/screens/BenzinScreen/components/Buttons'
import useBenzin from '@benzin/screens/BenzinScreen/hooks/useBenzin'
import Button from '@common/components/Button'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutContainer } from '@web/components/TabLayoutWrapper'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

const BenzinScreen = () => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const actionsState = useActionsControllerState()

  const resolveAction = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_RESOLVE_USER_REQUEST',
      params: {
        data: {},
        id: actionsState.currentAction?.id
      }
    })
  }, [actionsState.currentAction?.id, dispatch])

  const state = useBenzin({ onOpenExplorer: resolveAction })

  return (
    <TabLayoutContainer
      width="full"
      withHorizontalPadding={false}
      footer={
        <>
          <Button
            type="secondary"
            onPress={resolveAction}
            style={{ minWidth: 180 }}
            hasBottomSpacing={false}
            text={t('Close')}
          />
          {state?.handleOpenExplorer ? (
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

export default BenzinScreen
