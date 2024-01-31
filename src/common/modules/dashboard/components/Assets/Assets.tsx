import React, { useEffect, useState } from 'react'
import { ViewStyle } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import usePrevious from '@common/hooks/usePrevious'

import Collections from '../Collections'
import Tokens from '../Tokens'

interface Props {
  openTab: 'tokens' | 'collectibles' | 'defi'
  tokens: TokenResult[]
  searchValue: string
}

// We do this instead of unmounting the component to prevent
// component rerendering when switching tabs.
const HIDDEN_STYLE: ViewStyle = { position: 'absolute', opacity: 0 }

const Assets = ({ tokens, openTab, searchValue }: Props) => {
  const prevOpenTab = usePrevious(openTab)
  // To prevent initial load of all tabs but load them when requested by the user
  // Persist the rendered list of items for each tab once opened
  // This technique improves the initial loading speed of the dashboard
  const [initTab, setInitTab] = useState<{
    [key: string]: boolean
  }>({})

  useEffect(() => {
    if (openTab !== prevOpenTab && !initTab?.[openTab]) {
      setInitTab((prev) => ({ ...prev, [openTab]: true }))
    }
  }, [openTab, prevOpenTab, initTab])

  return (
    <>
      {!!initTab?.tokens && (
        <Tokens
          searchValue={searchValue}
          tokens={tokens}
          pointerEvents={openTab !== 'tokens' ? 'none' : 'auto'}
          style={openTab !== 'tokens' ? HIDDEN_STYLE : {}}
        />
      )}

      {!!initTab?.collectibles && (
        <Collections
          pointerEvents={openTab !== 'collectibles' ? 'none' : 'auto'}
          style={openTab !== 'collectibles' ? HIDDEN_STYLE : {}}
        />
      )}
    </>
  )
}

export default React.memo(Assets)
