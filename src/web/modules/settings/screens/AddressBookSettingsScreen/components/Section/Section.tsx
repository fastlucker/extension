import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const Section: FC<{
  title: string
  children: ReactNode | ReactNode[]
}> = ({ title, children }) => {
  const { t } = useTranslation()

  return (
    <View style={flexbox.flex1}>
      <Text style={spacings.mbXl} fontSize={20} weight="medium">
        {t(title)}
      </Text>
      {children}
    </View>
  )
}

export default Section
