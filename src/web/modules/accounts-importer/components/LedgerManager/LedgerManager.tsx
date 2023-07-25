import React, { useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import AccountsList from '@web/modules/accounts-importer/components/AccountsList'
import useAccountsPagination from '@web/modules/accounts-importer/hooks/useAccountsPagination'
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
        // eslint-disable-next-line no-await-in-loop
        const keys = (await createTask(() =>
          hardwareWallets[HARDWARE_WALLETS.LEDGER].getKeys(i, i)
        )) as any[]
        setKeysList((prev) => [...prev, ...keys])
        setLoading(false)
        i++
      }
    } catch (e) {
      console.error(e.message)
      return
    }
    stoppedRef.current = true
  }, [createTask, hardwareWallets, pageStartIndex, pageEndIndex])

  const runGetKeys = React.useCallback(async () => {
    setKeysList([])
    asyncGetKeys()
  }, [asyncGetKeys])

  useEffect(() => {
    runGetKeys()
  }, [page, runGetKeys])

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
