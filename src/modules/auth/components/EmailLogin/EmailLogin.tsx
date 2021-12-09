import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, StyleSheet, Text, TextInput } from 'react-native'

import useEmailLogin from '@modules/auth/hooks/useEmailLogin'

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 16,
    borderBottomWidth: 1,
    padding: 12,
  },
})

const EmailLogin = () => {
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
    <>
      {!requiresEmailConfFor && (
        <>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                placeholder="Email"
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
          />
          {errors.email && <Text>Please fill in this field</Text>}

          <Button title="LOG IN" onPress={handleSubmit(handleLogin)} />
        </>
      )}
      {!!requiresEmailConfFor && (
        <Text>{`We sent an email to ${requiresEmailConfFor?.email}, please check your inbox and click Authorize New Device`}</Text>
      )}
    </>
  )
}

export default EmailLogin
