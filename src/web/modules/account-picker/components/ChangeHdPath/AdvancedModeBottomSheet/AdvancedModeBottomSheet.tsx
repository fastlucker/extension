import React, { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, TextInput, View } from 'react-native'
import { Modalize } from 'react-native-modalize'

import CloseIcon from '@common/assets/svg/CloseIcon'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

const HD_PATH_OPTIONS = [
  {
    label: 'BIP44',
    value: 'bip44',
    description: 'BIP44 Standard: HDpath defined by the BIP44 protocol.'
  },
  { label: 'Ledger Live', value: 'ledgerLive', description: '' },
  { label: 'Ledger Legacy', value: 'ledgerLegacy', description: '' }
]

type Props = {
  sheetRef: React.RefObject<Modalize>
  closeBottomSheet: () => void
  onConfirm: (hdPath: string, startIndex: number) => void
}

const CustomHDPathBottomSheet: FC<Props> = ({ sheetRef, closeBottomSheet, onConfirm }) => {
  const [selectedPath, setSelectedPath] = useState('bip44')
  const [startIndex, setStartIndex] = useState('1')
  const { theme } = useTheme()
  const { t } = useTranslation()

  const closeBottomSheetWrapped = useCallback(() => {
    closeBottomSheet()
  }, [closeBottomSheet])

  const handleConfirm = () => {
    const parsed = parseInt(startIndex, 10)
    if (parsed >= 1 && parsed <= 50) {
      onConfirm(selectedPath, parsed)
      closeBottomSheetWrapped()
    } else {
      alert('Please select a number from 1 to 50.')
    }
  }

  return (
    <BottomSheet
      type="modal"
      id="custom-hd-path"
      sheetRef={sheetRef}
      closeBottomSheet={closeBottomSheetWrapped}
      backgroundColor="primaryBackground"
      style={{ ...spacings.ph0, ...spacings.pv0, width: 672 }}
    >
      <View
        style={[
          flexbox.justifySpaceBetween,
          flexbox.directionRow,
          flexbox.alignCenter,
          spacings.phMd,
          spacings.pvMd,
          {
            backgroundColor: theme.secondaryBackground,
            borderTopEndRadius: 6,
            borderTopStartRadius: 6
          }
        ]}
      >
        <Text fontSize={20} weight="semiBold">
          {t('Custom address HD path')}
        </Text>
        <CloseIcon />
      </View>
      <View style={[spacings.phMd, spacings.pt2Xl, spacings.pbMd]}>
        <Text style={[spacings.mbTy]}>{t('Select HD path')}:</Text>
        <View
          style={[
            flexbox.directionRow,
            flexbox.wrap,
            flexbox.flex1,
            flexbox.justifySpaceBetween,
            spacings.mbTy
          ]}
        >
          {HD_PATH_OPTIONS.map((option) => {
            const isActive = selectedPath === option.value
            return (
              <Pressable
                key={option.value}
                onPress={() => setSelectedPath(option.value)}
                style={[
                  flexbox.center,
                  flexbox.directionRow,
                  common.borderRadiusPrimary,
                  { width: 200, height: 56 },
                  {
                    backgroundColor: isActive
                      ? `${String(theme.primary)}14`
                      : theme.secondaryBackground
                  }
                ]}
              >
                <Text
                  fontSize={16}
                  weight="medium"
                  color={isActive ? theme.primary : theme.secondaryText}
                >
                  {option.label}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {!!HD_PATH_OPTIONS.find((o) => o.value === selectedPath)?.description && (
          <Text fontSize={14} appearance="secondaryText" style={[spacings.mb2Xl]}>
            {HD_PATH_OPTIONS.find((o) => o.value === selectedPath)?.description}
          </Text>
        )}

        <Text fontSize={12} weight="medium" style={[spacings.mbSm]}>
          Select the serial number of address to start from:
        </Text>
        <TextInput
          value={startIndex}
          onChangeText={setStartIndex}
          keyboardType="numeric"
          placeholder="1"
          //   style={tw`border rounded-md px-3 py-2 text-base mb-1`}
        />
        <Text fontSize={12} appearance="secondaryText" style={spacings.mbSm}>
          Manage address from 1 to 50
        </Text>

        <Button text="Confirm" onPress={handleConfirm} />
      </View>
    </BottomSheet>
  )
}

export default React.memo(CustomHDPathBottomSheet)
