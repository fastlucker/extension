import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@modules/common/components/BottomSheet'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useWalletConnect from '@modules/common/hooks/useWalletConnect'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

import ConnectedDAppItem from './ConnectedDAppItem'

const ConnectedDapps = () => {
  const { t } = useTranslation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { connections, disconnect, handleConnect } = useWalletConnect()
  const [connectDapp, setConnectDapp] = useState('')
  const isLegacyWC = ({ bridge }: any) => /https:\/\/bridge.walletconnect.org/g.test(bridge)

  return (
    <>
      <TouchableOpacity onPress={openBottomSheet}>
        <Text style={spacings.mbSm} color={colors.titan_50}>
          {t('Connected dApps')}
        </Text>
      </TouchableOpacity>
      <BottomSheet id="connected-dapps" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
        <Title style={textStyles.center}>{t('Connected dApps')}</Title>

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

        {/* TODO: this should be temporarily here until we have a better design for adding a new dapp by pasting WC URL */}
        {/* Clipboard listener can be implemented on a global level in the app too */}
        <View style={spacings.pt}>
          <Input
            label="Connect dApp"
            placeholder="wc:..."
            onChangeText={(text: string) => {
              return setConnectDapp(text)
            }}
            value={connectDapp}
          />
          <Button
            text="Connect"
            onPress={() => {
              handleConnect(connectDapp)
              setConnectDapp('')
            }}
            disabled={!connectDapp}
          />
        </View>
      </BottomSheet>
    </>
  )
}

export default React.memo(ConnectedDapps)
