/* eslint-disable react/prop-types */
import React, { FC, useEffect, useMemo } from 'react'
import { useModalize } from 'react-native-modalize'
import { v4 as uuidv4 } from 'uuid'

import BottomSheet from '@common/components/BottomSheet'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { getUiType } from '@web/utils/uiType'

import { RenderSelectedOptionParams } from '../types'

const { isPopup } = getUiType()

type Props = Pick<RenderSelectedOptionParams, 'isMenuOpen' | 'toggleMenu'> & {
  children: React.ReactNode
}

const BottomSheetContainer: FC<Props> = ({ isMenuOpen, toggleMenu, children }) => {
  const { theme } = useTheme()
  const { ref: sheetRef, open: openSheet, close: closeSheet } = useModalize()

  // Ensure bottom sheet ID is unique per component to avoid duplicates when multiple are rendered
  const id = useMemo(() => `select-bottom-sheet-${uuidv4()}`, [])

  useEffect(() => {
    if (isMenuOpen) {
      openSheet()
    } else {
      closeSheet()
    }
  }, [isMenuOpen, openSheet, closeSheet])

  return (
    <BottomSheet
      id={id}
      sheetRef={sheetRef}
      closeBottomSheet={toggleMenu}
      containerInnerWrapperStyles={{
        flex: 1
      }}
      style={{
        backgroundColor: theme.primaryBackground,
        width: isPopup ? '100%' : 450,
        overflow: 'hidden',
        ...spacings.pv0,
        ...spacings.ph0
      }}
      isScrollEnabled={false}
    >
      {children}
    </BottomSheet>
  )
}

export default React.memo(BottomSheetContainer)
