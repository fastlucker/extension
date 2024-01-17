import React, { useMemo } from 'react'
import { View, ViewStyle } from 'react-native'
import StepIndicator from 'react-native-step-indicator'

import CheckIcon from '@common/assets/svg/CheckIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useStepper from '@common/modules/auth/hooks/useStepper'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'

type Props = {
  containerStyle?: ViewStyle | ViewStyle[]
}

const StepperComponent = ({ containerStyle }: Props) => {
  const { stepperState, getCurrentFlowSteps } = useStepper()
  const flowSteps = getCurrentFlowSteps()
  const { theme } = useTheme()

  const customStyles: any = useMemo(
    () => ({
      stepIndicatorSize: 18,
      currentStepIndicatorSize: 18,
      separatorStrokeWidth: 1,
      currentStepStrokeWidth: 1,
      stepStrokeCurrentColor: theme.successDecorative,
      stepStrokeWidth: 1,
      stepStrokeFinishedColor: theme.successDecorative,
      stepStrokeUnFinishedColor: theme.secondaryBorder,
      separatorFinishedColor: theme.successDecorative,
      separatorUnFinishedColor: theme.secondaryBorder,
      stepIndicatorFinishedColor: theme.successDecorative,
      stepIndicatorUnFinishedColor: theme.primaryBackground,
      stepIndicatorCurrentColor: theme.primaryBackground,
      stepIndicatorLabelFontSize: 11,
      currentStepIndicatorLabelFontSize: 11,
      stepIndicatorLabelCurrentColor: theme.secondaryText,
      stepIndicatorLabelFinishedColor: theme.successText,
      stepIndicatorLabelUnFinishedColor: theme.secondaryText,
      labelColor: theme.secondaryText,
      labelSize: 11,
      currentStepLabelColor: theme.secondaryText
    }),
    [theme]
  )

  if (!stepperState) return null

  const { currentStep } = stepperState

  const renderStepIndicator = ({ stepStatus }: { stepStatus: string }) =>
    stepStatus === 'finished' ? (
      <CheckIcon width={18} height={18} color={theme.successDecorative} />
    ) : null

  const renderLabel = ({
    label,
    stepStatus
  }: {
    position: number
    stepStatus: string
    label: string
    currentPosition: number
  }) => (
    <Text
      fontSize={11}
      weight="regular"
      style={[text.center, spacings.phMi]}
      appearance={stepStatus === 'finished' ? 'successText' : 'primaryText'}
      numberOfLines={2}
    >
      {label}
    </Text>
  )

  return (
    <View style={[spacings.mtTy, flexboxStyles.flex1, flexboxStyles.justifyCenter, containerStyle]}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentStep}
        renderStepIndicator={renderStepIndicator}
        renderLabel={renderLabel}
        stepCount={flowSteps.length}
        labels={flowSteps}
      />
    </View>
  )
}

export default React.memo(StepperComponent)
