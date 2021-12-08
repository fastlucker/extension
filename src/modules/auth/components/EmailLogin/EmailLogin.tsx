import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, StyleSheet, Text, TextInput } from 'react-native'

interface Props {
  onSubmit: (data: any) => any
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 16,
    borderBottomWidth: 1,
    padding: 12,
  },
})

const EmailLogin = ({ onSubmit }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  })

  return (
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

      <Button title="LOG IN" onPress={handleSubmit(onSubmit)} />
    </>
  )
}

export default EmailLogin
