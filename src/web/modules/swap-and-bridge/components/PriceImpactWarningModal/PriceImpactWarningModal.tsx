import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BottomSheet from '@common/components/BottomSheet'
import Checkbox from '@common/components/Checkbox'
import DualChoiceWarningModal from '@common/components/DualChoiceWarningModal'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

type Props = {
  sheetRef: React.RefObject<any>
  closeBottomSheet: () => void
  acknowledgeHighPriceImpact: () => void
  highPriceImpactInPercentage: number | null
}

const PriceImpactWarningModal: FC<Props> = ({
  sheetRef,
  closeBottomSheet,
  acknowledgeHighPriceImpact,
  highPriceImpactInPercentage
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [isConfirmed, setIsConfirmed] = useState(false)

  const closeBottomSheetWrapped = () => {
    closeBottomSheet()
    setIsConfirmed(false)
  }

  const acknowledgeWarningWrapped = () => {
    acknowledgeHighPriceImpact()
    setIsConfirmed(false)
  }

  return (
    <BottomSheet
      id="warning-modal"
      closeBottomSheet={closeBottomSheetWrapped}
      sheetRef={sheetRef}
      style={{
        backgroundColor: theme.primaryBackground,
        paddingHorizontal: 0,
        paddingVertical: 0,
        overflow: 'hidden'
      }}
      type="bottom-sheet"
      withBackdropBlur={false}
      shouldBeClosableOnDrag={false}
    >
      <DualChoiceWarningModal
        title={t(
          `Ouch! Very high price impact (${
            highPriceImpactInPercentage ? `-${highPriceImpactInPercentage.toFixed(2)}%` : ''
          })`
        )}
        type="error"
        description={t(
          'This swap will significantly affect the market price of this pool and will reduce your expected return.'
        )}
        primaryButtonText={t('Continue anyway')}
        secondaryButtonText={t('Cancel')}
        primaryButtonProps={{
          disabled: !isConfirmed,
          type: 'error'
        }}
        onPrimaryButtonPress={acknowledgeWarningWrapped}
        onSecondaryButtonPress={closeBottomSheetWrapped}
      >
        <Checkbox
          label={t('I understand ')}
          value={isConfirmed}
          labelProps={{
            fontSize: 16,
            weight: 'medium',
            color: theme.errorText
          }}
          uncheckedBorderColor={theme.errorDecorative}
          checkedColor={theme.errorDecorative}
          onValueChange={setIsConfirmed}
          style={{ ...spacings.mtLg, ...flexbox.alignCenter }}
        />
      </DualChoiceWarningModal>
    </BottomSheet>
  )
}

export default PriceImpactWarningModal
