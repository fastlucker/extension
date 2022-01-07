import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Image, Linking, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { Trans, useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

import styles from './styles'

const Balances = () => {
  const { t } = useTranslation()
  const { areProtocolsLoading, protocols, tokens } = usePortfolio()
  const { selectedAcc } = useAccounts()
  const { network: selectedNetwork } = useNetwork()
  const { sheetRef, openBottomSheet } = useBottomSheet()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      address: ''
    }
  })

  return (
    <>
      <TouchableOpacity style={styles.btnContainer} onPress={openBottomSheet}>
        <Text style={styles.btn}>{t('+ Add token')}</Text>
      </TouchableOpacity>

      <BottomSheet sheetRef={sheetRef}>
        <Title>{t('Add Token')}</Title>
        <Controller
          control={control}
          // rules={{ validate: isEmail }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label={t('Token Address')}
              placeholder={t('0x...')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="address"
        />
      </BottomSheet>
    </>
  )
}

export default Balances
