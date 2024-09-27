import React from 'react'
import { Pressable, View } from 'react-native'

import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'

import getStyles from './styles'

const RouteSteps = () => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  return null
}

export default React.memo(RouteSteps)
