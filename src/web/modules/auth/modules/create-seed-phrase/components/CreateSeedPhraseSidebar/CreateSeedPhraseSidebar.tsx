import React, { FC } from 'react'
import { View } from 'react-native'

import CheckedListIcon from '@common/assets/svg/CheckedListIcon'
import CheckIcon from '@common/assets/svg/CheckIcon'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import HiddenListIcon from '@common/assets/svg/HiddenListIcon'
import PenIcon from '@common/assets/svg/PenIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings, { SPACING_MD } from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

// @TODO: Add proper icons
const SIDEBAR_STEPS = [
  {
    id: 'prepare',
    text: 'Prepare a pen and\na piece of paper',
    icon: PenIcon
  },
  {
    id: 'write',
    text: 'Write down and secure\nthe seed phrase',
    icon: HiddenListIcon
  },
  {
    id: 'confirm',
    text: 'Confirm your\nseed phrase',
    icon: CheckedListIcon
  }
]

interface Props {
  currentStepId: 'prepare' | 'write' | 'confirm'
}

const CreateSeedPhraseSidebar: FC<Props> = ({ currentStepId }) => {
  const { theme } = useTheme()
  const currentStepIndex = SIDEBAR_STEPS.findIndex(({ id }) => id === currentStepId)

  return (
    <View style={[spacings.pt, spacings.plXl]}>
      {SIDEBAR_STEPS.map(({ icon: Icon, text, id }, index) => {
        const isCurrent = currentStepId === id

        return (
          <View key={id} style={flexbox.alignCenter}>
            <View
              style={[
                flexbox.directionRow,
                flexbox.alignCenter,
                spacings.pv2Xl,
                spacings.pr3Xl,
                common.borderRadiusPrimary,
                {
                  backgroundColor: theme.primaryBackground,
                  borderWidth: 1,
                  borderColor: isCurrent ? theme.primary : theme.secondaryBorder,
                  paddingLeft: SPACING_MD * 2,
                  width: '100%',
                  opacity: isCurrent ? 1 : 0.5
                }
              ]}
            >
              {currentStepIndex > index && (
                <CheckIcon
                  style={{
                    position: 'absolute',
                    left: 4,
                    top: 4
                  }}
                  width={18}
                  height={18}
                />
              )}
              <Text
                style={{
                  marginRight: SPACING_MD * 2,
                  width: 30,
                  opacity: isCurrent ? 1 : 0.6
                }}
                fontSize={48}
                weight="semiBold"
                appearance="secondaryText"
              >
                {index + 1}
              </Text>
              <Icon
                color={isCurrent ? theme.primary : theme.secondaryText}
                width={48}
                height={48}
                style={spacings.mr}
              />
              <Text fontSize={14} weight="medium">
                {text}
              </Text>
            </View>
            {index !== SIDEBAR_STEPS.length - 1 && (
              <DownArrowIcon
                color={theme.primaryBorder}
                style={[
                  spacings.mvSm,
                  {
                    opacity: isCurrent ? 1 : 0.3
                  }
                ]}
                width={16}
                height={8}
              />
            )}
          </View>
        )
      })}
    </View>
  )
}

export default CreateSeedPhraseSidebar
