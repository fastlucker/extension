import { Card, Filter } from '@legends/modules/legends/types'

const MOCK_FILTERS: Filter[] = [
  {
    label: 'All Legends',
    value: 'all'
  },
  {
    label: 'DeFi',
    value: 'defi'
  },
  {
    label: 'Social',
    value: 'social'
  },
  {
    label: 'NFT',
    value: 'nft'
  }
]
const MOCK_CARDS: Card[] = [
  {
    heading: 'Legend 1',
    image: 'images/legends/bridge.png',
    xpRewards: [
      {
        label: 'Mainnet',
        value: 100
      },
      {
        label: 'Layer 2',
        value: 10
      }
    ],
    description:
      'Legends are the most active members of the community. They are the ones who are always there to help others and make the community a better place.'
  },
  {
    heading: 'Legend 2',
    image: 'images/legends/twitter.png',
    xpRewards: [
      {
        label: 'Mainnet',
        value: 100
      },
      {
        label: 'Layer 2',
        value: 10
      }
    ],
    description:
      'Legends are the most active members of the community. They are the ones who are always there to help others and make the community a better place.',
    action: {
      label: 'Open Twitter',
      onClick: () => {
        alert('Wohoo!')
      }
    }
  },
  {
    heading: 'Legend 3',
    image: 'images/legends/telegram.png',
    xpRewards: [
      {
        label: 'Mainnet',
        value: 100
      },
      {
        label: 'Layer 2',
        value: 10
      }
    ],
    description:
      'Legends are the most active members of the community. They are the ones who are always there to help others and make the community a better place.'
  },
  {
    heading: 'Legend 4',
    image: 'images/legends/telegram.png',
    xpRewards: [
      {
        label: 'Mainnet',
        value: 100
      },
      {
        label: 'Layer 2',
        value: 10
      }
    ],
    description:
      'Legends are the most active members of the community. They are the ones who are always there to help others and make the community a better place.',
    completed: true
  }
]

export { MOCK_FILTERS, MOCK_CARDS }
