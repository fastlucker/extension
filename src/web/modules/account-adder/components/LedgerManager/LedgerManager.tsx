import React, { useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useBackgroundService from '@web/hooks/useBackgroundService'
import AccountsList from '@web/modules/account-adder/components/AccountsList'
import useAccountsPagination from '@web/modules/account-adder/hooks/useAccountsPagination'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import useHardwareWallets from '@web/modules/hardware-wallet/hooks/useHardwareWallets'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

interface Props {}

const LedgerManager: React.FC<Props> = (props) => {
  const [keysList, setKeysList] = React.useState<any[]>([])

  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const [loading, setLoading] = React.useState(true)
  const stoppedRef = React.useRef(true)
  const { createTask } = useTaskQueue()
  const { hardwareWallets } = useHardwareWallets()
  const { page, pageStartIndex, pageEndIndex } = useAccountsPagination()
  const { mainCtrl } = useBackgroundService()

  const onImportReady = () => {
    updateStepperState(2, 'hwAuth')
    navigate(WEB_ROUTES.createKeyStore)
  }

  const asyncGetKeys: any = React.useCallback(async () => {
    stoppedRef.current = false
    setLoading(true)
    let i = pageStartIndex
    try {
      await createTask(() => hardwareWallets[HARDWARE_WALLETS.LEDGER].unlock())
      for (i = pageStartIndex; i <= pageEndIndex; ) {
        // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-loop-func
        await createTask(() =>
          mainCtrl.accountAdderGetPage({
            page: i + 1
          })
        )
        setLoading(false)
        i++
      }
    } catch (e) {
      console.error(e.message)
      return
    }

    const keys = await mainCtrl.accountAdderGetSelectedAccounts()
    // TODO: get keys and store them in keysList
    console.log(keys)
    stoppedRef.current = true
  }, [createTask, hardwareWallets, pageStartIndex, pageEndIndex, mainCtrl])

  const getPage = React.useCallback(async () => {
    setKeysList([])
    asyncGetKeys()
  }, [asyncGetKeys])

  useEffect(() => {
    ;(async () => {
      await mainCtrl.accountAdderInit({
        _preselectedAccounts: [],
        _pageSize: 1
      })
      getPage()
    })()
  }, [page, getPage, hardwareWallets, mainCtrl])

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
