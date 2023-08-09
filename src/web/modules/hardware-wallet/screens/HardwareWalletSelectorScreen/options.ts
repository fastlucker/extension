import grid from '@common/assets/images/GRID-Lattice.png'
import ledger from '@common/assets/images/ledger.png'
import trezor from '@common/assets/images/trezor.png'

type Props = {
  onTrezorPress: () => void
  onLedgerPress: () => void
  onGridPlusPress: () => void
}

const getOptions = ({ onTrezorPress, onLedgerPress, onGridPlusPress }: Props) => [
  {
    title: 'Trezor',
    text: 'Trezor Model T, Trezor One',
    image: trezor,
    onPress: onTrezorPress
  },
  {
    title: 'Ledger',
    text: 'Ledger Nano, Ledger Nano X, Ledger Nano S Plus, Ledger Stax',
    image: ledger,
    onPress: onLedgerPress
  },
  {
    title: 'GRID+',
    text: 'GRID+ Lattice',
    image: grid,
    onPress: onGridPlusPress
  }
]

export default getOptions
