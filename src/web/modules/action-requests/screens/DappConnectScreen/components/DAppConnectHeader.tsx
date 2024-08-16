import React, { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Dapp, DappProviderRequest } from '@ambire-common/interfaces/dapp'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import textStyles from '@common/styles/utils/text'
import ManifestImage from '@web/components/ManifestImage'
import useDappsControllerState from '@web/hooks/useDappsControllerState'

import getStyles from '../styles'
import TrustedIcon from './TrustedIcon'

type Props = Partial<DappProviderRequest['session']> & {
  isSmall: boolean
}

const DAppConnectHeader: FC<Props> = ({ origin, name = 'Unknown dApp', icon, isSmall }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const { state } = useDappsControllerState()
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
    if (!isSmall)
      return {
        ...spacings.phXl,
        ...spacings.pvXl
      }

    return {
      ...spacings.phXl,
      ...spacings.pvLg
    }
  }, [isSmall])

  return (
    <View style={[styles.contentHeader, spacingsStyle]}>
      <Text
        weight="medium"
        fontSize={isSmall ? 18 : 20}
        style={isSmall ? spacings.mbLg : spacings.mbXl}
      >
        {t('Connection requested')}
      </Text>
      <View>
        <ManifestImage
          uri={icon}
          size={isSmall ? 48 : 56}
          containerStyle={isSmall ? spacings.mbTy : spacings.mbSm}
          fallback={() => (
            <ManifestFallbackIcon width={isSmall ? 48 : 56} height={isSmall ? 48 : 56} />
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
        style={[!isSmall && spacings.mbMi, textStyles.center, common.fullWidth]}
        fontSize={isSmall ? 18 : 20}
        weight="semiBold"
      >
        {name}
      </Text>
      <Text style={textStyles.center} fontSize={14} appearance="secondaryText">
        {hostname}
      </Text>
    </View>
  )
}

export default React.memo(DAppConnectHeader)
