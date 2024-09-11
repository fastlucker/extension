import { BadgeType, Props as BadgeProps } from '../Badge/types'

type BadgePreset = {
  text: string
  type: BadgeType
  tooltipText: string
}

type Preset = 'smart-account' | 'basic-account' | 'view-only' | 'ambire-v1' | 'linked'

type Props = {
  preset: Preset
} & Omit<BadgeProps, 'text' | 'type' | 'tooltipText'>

export type { BadgePreset, Preset, Props }
