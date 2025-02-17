import React from 'react'
import { Control, Controller, UseFormSetValue } from 'react-hook-form'
import { ViewStyle } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import SearchIcon from '@common/assets/svg/SearchIcon'
import Input, { InputProps } from '@common/components/Input'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

interface Props extends InputProps {
  placeholder?: string
  style?: ViewStyle
  containerStyle?: ViewStyle
  inputWrapperStyle?: ViewStyle
  control: Control<{ search: string }, any>
  setValue?: UseFormSetValue<{ search: string }>
  height?: number
  hasLeftIcon?: boolean
}

const Search = ({
  placeholder = 'Search',
  style,
  control,
  setValue,
  containerStyle = {},
  inputWrapperStyle = {},
  height = 40,
  hasLeftIcon = true,
  ...rest
}: Props) => {
  const { theme } = useTheme()

  return (
    <Controller
      control={control}
      name="search"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          containerStyle={[spacings.mb0, containerStyle]}
          leftIcon={hasLeftIcon ? () => <SearchIcon color={theme.secondaryText} /> : undefined}
          placeholder={placeholder}
          style={style}
          inputWrapperStyle={[{ height }, inputWrapperStyle]}
          inputStyle={{ height: height - 2 }}
          placeholderTextColor={theme.secondaryText}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          {...(setValue && value.length
            ? {
                button: <CloseIcon width={12} height={12} strokeWidth="2" />,
                buttonStyle: spacings.mrTy,
                onButtonPress: () => setValue('search', '')
              }
            : {})}
          {...rest}
        />
      )}
    />
  )
}

export default React.memo(Search)
