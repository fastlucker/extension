import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'

const Header: FC = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const openHelpCenter = useCallback(
    () => openInTab('https://help.ambire.com/hc/en-us/requests/new', false),
    []
  )
  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.justifySpaceBetween,
        spacings.mbSm,
        spacings.pbTy,
        {
          backgroundColor: theme.primaryBackground
        }
      ]}
    >
      <Text fontSize={20} weight="medium" color={theme.primaryText}>
        {t('Portfolio errors')}
      </Text>
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <Text fontSize={14} weight="medium" appearance="secondaryText" style={spacings.mrSm}>
          {t('Experiencing frequent issues?')}
        </Text>
        <Pressable onPress={openHelpCenter}>
          <Text
            fontSize={14}
            weight="medium"
            color={theme.primary}
            style={{
              textDecorationColor: theme.primary,
              textDecorationLine: 'underline'
            }}
          >
            {t('Submit a ticket')}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default React.memo(Header)
