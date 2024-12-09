import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ScrollableWrapper from '@common/components/ScrollableWrapper'
import useTheme from '@common/hooks/useTheme'
import SectionHeading from '@web/modules/sign-account-op/components/SectionHeading'

import getStyles from '../styles'

const EstimationWrapper = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()

  const { styles } = useTheme(getStyles)
  return (
    <View style={styles.estimationContainer}>
      <SectionHeading>{t('Gas fee estimation')}</SectionHeading>
      <ScrollableWrapper style={styles.estimationScrollView}>{children}</ScrollableWrapper>
    </View>
  )
}

export default EstimationWrapper
