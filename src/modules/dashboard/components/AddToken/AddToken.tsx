import React from 'react'
import { TouchableOpacity } from 'react-native'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import usePortfolio from '@modules/common/hooks/usePortfolio'

import AddTokenForm from './AddTokenForm'
import styles from './styles'

const AddToken = () => {
  const { t } = useTranslation()
  const { onAddExtraToken } = usePortfolio()
  const { sheetRef, isOpen, openBottomSheet, closeBottomSheet } = useBottomSheet()

  const handleOnSubmit = (token) => {
    onAddExtraToken(token)

    closeBottomSheet()
  }

  return (
    <>
      <TouchableOpacity style={styles.btnContainer} onPress={openBottomSheet}>
        <Text style={styles.btn}>{t('+ Add token')}</Text>
      </TouchableOpacity>

      <BottomSheet
        id="add-token"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
        dynamicInitialHeight={false}
      >
        <Title>{t('Add Token')}</Title>

        <AddTokenForm onSubmit={handleOnSubmit} />
      </BottomSheet>
    </>
  )
}

export default AddToken
