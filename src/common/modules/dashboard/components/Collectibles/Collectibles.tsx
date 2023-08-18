import { CollectionResult } from 'ambire-common/src/libs/portfolio/interfaces'
import React from 'react'
import { View } from 'react-native'

import Collection from './Collection'

const COLLECTIBLES: CollectionResult[] = [
  {
    name: 'FIESTA',
    symbol: 'NFT Fiesta',
    amount: 1n,
    decimals: 1,
    collectibles: [{ id: 137n, url: 'https://storage.googleapis.com/nftfiesta/137' }],
    address: '0x18Ce9CF7156584CDffad05003410C3633EFD1ad0',
    priceIn: []
  },
  {
    name: 'IlluminatiGoblins',
    symbol: 'IGOBZ',
    amount: 1n,
    decimals: 1,
    collectibles: [
      {
        id: 2442n,
        url: 'ipfs://QmUG7U3rdwqQnJhyAaFScfDbHV16Pg87y25u3TYipgmxsg/2442.json'
      }
    ],
    address: '0x026224A2940bFE258D0dbE947919B62fE321F042',
    priceIn: [{ baseCurrency: 'usd', price: 1621.25 }]
  },
  {
    name: 'Zerion DNA 1.0',
    symbol: 'DNA',
    amount: 1n,
    decimals: 1,
    collectibles: [
      {
        id: 39118n,
        url: 'https://dna.zerion.io/api/v1/avatars/onepointo/39118'
      },
      {
        id: 39118n,
        url: 'https://gateway.pinata.cloud/ipfs/QmYRw1Gi9DNm8CoP7txcSTJjWD2WRwG1Lq7sDTaZhoovH9/4067'
      },
      {
        id: 39118n,
        url: 'https://awardable.s3.amazonaws.com/oe/metadata/816'
      },
      {
        id: 39128n,
        url: 'https://awardable.s3.amazonaws.com/oe/metadata/816'
      }
    ],
    address: '0xcF30DEf37DcB65d244F14E075Dc0ce875ccFa065',
    priceIn: []
  },
  {
    name: 'Anti-NFT NFT Club',
    symbol: 'ANTI',
    amount: 1n,
    decimals: 1,
    collectibles: [
      {
        id: 1026n,
        url: 'ipfs://QmXrVmgLN74mM9uD75hpKctrFx61DS8MSvMgWcyb8H2yMX/1026.json'
      }
    ],
    address: '0x932261f9Fc8DA46C4a22e31B45c4De60623848bF',
    priceIn: [{ baseCurrency: 'usd', price: 0.163975 }]
  },
  {
    name: 'Sin City Elite',
    symbol: 'SCE',
    amount: 1n,
    decimals: 1,
    collectibles: [
      {
        id: 4067n,
        url: 'https://gateway.pinata.cloud/ipfs/QmYRw1Gi9DNm8CoP7txcSTJjWD2WRwG1Lq7sDTaZhoovH9/4067'
      }
    ],
    address: '0x2B8e0A6933E1b0bfE652D8a45C8Bd32D279ce489',
    priceIn: []
  },
  {
    name: 'Awardable Open Edition',
    symbol: 'AWRD-OE',
    amount: 1n,
    decimals: 1,
    collectibles: [
      {
        id: 816n,
        url: 'https://awardable.s3.amazonaws.com/oe/metadata/816'
      }
    ],
    address: '0x7c41e89e299B1AF7C549D42e1483b25Bf84B1A11',
    priceIn: []
  }
]

const Collectibles = () => {
  return (
    <View>
      {COLLECTIBLES.map(({ address, name, network, collectibles }) => (
        <Collection
          address={address}
          network={network || 'ethereum'}
          key={address}
          name={name}
          collectibles={collectibles}
        />
      ))}
    </View>
  )
}

export default Collectibles
