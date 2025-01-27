import React, { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Dapp, DappProviderRequest } from '@ambire-common/interfaces/dapp'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING_SM, SPACING_XL } from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import textStyles from '@common/styles/utils/text'
import ManifestImage from '@web/components/ManifestImage'
import useDappsControllerState from '@web/hooks/useDappsControllerState'

import getStyles from '../styles'
import TrustedIcon from './TrustedIcon'

type Props = Partial<DappProviderRequest['session']> & {
  responsiveSizeMultiplier: number
}

const DAppConnectHeader: FC<Props> = ({
  origin,
  name = 'Unknown App',
  icon,
  responsiveSizeMultiplier
}) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const { state } = useDappsControllerState()
  const { minHeightSize } = useWindowSize()
  // When the user connects to a dApp, the dApp is added to the list of dApps.
  // If we don't use the initial list of dApps to determine if a dApp is trusted,
  // the dApp will be marked as trusted for a split second before the window closes.
  const [initialDappsList, setInitialDappsList] = useState<Dapp[]>([])

  const hostname = origin ? new URL(origin).hostname : ''

  useEffect(() => {
    if (!initialDappsList.length && state.dapps.length) {
      setInitialDappsList(state.dapps)
    }
  }, [initialDappsList, state.dapps])

  const isDAppTrusted = useMemo(() => {
    if (!hostname) return false

    return initialDappsList.some((dapp) => dapp.url.includes(hostname))
  }, [hostname, initialDappsList])

  const spacingsStyle = useMemo(() => {
    return {
      paddingHorizontal: SPACING_XL * responsiveSizeMultiplier,
      paddingVertical: SPACING_XL * responsiveSizeMultiplier
    }
  }, [responsiveSizeMultiplier])

  return (
    <View style={[styles.contentHeader, spacingsStyle]}>
      <Text
        weight="medium"
        fontSize={responsiveSizeMultiplier * 20}
        style={{
          marginBottom: SPACING_XL * responsiveSizeMultiplier
        }}
      >
        {t('Connection requested')}
      </Text>
      <View>
        <ManifestImage
          uri={icon}
          size={responsiveSizeMultiplier * 56}
          containerStyle={{
            marginBottom: SPACING_SM * responsiveSizeMultiplier
          }}
          fallback={() => (
            <ManifestFallbackIcon
              width={responsiveSizeMultiplier * 56}
              height={responsiveSizeMultiplier * 56}
            />
          )}
        />

        {isDAppTrusted && (
          <View
            style={{
              position: 'absolute',
              right: -8,
              top: -2,
              width: 24,
              height: 24
            }}
          >
            <TrustedIcon />
          </View>
        )}
      </View>
      <Text
        style={[!minHeightSize('m') && spacings.mbMi, textStyles.center, common.fullWidth]}
        fontSize={responsiveSizeMultiplier * 20}
        weight="semiBold"
      >
        {name}
      </Text>
      <Text
        style={textStyles.center}
        fontSize={14 * responsiveSizeMultiplier}
        appearance="secondaryText"
      >
        {hostname}
      </Text>
    </View>
  )
}

export default React.memo(DAppConnectHeader)
