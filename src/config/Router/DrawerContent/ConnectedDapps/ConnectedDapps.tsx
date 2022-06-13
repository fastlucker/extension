import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import ConnectedDAppItem from './ConnectedDAppItem'

const ConnectedDapps = () => {
  const { t } = useTranslation()
  const { sheetRef, isOpen, openBottomSheet, closeBottomSheet } = useBottomSheet()
  const { connections, disconnect } = useWalletConnect()

  const isLegacyWC = ({ bridge }: any) => /https:\/\/bridge.walletconnect.org/g.test(bridge)

  return (
    <>
      <TouchableOpacity onPress={openBottomSheet}>
        <Text style={spacings.mbSm}>{t('Connected dApps')}</Text>
      </TouchableOpacity>
      <BottomSheet
        id="connected-dapps"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
      >
        <View style={[spacings.mbTy, flexboxStyles.alignCenter]}>
          <Title>{t('Connected dApps')}</Title>
        </View>
        {!connections.length && (
          <View style={spacings.mb}>
            <Text style={textStyles.center}>{t('You have no connected dapps!')}</Text>
          </View>
        )}
        {!!connections.length &&
          connections.map(({ session, uri, isOffline }: any, i: nulber) => {
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

export default ConnectedDapps
