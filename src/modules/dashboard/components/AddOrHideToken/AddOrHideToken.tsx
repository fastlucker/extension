import { Token } from 'ambire-common/src/hooks/usePortfolio'
import React, { useState } from 'react'
import { LayoutAnimation, TouchableOpacity, View } from 'react-native'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Segments from '@modules/common/components/Segments'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import { triggerLayoutAnimation } from '@modules/common/services/layoutAnimation'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import AddOrHideTokenForm from './AddOrHideTokenForm'
import { MODES } from './constants'
import HiddenTokens from './HiddenTokens'
import styles from './styles'

const segments = [{ value: MODES.ADD_TOKEN }, { value: MODES.HIDE_TOKEN }]

const AddOrHideToken = () => {
  const { t } = useTranslation()
  const { onAddExtraToken, onAddHiddenToken } = usePortfolio()
  const { sheetRef, isOpen, openBottomSheet, closeBottomSheet } = useBottomSheet()
  const [formType, setFormType] = useState<MODES>(MODES.ADD_TOKEN)

  const handleOnSubmit = (token: Token, formMode: MODES) => {
    const cases: { [key in MODES]: () => void } = {
      [MODES.ADD_TOKEN]: () => {
        onAddExtraToken(token)
        closeBottomSheet()
      },
      [MODES.HIDE_TOKEN]: () => {
        onAddHiddenToken(token)
        closeBottomSheet()
      }
    }

    return cases[formMode]()
  }

  return (
    <>
      <TouchableOpacity style={[styles.btnContainer, spacings.mbTy]} onPress={openBottomSheet}>
        <Text fontSize={16}>{t('Add or Hide Token')}</Text>
      </TouchableOpacity>

      <BottomSheet
        id="add-token"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
        dynamicInitialHeight={false}
      >
        <Segments
          defaultValue={formType}
          segments={segments}
          onChange={(value: MODES) => {
            setFormType(value)
            triggerLayoutAnimation({
              forceAnimate: true,
              config: LayoutAnimation.create(300, 'linear', 'opacity')
            })
          }}
          fontSize={14}
        />
        <View style={[flexboxStyles.flex1, flexboxStyles.justifyEnd, spacings.mtMd]}>
          {formType === MODES.ADD_TOKEN && (
            <>
              <Title type="small" style={textStyles.center}>
                {t('Add Token')}
              </Title>

              <AddOrHideTokenForm mode={MODES.ADD_TOKEN} onSubmit={handleOnSubmit} />
            </>
          )}
          {formType === MODES.HIDE_TOKEN && (
            <>
              <Title type="small" style={textStyles.center}>
                {t('Hide Token')}
              </Title>

              <AddOrHideTokenForm
                enableSymbolSearch={true}
                mode={MODES.HIDE_TOKEN}
                onSubmit={handleOnSubmit}
              />
              <HiddenTokens />
            </>
          )}
        </View>
      </BottomSheet>
    </>
  )
}

export default AddOrHideToken
