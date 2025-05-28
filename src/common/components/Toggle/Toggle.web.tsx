import './styles.css'

import React from 'react'

import Text, { Props as TextProps } from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import { THEME_TYPES } from '@common/styles/themeConfig'

import { ToggleProps } from './types'

interface Props extends ToggleProps {
  labelProps?: TextProps
  toggleStyle?: React.CSSProperties
}

const Toggle: React.FC<Props> = ({
  id,
  isOn,
  onToggle,
  label,
  labelProps,
  toggleStyle,
  disabled,
  testID
}) => {
  const { theme, themeType } = useTheme()
  const handleOnToggle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onToggle(e.target.checked)
  }

  return (
    <label
      htmlFor={id}
      // @ts-ignore it exists for the React Native Web component
      testID={testID}
      style={{
        alignItems: 'center',
        display: 'flex',
        cursor: 'pointer',
        opacity: disabled ? 0.4 : 1
      }}
    >
      <input
        style={{ display: 'none' }}
        type="checkbox"
        checked={isOn}
        id={id}
        onChange={handleOnToggle}
        disabled={disabled}
      />
      <div
        style={{
          marginRight: '12px',
          display: 'inline-block',
          position: 'relative',
          width: '28px',
          height: '12px',
          borderRadius: '13px',
          transition: 'border 0.2s',
          background: isOn
            ? (theme.successBackground as string)
            : themeType === THEME_TYPES.DARK
            ? (theme.quaternaryBackground as string)
            : (theme.quaternaryBackground as string),
          ...toggleStyle
        }}
      >
        <div
          style={{
            content: '',
            position: 'absolute',
            boxSizing: 'border-box',
            height: '16px',
            top: '-2px',
            width: '16px',
            borderRadius: '13px',
            transition: 'transform 0.2s',
            background: isOn
              ? (theme.successDecorative as string)
              : themeType === THEME_TYPES.DARK
              ? (theme.secondaryBackground as string)
              : '#f7f8ff',
            border: `1px solid ${
              themeType === THEME_TYPES.DARK
                ? (theme.primaryBorder as string)
                : (theme.secondaryBorder as string)
            }`,
            transform: isOn ? 'translateX(12px)' : ''
          }}
        />
      </div>
      <Text fontSize={12} weight="medium" {...labelProps}>
        {label}
      </Text>
    </label>
  )
}

export default React.memo(Toggle)
