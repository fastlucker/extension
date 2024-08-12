import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { DappProviderRequest } from '@ambire-common/interfaces/dapp'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import textStyles from '@common/styles/utils/text'
import ManifestImage from '@web/components/ManifestImage'

import getStyles from '../styles'

const DAppConnectHeader = ({
  origin,
  name = 'Unknown dApp',
  icon
}: Partial<DappProviderRequest['session']>) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  return (
    <View style={styles.contentHeader}>
      <Text weight="medium" fontSize={20} style={spacings.mbXl}>
        {t('Connection requested')}
      </Text>
      <ManifestImage
        uri={icon}
        size={56}
        containerStyle={spacings.mbSm}
        fallback={() => <ManifestFallbackIcon width={56} height={56} />}
      />
      <Text style={[spacings.mbMi, textStyles.center]} fontSize={20} weight="semiBold">
        {name}
      </Text>
      <Text style={textStyles.center} fontSize={14} appearance="secondaryText">
        {origin ? new URL(origin).hostname : ''}
      </Text>
    </View>
  )
}

export default DAppConnectHeader
