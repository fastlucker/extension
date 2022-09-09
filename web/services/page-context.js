// share same environment than web page
// this is where we can inject web3
const initPageContext = async () => {
  import(/* webpackIgnore: true */ './ambexMessanger.js')
    .then((res) => {
      // This script runs in page context and registers a listener.
      // Note that the page may override/hook things like addEventListener...
      const VERBOSE = 4 || 0

      const USER_INTERVENTION_METHODS = [
        'eth_sendTransaction',
        'personal_sign',
        'eth_sign',
        'personal_sign',
        'gs_multi_send',
        'ambire_sendBatchTransaction'
      ]

      // unify error formatting
      const formatErr = (err) => {
        if (typeof err === 'string') {
          return Error(err)
        }
        if (err instanceof Error) {
          return err
        }
        if (err.message) {
          return Error(err.message)
        }
        return err
      }

      // wrapped promise for ethereum.request
      const ethRequest = (requestPayload) =>
        new Promise((resolve, reject) => {
          let replyTimeout = 5 * 1000
          if (
            requestPayload &&
            requestPayload.method &&
            USER_INTERVENTION_METHODS.indexOf(requestPayload.method) !== -1
          ) {
            replyTimeout = 5 * 60 * 1000
            res.sendMessage(
              {
                to: 'background',
                type: 'userInterventionNotification',
                data: {
                  method: requestPayload.method
                }
              },
              { ignoreReply: true }
            )
          }

          res
            .sendMessage(
              {
                to: 'ambirePageContext',
                type: 'web3Call',
                data: requestPayload
              },
              { replyTimeout }
            )
            .then((reply) => {
              const data = reply.data
              if (data) {
                if (data.error) {
                  reject(formatErr(data.error))
                } else {
                  const result = reply.data ? reply.data.result : null
                  if (reply.error) {
                    return reject(formatErr(data.error))
                  }
                  return resolve(result)
                }
              } else {
                return reject(formatErr('empty reply'))
              }
            })
            .catch((err) => {
              console.error('error request', err)
              return reject(formatErr(err))
            })
        })

      // wrapped promise for provider.send
      const sendRequest = (requestPayload, callback) =>
        new Promise((resolve, reject) => {
          let replyTimeout = 5 * 1000
          if (
            requestPayload &&
            requestPayload.method &&
            USER_INTERVENTION_METHODS.indexOf(requestPayload.method) !== -1
          ) {
            replyTimeout = 60 * 1000
          }

          res
            .sendMessage(
              {
                to: 'ambirePageContext',
                type: 'web3Call',
                data: requestPayload
              },
              { replyTimeout }
            )
            .then((reply) => {
              const data = reply.data
              if (data) {
                if (data.error) {
                  // avoid to break web3calls dapps with reject...
                  if (callback) {
                    callback(
                      { code: -1, message: data.error, stack: '' },
                      res.makeRPCError(requestPayload, data.error)
                    )
                  }

                  resolve(formatErr(data.error))
                } else {
                  const result = reply.data ? reply.data.result : null
                  if (callback) {
                    callback(reply.error, reply.data)
                  }
                  resolve(result)
                }
              } else {
                if (callback) {
                  callback('empty reply', res.makeRPCError(requestPayload, 'empty reply'))
                }
                resolve(formatErr('empty reply')) // avoid to break web3calls dapps with rej...
              }
            })
            .catch((err) => {
              if (VERBOSE > 1) console.error('error send', err)
              const formattedErr = formatErr(err)
              if (callback) {
                callback(
                  { code: -1, message: formattedErr.message, stack: '' },
                  res.makeRPCError(requestPayload, err)
                )
              }
              resolve(formatErr(formattedErr.message)) // avoid to break web3calls dapps with rej...
            })
        })

      // inform dapp that accounts were changed
      function accountsChanged(account) {
        if (VERBOSE > 1) console.log('accountsChanged', account)
        window.ethereum.emit('accountsChanged', account ? [account] : [])
        window.web3.currentProvider.emit('accountsChanged', account ? [account] : [])
      }

      // inform chain that accounts were changed
      function chainChanged(chainId) {
        if (VERBOSE > 1) console.log('chainChanged', chainId)
        window.ethereum.emit('chainChanged', chainId)
        window.web3.currentProvider.emit('chainChanged', chainId)
        window.ethereum.emit('networkChanged', chainId)
        window.web3.currentProvider.emit('networkChanged', chainId)
      }

      // our web3 provider
      function ExtensionProvider() {
        this.eventHandlers = {
          chainChanged: [],
          networkChanged: [],
          accountsChanged: []
        }

        this.on = function (evt, handler) {
          if (VERBOSE > 1) console.log(`Setting event handler for ${evt}`)
          if (Object.keys(this.eventHandlers).indexOf(evt) !== -1) {
            this.eventHandlers[evt].push(handler)
          }
        }

        this.removeListener = function (evt, handler) {
          if (Object.keys(this.eventHandlers).indexOf(evt) !== -1) {
            const index = this.eventHandlers[evt].findIndex((a) => a === handler)
            if (index !== -1) {
              delete this.eventHandlers[evt][index]
            }
          }
        }

        this.removeAllListeners = function (evt) {
          if (evt && evt.length) {
            evt.forEach((e) => {
              if (this.eventHandlers[e]) {
                this.eventHandlers[e] = []
              }
            })
          } else if (evt) {
            if (this.eventHandlers[evt]) {
              this.eventHandlers[evt] = []
            }
          } else {
            this.eventHandlers = {
              chainChanged: [],
              networkChanged: [],
              accountsChanged: []
            }
          }
        }

        this.emit = function (evt, data) {
          if (this.eventHandlers[evt] && this.eventHandlers[evt].length) {
            for (const callback of this.eventHandlers[evt]) {
              if (typeof callback === 'function') {
                callback(data)
              } else {
                console.warn('emit callback is not a function', callback)
              }
            }
          }
        }

        this.send = async function (payload, web3Callback) {
          if (VERBOSE > 1) console.log('Payload to send to background', payload)
          if (VERBOSE > 1) console.log('callback:', web3Callback)

          let formattedPayload = {
            jsonrpc: '2.0',
            id: Math.random()
          }
          if (typeof payload === 'string') {
            formattedPayload.method = payload
          } else {
            formattedPayload = {
              ...formattedPayload,
              ...payload
            }
          }

          if (VERBOSE > 2) console.log('Formatted payload', formattedPayload)

          const res = await sendRequest(formattedPayload, web3Callback)

          if (VERBOSE > 2) console.log('PageContext result : ', res)

          return res
        }

        this.fetchNetworkId = async () => {
          const genId = `netId_${Math.random()}`
          const callback = (error, payload) => {
            if (error) {
              console.log('Could not get networkId')
            } else if (window.web3 && window.web3.currentProvider && payload.result > 0) {
              this.ambireNetworkId = payload.result
              window.web3.currentProvider.networkVersion = payload.result
            }
          }

          await sendRequest(
            {
              jsonrpc: '2.0',
              id: genId,
              method: 'eth_chainId'
            },
            callback
          )
        }

        this.supportsSubscriptions = () => false
        this.disconnect = () => true

        this.enable = async function () {
          await this.fetchNetworkId()
        }

        this.request = async function (arg, arg2) {
          const requestMethod = arg.method
          const genId = `reqId_${Math.random()}`
          const payload = {
            jsonrpc: '2.0',
            id: genId,
            method: requestMethod
          }
          if (arg.iteration) {
            payload.iteration = arg.iteration
          }
          if (arg.params) {
            payload.params = arg.params
          }

          if (VERBOSE > 2) console.debug(`REQ ${genId} ${payload.method}`, payload)

          let hasErr
          let requestErr
          const result = await ethRequest(payload).catch((err) => {
            console.log('ethRequest err', err)
            hasErr = true // might err be undefined?
            requestErr = err
            // throw err
          })
          if (hasErr) {
            if (requestErr instanceof Error) {
              throw requestErr
            } else if (typeof requestErr === 'object') {
              throw requestErr
            } else {
              throw Error(`${requestErr}`)
            }
          }
          if (VERBOSE > 2)
            console.debug(`RES ${genId} ${payload.method}`, {
              payload,
              result
            })
          return result
        }

        // for dapps
        this.isMetaMask = true

        // for ourselves, to check of extension web3 is already injected
        this.isAmbire = true
      }

      const ethereum = new ExtensionProvider()
      ;(() => {
        // to be removed from DOM after execution
        const element = document.querySelector('#page-context')

        let overridden = false

        // existing injection (MM or else)?
        const existing = (window.ethereum && true) || false

        if (existing) {
          if (window.ethereum.isAmbire) {
            // dont override
          } else {
            overridden = true
          }
        }

        // if never injected, setup listeners and handlers
        if (!window.ambexMessengerSetup) {
          res.setupAmbexMessenger('pageContext')
          // TODO CHECK IN WHICH CASE WE NEED TO REPORT THIS A SECOND TIME (post load)
          res.sendMessage(
            {
              type: 'pageContextInjected',
              to: 'background',
              data: { args: element.dataset.args, overridden, existing }
            },
            { ignoreReply: true }
          )

          res.addMessageHandler({ type: 'ambireWalletConnected' }, (message) => {
            if (VERBOSE > 1) console.log('pageContext: emitting MM event connect', message.data)
            accountsChanged(message.data.account)
            chainChanged(message.data.chainId)
          })

          res.addMessageHandler({ type: 'ambireWalletDisconnected' }, (message) => {
            if (VERBOSE > 1) console.log('pageContext: emitting event disconnect')
            window.ethereum.emit('disconnect')
            window.web3.currentProvider.emit('disconnect')
            accountsChanged(null)
            chainChanged(null)
          })

          res.addMessageHandler({ type: 'ambireWalletChainChanged' }, (message) => {
            if (VERBOSE > 1) console.log('pageContext: emitting event chainChanged', message)
            chainChanged(message.data.chainId)
          })

          res.addMessageHandler({ type: 'ambireWalletAccountChanged' }, (message) => {
            if (VERBOSE > 1) console.log('pageContext: emitting event accountChanged', message)
            accountsChanged(message.data.account)
          })

          window.ambexMessengerSetup = true
        }

        // avoid reInjection. one injection happens at the very beginning of the page load, and one when page is complete (to override web3 if !web3.isAmbire)
        if (!existing || overridden) {
          window.ethereum = ethereum
          window.web3 = new Web3(ethereum)
        }

        // cleaning dom
        // element.remove()
        try {
          element.parentNode.removeChild(document.querySelector('#page-context'))
        } catch (error) {}
      })()
    })
    .catch((e) => {
      console.error('Page context: ', e)
    })
}

initPageContext()
