import React from 'react'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import {
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'

const EmailRegisterScreen = () => {
  const { t } = useTranslation()

  return (
    <>
      <TabLayoutWrapperMainContent>{/* TODO: v2 */}</TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent backgroundType="beta">
        <Text weight="regular" fontSize={16} style={spacings.mb} color={colors.titan}>
          {t(
            'Quickly set up a secure Ambire wallet using your email to enjoy seamless crypto self-custody and management.'
          )}
        </Text>
      </TabLayoutWrapperSideContent>
    </>
  )
}

export default EmailRegisterScreen
