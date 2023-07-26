/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
import React, { useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useBackgroundService from '@web/hooks/useBackgroundService'
import AccountsList from '@web/modules/account-adder/components/AccountsList'
import useAccountsPagination from '@web/modules/account-adder/hooks/useAccountsPagination'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

interface Props {}

const LedgerManager: React.FC<Props> = (props) => {
  const [keysList, setKeysList] = React.useState<any[]>([])

  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const [loading, setLoading] = React.useState(true)
  const stoppedRef = React.useRef(true)
  const { createTask } = useTaskQueue()
  const { page, pageStartIndex, pageEndIndex } = useAccountsPagination()
  const { mainCtrl, ledgerCtrl } = useBackgroundService()

  const onImportReady = () => {
    updateStepperState(2, 'hwAuth')
    navigate(WEB_ROUTES.createKeyStore)
  }

  const asyncGetKeys: any = React.useCallback(async () => {
    stoppedRef.current = false
    setLoading(true)

    async function unlockAddresses() {
      let i = pageStartIndex
      for (i = pageStartIndex; i <= pageEndIndex; ) {
        const path = await createTask(() => ledgerCtrl.getPathForIndex(i))
        await createTask(() => ledgerCtrl.unlock(path))
        // console.log('key', key)
        i++
      }
    }

    try {
      await unlockAddresses()
      await mainCtrl.accountAdderInit(
        {
          _preselectedAccounts: []
        },
        'Ledger'
      )

      await createTask(() =>
        mainCtrl.accountAdderGetPage({
          page: 1
        })
      )
      const keys = await mainCtrl.accountAdderGetPageAddresses()
      // TODO: get keys and store them in keysList
      console.log(keys)
      setLoading(false)
    } catch (e: any) {
      console.error(e.message)
      return
    }
    stoppedRef.current = true
  }, [createTask, ledgerCtrl, pageStartIndex, pageEndIndex, mainCtrl])

  const getPage = React.useCallback(async () => {
    setKeysList([])
    asyncGetKeys()
  }, [asyncGetKeys])

  useEffect(() => {
    ;(async () => {
      getPage()
    })()
  }, [page, getPage, mainCtrl])

  return (
    <AccountsList
      accounts={keysList.map((key, i) => ({
        address: key,
        index: pageStartIndex + i + 1
      }))}
      loading={loading}
      onImportReady={onImportReady}
      {...props}
    />
  )
}

export default React.memo(LedgerManager)
