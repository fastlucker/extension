import React from 'react'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import {
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'

const EmailLoginScreen = () => {
  const { t } = useTranslation()

  return (
    <>
      <TabLayoutWrapperMainContent>{/* TODO: v2 */}</TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent backgroundType="beta">
        <Text weight="regular" fontSize={16} style={spacings.mb} color={colors.titan}>
          {t(
            'Sign in to your Ambire wallet using your email for a simple and secure access to your crypto assets.'
          )}
        </Text>
      </TabLayoutWrapperSideContent>
    </>
  )
}

export default EmailLoginScreen
