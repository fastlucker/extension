import React from 'react'
import { View } from 'react-native'
import StepIndicator from 'react-native-step-indicator'

import CheckIcon from '@common/assets/svg/CheckIcon'
import useStepper from '@common/modules/auth/hooks/useStepper'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

import styles from './styles'

const customStyles = {
  stepIndicatorSize: 18,
  currentStepIndicatorSize: 18,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: colors.martinique_35,
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: colors.greenHaze,
  stepStrokeUnFinishedColor: colors.martinique_35,
  separatorFinishedColor: colors.greenHaze,
  separatorUnFinishedColor: colors.martinique_35,
  stepIndicatorFinishedColor: colors.greenHaze,
  stepIndicatorUnFinishedColor: colors.white,
  stepIndicatorCurrentColor: colors.white,
  stepIndicatorLabelFontSize: 11,
  currentStepIndicatorLabelFontSize: 11,
  stepIndicatorLabelCurrentColor: colors.clay_35,
  stepIndicatorLabelFinishedColor: colors.white,
  stepIndicatorLabelUnFinishedColor: colors.clay,
  labelColor: colors.clay,
  labelSize: 11,
  currentStepLabelColor: colors.clay
}

const StepperComponent: React.FC<any> = () => {
  const { stepperState, getCurrentFlowSteps } = useStepper()
  const flowSteps = getCurrentFlowSteps()

  if (!stepperState) return null

  const { currentStep } = stepperState

  const renderStepIndicator = ({ stepStatus }: { stepStatus: string }) =>
    stepStatus === 'finished' ? <CheckIcon width={18} height={18} color={colors.greenHaze} /> : null

  return (
    <View
      style={[
        styles.container,
        spacings.phLg,
        spacings.mtTy,
        flexboxStyles.flex1,
        flexboxStyles.justifyCenter
      ]}
    >
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentStep}
        renderStepIndicator={renderStepIndicator}
        stepCount={flowSteps.length}
        labels={flowSteps}
      />
    </View>
  )
}

export default React.memo(StepperComponent)
