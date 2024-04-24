// @ts-nocheck

import { ethErrors } from 'eth-rpc-errors'
import { toBeHex } from 'ethers'

class PushEventHandlers {
  provider

  constructor(provider) {
    this.provider = provider
  }

  _emit(event, data) {
    if (this.provider._initialized && this.provider._isReady) {
      this.provider.emit(event, data)
    }
  }

  connect = (data) => {
    if (!this.provider._isConnected) {
      this.provider._isConnected = true
      this.provider._state.isConnected = true
      this._emit('connect', data)
    }
  }

  unlock = () => {
    this.provider._isUnlocked = true
    this.provider._state.isUnlocked = true
  }

  lock = () => {
    this.provider._isUnlocked = false
    this._emit('accountsChanged', [])
  }

  disconnect = () => {
    this.provider._isConnected = false
    this.provider._state.isConnected = false
    this.provider._state.accounts = null
    this.provider.selectedAddress = null
    const disconnectError = ethErrors.provider.disconnected()

    this._emit('accountsChanged', [])
    this._emit('disconnect', disconnectError)
    this._emit('close', disconnectError)
  }

  accountsChanged = (accounts) => {
    if (accounts?.[0] === this.provider.selectedAddress) {
      return
    }

    this.provider.selectedAddress = accounts?.[0]
    this.provider._state.accounts = accounts
    this._emit('accountsChanged', accounts)
  }

  chainChanged = ({ chain, networkVersion }) => {
    this.connect({ chainId: chain })

    if (chain !== this.provider.chainId) {
      this.provider.chainId = chain
      this._emit('chainChanged', chain)
      // EXPERIMENTAL FIX: fixes the RPC requests forwarding for the newly selected network
      // Most dApps initialize their provider for the given network only upon loading the dApp and after that they rely on the connected wallet's RPC provider.
      // For these dApps there is no other way to obtain the RPC URL of the new network except by forcing a reload of the dApp for it to make a call to the RPC URL.
      // Subsequently, we receive the URL in the customized fetch function and then we initialize the forwarding mechanism for the selected network
      setTimeout(() => window.location.reload(), 150)
    }

    if (networkVersion !== this.provider.networkVersion) {
      this.provider.networkVersion = networkVersion
      this._emit('networkChanged', networkVersion)
    }
  }

  'ambire:chainChanged' = (network) => {
    if (network && toBeHex(network?.chainId) !== this.provider.chainId?.toLowerCase()) {
      this._emit('ambire:chainChanged', network)
    }
  }
}

export default PushEventHandlers
