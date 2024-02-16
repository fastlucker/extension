/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback } from 'react'
import { View } from 'react-native'

// @ts-ignore
import CloseIcon from '@common/assets/svg/CloseIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'

// Screen for dApps authorization to connect to extension - will be triggered on dApp connect request
const AddChainScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()

  const handleDenyButtonPress = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }, [t, dispatch])

  return (
    <TabLayoutContainer
      width="full"
      header={<HeaderAccountAndNetworkInfo />}
      footer={
        <>
          <Button
            text={t('Deny')}
            type="danger"
            hasBottomSpacing={false}
            size="large"
            onPress={handleDenyButtonPress}
          >
            <View style={spacings.pl}>
              <CloseIcon color={theme.errorDecorative} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mbLg}>
        <View style={[flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}>
          <Text fontSize={30}>Add Chain Screen</Text>
          <Text fontSize={20}>(coming soon)</Text>
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(AddChainScreen)
