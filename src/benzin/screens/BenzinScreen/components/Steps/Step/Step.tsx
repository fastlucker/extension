import { LinearGradient } from 'expo-linear-gradient'
import React, { FC } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

import { FinalizedStatusType } from '@benzin/screens/BenzinScreen/BenzinScreen'
import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import ConfirmedIcon from '@common/assets/svg/ConfirmedIcon'
import RejectedIcon from '@common/assets/svg/RejectedIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import StepRow from './StepRow'
import getStyles from './styles'

const STEPS = ['signed', 'in-progress', 'finalized'] as const

interface StepProps {
  title?: string
  rows?: {
    label: string
    value: string
    isValueSmall?: boolean
  }[]
  stepName?: typeof STEPS[number]
  activeStep?: typeof STEPS[number]
  finalizedStatus?: FinalizedStatusType
  style?: ViewStyle
  titleStyle?: TextStyle
  children?: React.ReactNode | React.ReactNode[]
}

const Step: FC<StepProps> = ({
  title,
  rows,
  stepName,
  activeStep,
  finalizedStatus,
  style,
  titleStyle,
  children
}) => {
  const { theme, styles } = useTheme(getStyles)

  if (!title || !stepName || !activeStep) {
    if (!rows) return null

    return (
      <View style={[styles.step, spacings.plMd, { flexDirection: 'column' }, style]}>
        {rows.map((row) => (
          <StepRow {...row} key={row.label} />
        ))}
      </View>
    )
  }
  const stepIndex = STEPS.indexOf(stepName)
  const activeStepIndex = STEPS.indexOf(activeStep)
  const isInitial = stepIndex > activeStepIndex
  const isNext = stepIndex === activeStepIndex + 1
  const isCompleted = stepIndex <= activeStepIndex
  // True if the transaction has failed and we are on the second step, because only the second step changes
  // the color of the line to red.
  const hasLastStepFailed =
    finalizedStatus && finalizedStatus.status !== 'confirmed' && stepIndex === 1
  // True if the transaction has failed and we are on the last step, because only the last step shows the error message.
  const hasFailed =
    finalizedStatus &&
    finalizedStatus.status !== 'confirmed' &&
    finalizedStatus.status !== 'fetching' &&
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
    <View style={[styles.step, style]}>
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
              (hasLastStepFailed ? theme.errorDecorative : theme.successDecorative) as string
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
            {title}
          </Text>
        )}
        {children}
        {!!rows && rows.map((row) => <StepRow {...row} key={row.label} />)}
      </View>
    </View>
  )
}

export default Step
