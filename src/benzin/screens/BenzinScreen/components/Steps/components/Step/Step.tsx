import { LinearGradient } from 'expo-linear-gradient'
import React, { FC } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

import { FinalizedStatusType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import ConfirmedIcon from '@common/assets/svg/ConfirmedIcon'
import RejectedIcon from '@common/assets/svg/RejectedIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import StepRow from './StepRow'
import { StepRowProps as StepRowInterface } from './StepRow/StepRow'
import getStyles from './styles'

const STEPS = ['signed', 'in-progress', 'finalized'] as const

interface StepProps {
  title?: string
  rows?: StepRowInterface[]
  stepName?: typeof STEPS[number]
  activeStep?: typeof STEPS[number]
  finalizedStatus?: FinalizedStatusType
  style?: ViewStyle
  titleStyle?: TextStyle
  children?: React.ReactNode | React.ReactNode[]
  testID?: string
}

const Step: FC<StepProps> = ({
  title,
  rows,
  stepName,
  activeStep,
  finalizedStatus,
  style,
  titleStyle,
  children,
  testID
}) => {
  const { theme, styles } = useTheme(getStyles)

  if (!title || !stepName || !activeStep) {
    if (!rows) return null

    return (
      <View
        style={[styles.step, spacings.plMd, { flexDirection: 'column' }, style]}
        testID={testID}
      >
        {rows.map((row) => (
          <StepRow {...row} key={row.label} />
        ))}
      </View>
    )
  }
  // Steps have 3 stages:
  // 1. Initial (not yet started and not next step)
  // 2. Next (not yet started but next step)
  // 3. Completed (=< active step)
  const stepIndex = STEPS.indexOf(stepName)
  const activeStepIndex = STEPS.indexOf(activeStep)
  const isInitial = stepIndex > activeStepIndex
  const isNext = stepIndex === activeStepIndex + 1
  const isCompleted = stepIndex <= activeStepIndex

  // Whether the line gradient should have red in it.
  const isRedDisplayedInLineGradient =
    (finalizedStatus?.status === 'failed' && stepIndex === 1) ||
    finalizedStatus?.status === 'dropped' ||
    finalizedStatus?.status === 'rejected'

  // True if the transaction has failed and we are on the last step, because only the last step shows the error message.
  const hasFailed =
    (finalizedStatus?.status === 'failed' ||
      finalizedStatus?.status === 'dropped' ||
      finalizedStatus?.status === 'rejected') &&
    stepIndex === STEPS.length - 1

  const getTitleAppearance = () => {
    if (hasFailed) {
      return 'errorText'
    }
    if (isCompleted) {
      return 'successText'
    }

    return 'primaryText'
  }

  return (
    <View style={[styles.step, style]} testID={testID}>
      <View>
        {isCompleted && !hasFailed && (
          <ConfirmedIcon color={theme.successDecorative} style={styles.icon} />
        )}
        {(isNext || isInitial) && !hasFailed && (
          <View style={[styles.circle, isNext ? styles.nextCircle : {}]} />
        )}
        {hasFailed && (
          <RejectedIcon width={18} height={18} color={theme.errorDecorative} style={styles.icon} />
        )}
        {isCompleted ? (
          <LinearGradient
            style={{
              width: 2,
              flex: 1
            }}
            colors={[
              theme.successDecorative as string,
              (isRedDisplayedInLineGradient
                ? theme.errorDecorative
                : theme.successDecorative) as string
            ]}
            locations={[0.5, 1]}
          />
        ) : (
          <View
            style={{
              width: 2,
              flex: 1,
              borderLeftColor: theme.secondaryBorder,
              borderLeftWidth: 2,
              borderStyle: 'dotted'
            }}
          />
        )}
      </View>
      <View
        style={[
          spacings.plMd,
          flexbox.flex1,
          stepIndex !== STEPS.length - 1
            ? spacings[IS_MOBILE_UP_BENZIN_BREAKPOINT ? 'pb2Xl' : 'pbLg']
            : {}
        ]}
      >
        {!!title && (
          <Text
            appearance={getTitleAppearance()}
            fontSize={16}
            weight="medium"
            style={[styles.title, titleStyle]}
          >
            {title === 'fetching' ? 'Confirmed' : title}
          </Text>
        )}
        {children}
        {!!rows && rows.map((row) => <StepRow {...row} key={row.label} />)}
      </View>
    </View>
  )
}

export default Step
