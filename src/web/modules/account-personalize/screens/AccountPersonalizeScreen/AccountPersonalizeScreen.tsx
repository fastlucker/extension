import React, { useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import InfoIcon from '@common/assets/svg/InfoIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent,
  TabLayoutWrapperSideContentItem
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import AccountPersonalizeCard from '@web/modules/account-personalize/components/AccountPersonalizeCard'

const AccountPersonalizeScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { stepperState, updateStepperState } = useStepper()
  const { params } = useRoute()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()

  const accounts: Account[] = useMemo(() => params?.accounts || [], [params])

  useEffect(() => {
    if (!accounts) {
      navigate('/')
    }
  }, [navigate, accounts])

  useEffect(() => {
    if (!stepperState?.currentFlow) return

    updateStepperState(WEB_ROUTES.accountPersonalize, stepperState.currentFlow)
  }, [stepperState?.currentFlow, updateStepperState])

  const handleSave = useCallback(() => {
    const newAccPreferences = {}
    accounts.forEach((acc) => {
      newAccPreferences[acc.addr] = {
        label: '', // TODO: Get label from the form
        avatar: '' // TODO: Get avatar from the form
      }
    })

    dispatch({
      type: 'MAIN_CONTROLLER_SETTINGS_ADD_ACCOUNT_PREFERENCES',
      params: newAccPreferences
    })

    // TODO: Enable back when the above gets implemented
    // navigate('/')
  }, [accounts, dispatch])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header mode="custom-inner-content" withAmbireLogo />}
      footer={
        <>
          <BackButton />
          <Button onPress={handleSave} hasBottomSpacing={false} text={t('Save and Continue')}>
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Personalize Your Accounts')} style={{ maxHeight: '100%' }}>
          <Wrapper style={spacings.mb0} contentContainerStyle={[spacings.pl0, spacings.pt0]}>
            {accounts.map((acc, i) => (
              <AccountPersonalizeCard
                key={acc.addr}
                account={acc}
                hasBottomSpacing={i !== accounts.length - 1}
              />
            ))}
          </Wrapper>
        </Panel>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent>
        <TabLayoutWrapperSideContentItem>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbSm]}>
            <InfoIcon color={theme.infoText} style={spacings.mrTy} />
            <Text fontSize={20} appearance="infoText" weight="medium">
              {t('Account personalization')}
            </Text>
          </View>
          <Text fontSize={16} style={[spacings.mbXl]} appearance="infoText">
            {t(
              'The account label is any arbitrary label that you choose. Both the label and the avatar are only local and for own organizational purposes - none of this will be uploaded on the blockchain or anywhere else.'
            )}
          </Text>
        </TabLayoutWrapperSideContentItem>
      </TabLayoutWrapperSideContent>
    </TabLayoutContainer>
  )
}

export default React.memo(AccountPersonalizeScreen)
