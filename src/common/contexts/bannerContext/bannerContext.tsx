import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react'

import {
  addBanner as add,
  Banner,
  removeBanner as remove
} from '@web/extension-services/background/services/banners'
import storage from '@web/extension-services/background/webapi/storage'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'

export interface BannerContextReturnType {
  banners: Banner[]
  addBanner: (banner: Banner) => void
  removeBanner: (id: number) => void
}

interface Props {
  children: React.ReactNode
}

const BannerContext = createContext<BannerContextReturnType | []>([])

const BannerProvider: FC<Props> = ({ children }) => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [transactionBanners, setTransactionBanners] = useState<Banner[]>([])
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    ;(async () => {
      // @TODO: We may want to add a key to each banner that indicates if a banner should persist on reload or not.
      const savedBanners = await storage.get('banners')

      if (savedBanners) {
        setBanners((prevBanners) => [...prevBanners, ...savedBanners])
      }
    })()
  }, [])

  const getTransactionBanners = useCallback(() => {
    const txnBanners: Banner[] = []
    const msgsToBeSignedForSelectedAcc =
      mainState.messagesToBeSigned?.[mainState.selectedAccount as string] || []
    const accountOpsToBeSignedForSelectedAcc =
      mainState.accountOpsToBeSigned?.[mainState.selectedAccount as string] || {}
    msgsToBeSignedForSelectedAcc.forEach((msg) => {
      txnBanners.push({
        id: msg.id,
        topic: 'TRANSACTION',
        title: 'Message waiting to be signed',
        text: `Message type: ${msg.content.kind === 'message' ? 'personal_sign' : 'typed_data'}`,
        actions: [
          {
            label: 'Open',
            onPress: () => {
              dispatch({
                type: 'NOTIFICATION_CONTROLLER_OPEN_NOTIFICATION_REQUEST',
                params: { id: msg.id }
              })
            }
          },
          {
            label: 'Reject',
            onPress: () => {
              dispatch({
                type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
                params: { err: 'User rejected the message request', id: msg.id }
              })
            }
          }
        ]
      })
    })

    Object.keys(accountOpsToBeSignedForSelectedAcc).forEach((key) => {
      txnBanners.push({
        id: new Date().getTime(),
        topic: 'TRANSACTION',
        title: `${accountOpsToBeSignedForSelectedAcc[key]?.accountOp?.calls.length} Transactions waiting to be signed`,
        text: '',
        actions: [
          {
            label: 'Open',
            onPress: () => {
              const req = mainState.userRequests.find(
                (r) =>
                  r.action.kind === 'call' &&
                  r.accountAddr ===
                    accountOpsToBeSignedForSelectedAcc[key]?.accountOp?.accountAddr &&
                  r.networkId === accountOpsToBeSignedForSelectedAcc[key]?.accountOp?.networkId
              )
              if (req) {
                dispatch({
                  type: 'NOTIFICATION_CONTROLLER_OPEN_NOTIFICATION_REQUEST',
                  params: { id: req.id }
                })
              }
            }
          },
          {
            label: 'Reject',
            onPress: () => {
              mainState.userRequests.forEach((req) => {
                if (
                  req.accountAddr ===
                    accountOpsToBeSignedForSelectedAcc[key]?.accountOp?.accountAddr &&
                  req.networkId === accountOpsToBeSignedForSelectedAcc[key]?.accountOp?.networkId
                ) {
                  dispatch({
                    type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
                    params: { err: 'User rejected the message request', id: req.id }
                  })
                }
              })
            }
          }
        ]
      })
    })

    setTransactionBanners(txnBanners)
  }, [mainState, dispatch])

  useEffect(() => {
    getTransactionBanners()
  }, [getTransactionBanners])

  const addBanner = useCallback(
    async (banner: Banner) => {
      const updatedBanners = (await add(banner, banners)) || banners
      setBanners(updatedBanners)
    },
    [banners]
  )

  const removeBanner = useCallback(
    async (id: number) => {
      const updatedBanners = (await remove(id, banners)) || banners
      setBanners(updatedBanners)
    },
    [banners]
  )

  const contextValue = useMemo(
    () => ({ banners: [...transactionBanners, ...banners], addBanner, removeBanner }),
    [banners, transactionBanners, addBanner, removeBanner]
  )

  return <BannerContext.Provider value={contextValue}>{children}</BannerContext.Provider>
}

export { BannerContext, BannerProvider }
