import { createContext } from 'react'

import spacings from '@common/styles/spacings'

import { SideContentItemType } from './types'

const ItemTypeContext = createContext<SideContentItemType>('info')

const SMALL_MARGIN = spacings.mbSm

const TYPE_TO_TEXT_TYPE_MAP = {
  info: 'infoText',
  error: 'errorText',
  warning: 'warningText'
}

export { ItemTypeContext, SMALL_MARGIN, TYPE_TO_TEXT_TYPE_MAP }
