import React from 'react'
import { View } from 'react-native'

import AmbireLogo from '@common/assets/svg/AmbireLogoWithText'
import BackButton from '@common/components/BackButton'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'

import TermsComponent from '../../components'
import styles from './styles'

export const TERMS_VERSION = '1.0.0'

const Terms = () => {
  const { t } = useTranslation()
  const { params } = useRoute()
  const { navigate, goBack } = useNavigation()

  return (
    <TabLayoutContainer
      width="md"
      header={
        <View style={[flexbox.alignCenter, spacings.mtLg]}>
          <AmbireLogo style={styles.logo} width={185} height={92} />
          <Text fontSize={32} weight="regular" style={[{ textAlign: 'center' }, spacings.mbXl]}>
            {t('Terms Of Service')}
          </Text>
        </View>
      }
      footer={
        <BackButton
          onPress={() => {
            if (params?.storyIndex) {
              navigate('get-started', { state: { storyIndex: params?.storyIndex } })
            } else {
              goBack()
            }
          }}
        />
      }
    >
      <TabLayoutWrapperMainContent
        showsVerticalScrollIndicator
        style={spacings.mbLg}
        contentContainerStyle={{ ...spacings.ph2Xl, ...spacings.pt0 }}
      >
        <TermsComponent />
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(Terms)
