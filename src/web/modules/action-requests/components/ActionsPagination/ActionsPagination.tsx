import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useActionsControllerState from '@web/hooks/useActionsControllerState'

const ActionsPagination = () => {
  const state = useActionsControllerState()
  const { t } = useTranslation()

  const currentActionIndex = useMemo(() => {
    if (!state.currentAction) return undefined

    const idx = state.actionsQueue.findIndex((a) => a.id === state.currentAction.id)

    if (idx === -1) return undefined

    return idx + 1
  }, [state])

  if (state?.actionsQueue?.length <= 1) return null

  return (
    <>
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          flexbox.flex1,
          spacings.ph,
          flexbox.justifyCenter
        ]}
      >
        <TouchableOpacity
          style={{ opacity: 0.4 }}
          dataSet={{
            tooltipId: 'coming-soon',
            tooltipContent: 'Coming soon'
          }}
        >
          <View style={flexbox.directionRow}>
            <LeftArrowIcon />
            <LeftArrowIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[spacings.ml, { opacity: 0.4 }]}
          dataSet={{
            tooltipId: 'coming-soon',
            tooltipContent: 'Coming soon'
          }}
        >
          <View style={flexbox.directionRow}>
            <LeftArrowIcon />
          </View>
        </TouchableOpacity>
        <Text fontSize={14} appearance="primary" underline style={[text.center, spacings.mh]}>
          {t('Request {{currentActionIndex}} out of {{numberOfAllActions}}', {
            currentActionIndex,
            numberOfAllActions: state.actionsQueue.length
          })}
        </Text>
        <TouchableOpacity
          style={[spacings.mr, { opacity: 0.4 }]}
          dataSet={{
            tooltipId: 'coming-soon',
            tooltipContent: 'Coming soon'
          }}
        >
          <View style={flexbox.directionRow}>
            <RightArrowIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ opacity: 0.4 }}
          dataSet={{
            tooltipId: 'coming-soon',
            tooltipContent: 'Coming soon'
          }}
        >
          <View style={flexbox.directionRow}>
            <RightArrowIcon />
            <RightArrowIcon />
          </View>
        </TouchableOpacity>
      </View>

      <Tooltip id="coming-soon" />
    </>
  )
}

export default React.memo(ActionsPagination)
