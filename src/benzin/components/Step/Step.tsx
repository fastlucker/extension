import React from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

import { FinalizedStatusType } from '@benzin/screens/TransactionProgressScreen'
import ConfirmedIcon from '@common/assets/svg/ConfirmedIcon'
import RejectedIcon from '@common/assets/svg/RejectedIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'

import styles from './styles'

const STEPS = ['signed', 'in-progress', 'finalized'] as const

const Step = ({
  title,
  rows,
  stepName,
  activeStep,
  finalizedStatus,
  style,
  titleStyle
}: {
  title: string
  rows?: {
    label: string
    value: string
    isValueSmall?: boolean
  }[]
  stepName: typeof STEPS[number]
  activeStep: typeof STEPS[number]
  finalizedStatus?: FinalizedStatusType
  style?: ViewStyle
  titleStyle?: TextStyle
}) => {
  const { theme } = useTheme()
  const isCompleted = STEPS.indexOf(stepName) <= STEPS.indexOf(activeStep)
  const isNext = STEPS.indexOf(stepName) === STEPS.indexOf(activeStep) + 1
  const isInitial = STEPS.indexOf(stepName) > STEPS.indexOf(activeStep)
  const hasFailed = finalizedStatus && finalizedStatus.status !== 'confirmed'

  const getTextAppearance = () => {
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
      <Text
        appearance={getTextAppearance()}
        fontSize={16}
        weight="medium"
        style={[styles.title, titleStyle]}
      >
        {title}
      </Text>
      {!!rows &&
        rows.map((row) => (
          <View style={styles.row} key={row.label}>
            <Text appearance="secondaryText" fontSize={14}>
              {row.label}
            </Text>
            <Text appearance="secondaryText" fontSize={!row?.isValueSmall ? 14 : 12}>
              {row.value}
            </Text>
          </View>
        ))}
    </View>
  )
}

export default Step
