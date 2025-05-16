import { Props as BadgeProps, BadgeType } from '../Badge/types'

type BadgePreset = {
  text: string
  type: BadgeType
  tooltipText: string
}

type Preset = 'smart-account' | 'view-only' | 'ambire-v1' | 'linked' | 'metamask'

type Props = {
  preset: Preset
} & Omit<BadgeProps, 'text' | 'type' | 'tooltipText'>

export type { BadgePreset, Preset, Props }
