import { ExternalKey } from '@ambire-common/interfaces/keystore'

export const HARDWARE_WALLET_DEVICE_NAMES: { [key in ExternalKey['type']]: string } = {
  ledger: 'Ledger',
  trezor: 'Trezor',
  lattice: 'GridPlus'
}
