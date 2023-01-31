import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import TransferIcon from '@assets/svg/TransferIcon'
import BottomSheet from '@modules/common/components/BottomSheet'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAmbireExtension from '@modules/common/hooks/useAmbireExtension'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import ConnectedWeb3DAppItem from './ConnectedWeb3DAppItem'

const ConnectedDapps = ({ isIcon = false }: { isIcon?: boolean }) => {
  const { t } = useTranslation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { connectedDapps, disconnectDapp } = useAmbireExtension()

  return (
    <>
      <TouchableOpacity onPress={openBottomSheet}>
        {!!isIcon && (
          <View style={[flexboxStyles.alignCenter, flexboxStyles.justifyCenter]}>
            <TransferIcon />
            <Text fontSize={9}>{t('dApps')}</Text>
          </View>
        )}
        {!isIcon && (
          <Text style={spacings.mbSm} color={colors.titan_50}>
            {t('Connected dApps')}
          </Text>
        )}
      </TouchableOpacity>
      <BottomSheet id="connected-dapps" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
        <Title style={[textStyles.center, spacings.mt]}>{t('Connected dApps')}</Title>

        {!connectedDapps.length && (
          <View style={spacings.mb}>
            <Text style={textStyles.center}>
              {t(
                "You have no connected dApps. To connect, find and click the connect button on the dApp's webpage."
              )}
            </Text>
          </View>
        )}
        {!!connectedDapps.length &&
          connectedDapps.map(({ origin, name, isConnected }, i: number) => {
            return (
              <ConnectedWeb3DAppItem
                key={origin}
                name={name}
                origin={origin}
                isConnected={isConnected}
                disconnectDapp={disconnectDapp}
                isLast={connectedDapps.length - 1 === i}
              />
            )
          })}
      </BottomSheet>
    </>
  )
}

export default React.memo(ConnectedDapps)
