import React from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Select from '@common/components/Select'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'

import CustomFee from '../CustomFee'
import Fee from '../Fee/Fee'
import getStyles from './styles'

const Fees = ({ tokens, control }: any) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  return (
    <>
      <Controller
        name="token"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            setValue={onChange}
            label={t('Pay fee with')}
            options={tokens}
            style={styles.tokenSelect}
            labelStyle={styles.tokenSelectLabel}
            value={value}
            defaultValue={value}
          />
        )}
      />
      <View style={styles.transactionSpeedContainer}>
        <Text style={styles.transactionSpeedLabel}>Transaction speed</Text>
        <View style={styles.feesContainer}>
          <Fee label={`${t('Slow')}:`} amount={0.01234567} onPress={() => {}} style={styles.mr10} />
          <Fee
            label={`${t('Medium')}:`}
            amount={0.02345678}
            onPress={() => {}}
            style={styles.mr10}
          />
          <Fee label={`${t('Fast')}:`} amount={0.03456789} onPress={() => {}} style={styles.mr10} />
          <Fee label={`${t('Ape')}:`} amount={0.04567999} onPress={() => {}} style={styles.mr10} />
          <CustomFee onPress={() => {}} />
        </View>
      </View>
      <View>
        <View style={styles.feeContainer}>
          <Text style={styles.fee}>{t('Fee')}: 0.01447743207351446 $WALLET</Text>
          <Text style={styles.feeUsd}>~ $ 0.02</Text>
        </View>
        <View style={styles.gasTankContainer}>
          <Text style={styles.gasTankText}>{t('Gas Tank saves you:')}</Text>
          <Text style={styles.gasTankText}>$ 2.6065</Text>
        </View>
      </View>
    </>
  )
}

export default Fees
