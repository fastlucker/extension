import React, { FC } from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { ActiveStepType } from '@benzin/screens/BenzinScreen/interfaces/steps'
import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '@benzin/screens/BenzinScreen/styles'
import AmbireLogo from '@common/assets/svg/AmbireLogoWithText'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import { StepsData } from '../Steps/hooks/useSteps'
import getStyles from './styles'

interface Props {
  activeStep: ActiveStepType
  network: NetworkDescriptor
  stepsState: StepsData
}

const Header: FC<Props> = ({ activeStep, network, stepsState }) => {
  const { styles } = useTheme(getStyles)
  const { pendingTime } = stepsState

  return (
    <>
      <View
        style={[
          IS_MOBILE_UP_BENZIN_BREAKPOINT
            ? {}
            : { flexDirection: 'row-reverse', ...flexbox.justifySpaceBetween },
          IS_MOBILE_UP_BENZIN_BREAKPOINT ? {} : spacings.mbXl,
          flexbox.alignCenter
        ]}
      >
        <View style={styles.logoWrapper}>
          <AmbireLogo
            width={148 / (IS_MOBILE_UP_BENZIN_BREAKPOINT ? 1 : 1.8)}
            height={69 / (IS_MOBILE_UP_BENZIN_BREAKPOINT ? 1 : 1.8)}
          />
        </View>
        <Text
          fontSize={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 18}
          weight="medium"
          style={[
            activeStep === 'finalized' && IS_MOBILE_UP_BENZIN_BREAKPOINT ? spacings.mb3Xl : {},
            IS_MOBILE_UP_BENZIN_BREAKPOINT ? { textAlign: 'center' } : { marginLeft: -8 }
          ]}
        >
          Transaction Progress
        </Text>
      </View>
      {activeStep === 'in-progress' ? (
        <View style={styles.estimate}>
          <Text appearance="secondaryText" fontSize={14}>
            {/* TODO: FIX estimated time */}
            Est time remaining {pendingTime === 30 ? 30 : 5}{' '}
            {pendingTime === 30 ? 'seconds' : 'minutes'} on
          </Text>
          {/* @ts-ignore */}
          <NetworkIcon name={network.id} />
          <Text appearance="secondaryText" fontSize={14}>
            {network.name}
          </Text>
        </View>
      ) : null}
    </>
  )
}

export default Header
