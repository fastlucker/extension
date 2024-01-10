import LatticeIcon from '@common/assets/svg/LatticeIcon'
import LedgerIcon from '@common/assets/svg/LedgerIcon'
import TrezorIcon from '@common/assets/svg/TrezorIcon'

type Props = {
  onTrezorPress: () => void
  onLedgerPress: () => void
  onGridPlusPress: () => void
}

const getOptions = ({ onTrezorPress, onLedgerPress, onGridPlusPress }: Props) => [
  {
    title: 'Trezor',
    models: ['Trezor One', 'Trezor Model 3', 'Trezor Model T'],
    image: () => <TrezorIcon height={80} />,
    onPress: onTrezorPress
  },
  {
    title: 'Ledger',
    models: ['Ledger Nano', 'Ledger Nano X', 'Ledger Nano S Plus', 'Ledger Stax'],
    image: () => <LedgerIcon height={80} />,
    onPress: onLedgerPress
  },
  {
    title: 'GRID+',
    models: ['GRID+ Lattice1'],
    image: () => <LatticeIcon height={80} />,
    onPress: onGridPlusPress
  }
]

export default getOptions
