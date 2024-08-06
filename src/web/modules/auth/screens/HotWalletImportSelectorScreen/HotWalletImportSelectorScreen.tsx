import React from 'react'
import { View } from 'react-native'

import BackButton from '@common/components/BackButton'
import Panel from '@common/components/Panel'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import Card from '../../components/Card'
import options from './options'

const HotWalletImportSelectorScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { navigate } = useNavigation()
  const { isReadyToStoreKeys } = useKeystoreControllerState()

  const onOptionPress = async (flow: string) => {
    if (!isReadyToStoreKeys) {
      navigate(WEB_ROUTES.keyStoreSetup, { state: { flow } })
      return
    }
    if (flow === 'private-key') {
      navigate(WEB_ROUTES.importPrivateKey)
      return
    }
    if (flow === 'seed') {
      navigate(WEB_ROUTES.importSeedPhrase)
    }
    // @TODO: Implement email vault
  }

  return (
    <TabLayoutContainer
      width="lg"
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
      footer={<BackButton fallbackBackRoute={WEB_ROUTES.dashboard} />}
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Select one of the following options')}>
          <View style={[flexbox.directionRow]}>
            {options.map((option, index) => (
              <Card
                testID={option.testID}
                style={index === 1 ? spacings.mh : {}}
                key={option.title}
                title={option.title}
                text={option.text}
                icon={option.image}
                onPress={() => onOptionPress(option.flow)}
                buttonText={option.buttonText}
                isDisabled={option?.isDisabled}
              />
            ))}
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default HotWalletImportSelectorScreen
