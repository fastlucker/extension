import React, { FC } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

import { FinalizedStatusType } from '@benzin/screens/TransactionProgressScreen'
import ConfirmedIcon from '@common/assets/svg/ConfirmedIcon'
import RejectedIcon from '@common/assets/svg/RejectedIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'

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
}

const Step: FC<StepProps> = ({
  title,
  rows,
  stepName,
  activeStep,
  finalizedStatus,
  style,
  titleStyle
}) => {
  const { theme, styles } = useTheme(getStyles)

  if (!title || !stepName || !activeStep) {
    if (!rows) return null

    return (
      <View style={[styles.step, style]}>
        {rows.map((row) => (
          <StepRow {...row} key={row.label} />
        ))}
      </View>
    )
  }

  const isCompleted = STEPS.indexOf(stepName) <= STEPS.indexOf(activeStep)
  const isNext = STEPS.indexOf(stepName) === STEPS.indexOf(activeStep) + 1
  const isInitial = STEPS.indexOf(stepName) > STEPS.indexOf(activeStep)
  const hasFailed = finalizedStatus && finalizedStatus.status !== 'confirmed'

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
    <View style={[styles.step, isCompleted ? styles.completedStep : {}, style]}>
      {isCompleted && !hasFailed && (
        <ConfirmedIcon color={theme.successDecorative} style={styles.icon} />
      )}
      {(isNext || isInitial) && !hasFailed && (
        <View style={[styles.circle, isNext ? styles.nextCircle : {}]} />
      )}
      {hasFailed && (
        <RejectedIcon width={18} height={18} color={theme.errorDecorative} style={styles.icon} />
      )}
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
      {!!rows && rows.map((row) => <StepRow {...row} key={row.label} />)}
    </View>
  )
}

export default Step
