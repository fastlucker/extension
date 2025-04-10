import React, { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { Modalize } from 'react-native-modalize'

import { DerivationOption } from '@ambire-common/consts/derivation'
import CloseIcon from '@common/assets/svg/CloseIcon'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

type Props = {
  sheetRef: React.RefObject<Modalize>
  closeBottomSheet: () => void
  onConfirm: (hdPath: SelectValue, startIndex: number) => void
  disabled?: boolean
  page?: number
  options: DerivationOption[]
  value: SelectValue
}

const CustomHDPathBottomSheet: FC<Props> = ({
  sheetRef,
  closeBottomSheet,
  onConfirm,
  disabled,
  page,
  options,
  value
}) => {
  const [selectedOption, setSelectedOption] = useState(value)
  const [startIndex, setStartIndex] = useState(String(page || 1))
  const { theme } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    setSelectedOption(value)
  }, [value])

  const closeBottomSheetWrapped = useCallback(() => {
    closeBottomSheet()
  }, [closeBottomSheet])

  const handleConfirm = () => {
    const parsed = parseInt(startIndex, 10)
    // TODO: shouldn't be hardcoded
    if (parsed >= 1 && parsed <= 50) {
      onConfirm(selectedOption, parsed)
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
        <Pressable onPress={closeBottomSheetWrapped} style={[flexbox.center, spacings.pvTy]}>
          {({ hovered }: any) => (
            <View style={[hovered && { backgroundColor: theme.secondaryBackground }]}>
              <CloseIcon />
            </View>
          )}
        </Pressable>
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
          {options.map((option) => {
            const isActive = selectedOption.value === option.value

            return (
              <Pressable
                key={option.value}
                onPress={() => setSelectedOption(option)}
                disabled={disabled}
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

        {!!options.find((o) => o.value === selectedOption.value)?.description && (
          <Text fontSize={14} appearance="secondaryText" style={[spacings.mb2Xl]}>
            {options.find((o) => o.value === selectedOption.value)?.description}
          </Text>
        )}
        <View style={[spacings.mb2Xl]}>
          <Text fontSize={12} weight="medium" style={[spacings.mbSm]}>
            {t('Select the serial number of address to start from')}:
          </Text>
          <Input value={startIndex} onChangeText={setStartIndex} keyboardType="numeric" />
          <Text fontSize={12} appearance="secondaryText" style={spacings.mbSm}>
            {/* TODO: shouldn't be hardcoded */}
            {t('Manage address from 1 to 50')}
          </Text>
        </View>
        <View style={[flexbox.directionRow, flexbox.center]}>
          <Button style={{ width: '50%' }} text={t('Confirm')} onPress={handleConfirm} />
        </View>
      </View>
    </BottomSheet>
  )
}

export default React.memo(CustomHDPathBottomSheet)
