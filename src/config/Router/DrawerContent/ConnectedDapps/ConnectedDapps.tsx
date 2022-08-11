import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@modules/common/components/BottomSheet'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import ConnectedDAppItem from './ConnectedDAppItem'

const ConnectedDapps = () => {
  const { t } = useTranslation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { connections, disconnect } = useWalletConnect()

  const isLegacyWC = ({ bridge }: any) => /https:\/\/bridge.walletconnect.org/g.test(bridge)

  return (
    <>
      <TouchableOpacity onPress={openBottomSheet}>
        <Text style={spacings.mbSm} color={colors.titan_50}>
          {t('Connected dApps')}
        </Text>
      </TouchableOpacity>
      <BottomSheet id="connected-dapps" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
        <View style={[spacings.mbTy, flexboxStyles.alignCenter]}>
          <Title>{t('Connected dApps')}</Title>
        </View>
        {!connections.length && (
          <View style={spacings.mb}>
            <Text style={textStyles.center}>{t('You have no connected dapps!')}</Text>
          </View>
        )}
        {!!connections.length &&
          connections.map(({ session, uri, isOffline }: any, i: number) => {
            const icon = session?.peerMeta?.icons?.filter(
              (x: any) => !x?.endsWith('favicon.ico')
            )[0]

            return (
              <ConnectedDAppItem
                key={session.key}
                name={session.peerMeta?.name}
                icon={icon}
                url={session.peerMeta?.url}
                isLegacy={isLegacyWC(session)}
                isOffline={isOffline}
                disconnect={disconnect}
                uri={uri}
                isLast={connections.length - 1 === i}
              />
            )
          })}
      </BottomSheet>
    </>
  )
}

export default React.memo(ConnectedDapps)
