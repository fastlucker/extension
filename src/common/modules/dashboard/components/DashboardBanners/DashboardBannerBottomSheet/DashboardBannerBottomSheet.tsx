import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import BottomSheet from '@common/components/BottomSheet'
import DualChoiceModal from '@common/components/DualChoiceModal'
import spacings from '@common/styles/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'

type Props = {
  id: string
  sheetRef: React.RefObject<any>
  closeBottomSheet: () => void
}

const WITH_BOTTOM_SHEET = ['update-available']

const DashboardBannerBottomSheet: FC<Props> = ({ id, sheetRef, closeBottomSheet }) => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()

  if (!WITH_BOTTOM_SHEET.includes(id)) return null

  return (
    <BottomSheet
      id={`${id}-bottom-sheet`}
      sheetRef={sheetRef}
      closeBottomSheet={closeBottomSheet}
      backgroundColor="secondaryBackground"
      style={{ overflow: 'hidden', width: 496, ...spacings.ph0, ...spacings.pv0 }}
      type="modal"
    >
      {id === 'update-available' && (
        <DualChoiceModal
          title={t('Are you sure you want to reload the extension?') as string}
          description={t('This will discard any unsaved data or pending actions.') as string}
          primaryButtonText={t('Reload now')}
          onPrimaryButtonPress={() =>
            dispatch({
              type: 'EXTENSION_UPDATE_CONTROLLER_APPLY_UPDATE'
            })
          }
          secondaryButtonText={t('Cancel')}
          onSecondaryButtonPress={closeBottomSheet}
        />
      )}
    </BottomSheet>
  )
}

export default DashboardBannerBottomSheet
