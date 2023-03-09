import unsupportedDApps from 'ambire-common/src/constants/unsupportedDApps'
import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { Linking, TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import { Trans, useTranslation } from '@common/config/localization'
import useStorage from '@common/hooks/useStorage'
import useWalletConnect from '@common/hooks/useWalletConnect'
import colors from '@common/styles/colors'
import spacings, { IS_SCREEN_SIZE_S } from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

import { UnsupportedDAppsBottomSheetContextReturnType } from './types'
import UnsupportedDAppItem from './UnsupportedDAppItem'

const UnsupportedDAppsBottomSheetContext =
  createContext<UnsupportedDAppsBottomSheetContextReturnType>({
    closeBottomSheet: () => {}
  })

const numOfItemsWhenNotExpanded = IS_SCREEN_SIZE_S ? 1 : 2

const UnsupportedDAppsBottomSheetProvider: React.FC<any> = ({ children }) => {
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const { connections, disconnect } = useWalletConnect()
  const { t } = useTranslation()
  const [advancedMode, setAdvancedMode] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const [advancedModeList, setAdvancedModeList] = useStorage<string[]>({
    key: 'dAppsAdvancedMode',
    defaultValue: []
  })

  const unsupportedRaw = useMemo(
    () =>
      connections.filter(
        ({ session }) =>
          session &&
          session.peerMeta &&
          unsupportedDApps.includes(session.peerMeta?.url) &&
          !advancedModeList?.includes(session.peerMeta?.url)
      ),
    [connections, advancedModeList]
  )

  const unsupported = useMemo(() => {
    if (unsupportedRaw.length > numOfItemsWhenNotExpanded) {
      return isExpanded ? unsupportedRaw : unsupportedRaw.slice(0, numOfItemsWhenNotExpanded)
    }

    return unsupportedRaw
  }, [unsupportedRaw, isExpanded])

  const handleCancel = useCallback(() => {
    if (!advancedMode) {
      unsupportedRaw.map(({ uri }) => disconnect(uri))
    }
  }, [unsupportedRaw, disconnect, advancedMode])

  const handleContinue = useCallback(() => {
    setAdvancedModeList([
      ...(advancedModeList || []),
      ...unsupportedRaw.map(({ session }) => session.peerMeta.url)
    ])
    closeBottomSheet()
  }, [advancedModeList, setAdvancedModeList, unsupportedRaw, closeBottomSheet])

  const toggleItemsList = () => {
    setIsExpanded((prev) => !prev)
  }

  const unsupportedRawLength = useMemo(() => unsupportedRaw.length, [unsupportedRaw.length])
  const prevUnsupportedRawLength = usePrevious(unsupportedRawLength)

  useEffect(() => {
    if (!prevUnsupportedRawLength && unsupportedRawLength) {
      openBottomSheet()
    }
  }, [unsupportedRawLength, prevUnsupportedRawLength, openBottomSheet])

  return (
    <UnsupportedDAppsBottomSheetContext.Provider
      value={useMemo(() => ({ closeBottomSheet }), [closeBottomSheet])}
    >
      {children}
      <BottomSheet
        id="unsupportedDAppsBottomSheet"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        onClosed={handleCancel}
      >
        <View style={[spacings.mbTy, flexboxStyles.alignCenter]}>
          <Title>{t('Unsupported dApps')}</Title>
        </View>
        <Text fontSize={12} style={spacings.mbTy}>
          {t('These dApps do not fully support smart wallets and/or WalletConnect:')}
        </Text>
        <View>
          {unsupported.map(({ session }, i) => (
            <UnsupportedDAppItem
              // eslint-disable-next-line react/no-array-index-key
              key={`dapp-${i}`}
              name={session.peerMeta?.name}
              icon={session.peerMeta?.icons?.[0]}
              url={session.peerMeta?.url}
            />
          ))}
          {unsupportedRaw.length > numOfItemsWhenNotExpanded && (
            <TouchableOpacity
              style={flexboxStyles.alignCenter}
              hitSlop={{ top: 5, bottom: 5 }}
              onPress={toggleItemsList}
            >
              <Text fontSize={12}>{isExpanded ? t('See less') : t('See more...')}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[spacings.pbMd, spacings.ptSm]}>
          <Trans>
            <Text>
              <Text fontSize={12}>
                {'For more information on why these dApps do not support Ambire, please read this '}
              </Text>
              <Text
                fontSize={12}
                onPress={() =>
                  Linking.openURL(
                    'https://help.ambire.com/hc/en-us/articles/4415496135698-Which-dApps-are-supported-by-Ambire-Wallet-'
                  )
                }
                color={colors.heliotrope}
                underline
              >
                article
              </Text>
              <Text fontSize={12}>.</Text>
            </Text>
          </Trans>
        </View>
        <View style={spacings.mbSm}>
          <Text weight="medium" fontSize={16} style={spacings.mbSm}>
            {t('Advanced mode:')}
          </Text>
          <Checkbox
            value={advancedMode}
            onValueChange={() => setAdvancedMode(!advancedMode)}
            label={t("I know what I'm doing and I accept the risks")}
          />
        </View>
        <Button onPress={handleContinue} text={t('Continue')} disabled={!advancedMode} />
      </BottomSheet>
    </UnsupportedDAppsBottomSheetContext.Provider>
  )
}

export { UnsupportedDAppsBottomSheetContext, UnsupportedDAppsBottomSheetProvider }
