import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'

import useEmailLogin from '@modules/auth/hooks/useEmailLogin'
import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'

import styles from './styles'

const EmailLoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  })

  const { handleLogin, requiresEmailConfFor } = useEmailLogin()

  return (
    <View style={styles.container}>
      {!requiresEmailConfFor && (
        <>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input onBlur={onBlur} placeholder="Email" onChangeText={onChange} value={value} />
            )}
            name="email"
          />
          {errors.email && <Text>Please fill in this field</Text>}

          <Button text="Log in" onPress={handleSubmit(handleLogin)} />
        </>
      )}
      {!!requiresEmailConfFor && (
        <Text>{`We sent an email to ${requiresEmailConfFor?.email}, please check your inbox and click Authorize New Device`}</Text>
      )}
    </View>
  )
}

export default EmailLoginScreen
