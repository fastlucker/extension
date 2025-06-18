import Toggle from '@common/components/Toggle'
import { ToggleProps } from '@common/components/Toggle/types'
import useTheme from '@common/hooks/useTheme'
import { THEME_TYPES } from '@common/styles/themeConfig'

const FatToggle: React.FC<ToggleProps> = (props) => {
  const { theme, themeType } = useTheme()

  return (
    <Toggle
      trackStyle={{
        width: 52,
        height: 28,
        backgroundColor: themeType === THEME_TYPES.DARK ? '#FFFFFF14' : '#14183314',
        borderRadius: 16
      }}
      toggleStyle={{
        top: 2,
        width: 24,
        height: 24,
        transform: (props.isOn ? 'translateX(26px)' : 'translateX(2px)') as any,
        backgroundColor:
          themeType === THEME_TYPES.DARK ? theme.tertiaryBackground : theme.primaryBackground,
        // @ts-ignore
        border: `1px solid ${theme.secondaryBorder as string}`
      }}
      {...props}
    />
  )
}

export default FatToggle
