import { FC } from 'react'
import { Image, View } from 'react-native'

import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import colors from '@common/styles/colors'
import { HeaderLeft } from '@web/modules/router/components/TabHeader/TabHeader'

import styles from './styles'

interface Props {
  text: string
  image?: string
  fallbackPrevRoute?: string
  fallbackPrevRouteState?: any
}

const TabHeader: FC<Props> = ({ image, text, fallbackPrevRoute, fallbackPrevRouteState }) => {
  const { navigate } = useNavigation()
  const { params } = useRoute()

  const canGoBack = !!params?.prevRoute

  return (
    <View style={styles.tabheader}>
      <View style={styles.tabheaderInner}>
        <View style={styles.headerLeft}>
          <HeaderLeft
            handleGoBack={() => {
              if (canGoBack) {
                navigate(-1)
                return
              }
              if (!canGoBack && fallbackPrevRoute) {
                navigate(fallbackPrevRoute, {
                  state: fallbackPrevRouteState
                })
              }
            }}
          />
        </View>
        <View style={styles.tabheaderContent}>
          {image && (
            <Image style={{ width: 40, height: 40, borderRadius: 12 }} source={{ uri: image }} />
          )}
          <Text
            style={styles.tabheaderTitle}
            fontSize={20}
            weight="medium"
            color={colors.martinique}
          >
            {text}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default TabHeader
