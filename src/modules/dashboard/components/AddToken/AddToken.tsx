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

import AddTokenForm from './AddTokenForm'
import styles from './styles'

// eslint-disable-next-line @typescript-eslint/naming-convention
enum FORM_TYPE {
  ADD_TOKEN = 'Add Token',
  HIDE_TOKEN = 'Hide Token'
}

const segments = [{ value: FORM_TYPE.ADD_TOKEN }, { value: FORM_TYPE.HIDE_TOKEN }]

const AddToken = () => {
  const { t } = useTranslation()
  const { onAddExtraToken } = usePortfolio()
  const { sheetRef, isOpen, openBottomSheet, closeBottomSheet } = useBottomSheet()
  const [formType, setFormType] = useState<FORM_TYPE>(FORM_TYPE.ADD_TOKEN)

  const handleOnSubmit = (token) => {
    onAddExtraToken(token)

    closeBottomSheet()
  }

  return (
    <>
      <TouchableOpacity style={[styles.btnContainer, spacings.mbTy]} onPress={openBottomSheet}>
        <Text fontSize={16}>{t('Add Token')}</Text>
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
          onChange={(value: FORM_TYPE) => {
            setFormType(value)
            triggerLayoutAnimation({
              forceAnimate: true,
              config: LayoutAnimation.create(300, 'linear', 'opacity')
            })
          }}
          fontSize={14}
        />
        <View style={[flexboxStyles.flex1, flexboxStyles.justifyEnd, spacings.mtMd]}>
          {formType === FORM_TYPE.ADD_TOKEN && (
            <>
              <Title type="small" style={textStyles.center}>
                {t('Add Token')}
              </Title>

              <AddTokenForm onSubmit={handleOnSubmit} />
            </>
          )}
          {formType === FORM_TYPE.HIDE_TOKEN && (
            <>
              <Title type="small" style={textStyles.center}>
                {t('Hide Token')}
              </Title>

              {/* TODO: Form. */}
            </>
          )}
        </View>
      </BottomSheet>
    </>
  )
}

export default AddToken
