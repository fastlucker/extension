import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'

import Button from '@common/components/Button'
import { OptionType } from '@common/components/Select/Select.web'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import TabHeader from '@web/modules/router/components/TabHeader'

import Fees from '../../components/Fees'
import TransactionSummary from '../../components/TransactionSummary'
import styles from './styles'

interface Props {
  tokens: OptionType[]
}

const SignAccountOpPopupScreen: FC<Props> = ({ tokens }) => {
  const { control } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      token: tokens[0] || {}
    }
  })

  return (
    <View style={styles.container}>
      <TabHeader hideStepper pageTitle="Sign Transaction" />
      <ScrollView style={styles.containerInner}>
        <Text
          color={colors.martinique}
          fontSize={16}
          weight="medium"
          style={styles.transactionsHeading}
        >
          Transaction Summary
        </Text>
        <View style={styles.transactions}>
          <TransactionSummary style={styles.transaction} />
        </View>
        <Fees control={control} tokens={tokens} />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          hasBottomSpacing={false}
          type="danger"
          style={[styles.button, styles.rejectButton]}
          text="Reject"
        />
        <Button hasBottomSpacing={false} style={styles.button} text="Sign" />
      </View>
    </View>
  )
}

export default SignAccountOpPopupScreen
