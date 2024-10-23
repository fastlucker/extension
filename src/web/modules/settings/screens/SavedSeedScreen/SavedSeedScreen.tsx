import React, { useState } from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'

import PasswordConfirmation from '../../components/PasswordConfirmation'

const SavedSeedScreen = () => {
  const [passwordConfirmed, setPasswordConfirmed] = useState<boolean>(false)

  return (
    <View style={{ maxWidth: 440 }}>
      {!passwordConfirmed && (
        <PasswordConfirmation onPasswordConfirmed={() => setPasswordConfirmed(true)} />
      )}
      {passwordConfirmed && (
        <View>
          <Text>test text, seed next</Text>
        </View>
      )}
    </View>
  )
}

export default React.memo(SavedSeedScreen)
