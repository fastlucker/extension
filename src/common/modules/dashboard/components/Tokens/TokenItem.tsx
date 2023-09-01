import { FC } from 'react'

// Since we have a .web component and import TokenItem without the .web
// extension, the compiler complains about the missing TokenItem.tsx component.
const TokenItem: FC<any> = () => {
  return null
}

export default TokenItem
