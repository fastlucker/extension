import React from 'react'
import { ScrollView, View } from 'react-native'

import Text from '@common/components/Text'
import TabHeader from '@web/modules/router/components/TabHeader'

const SignAccountOpPopupScreen = () => {
  return (
    <View>
      <TabHeader hideStepper pageTitle="Sign Transaction" />
      <ScrollView>
        <Text>Transaction Summary</Text>
      </ScrollView>
    </View>
  )
}

export default SignAccountOpPopupScreen
