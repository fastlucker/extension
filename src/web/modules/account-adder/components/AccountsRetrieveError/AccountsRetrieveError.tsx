import React, { useCallback, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { Pressable } from 'react-native'

import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { createTab } from '@web/extension-services/background/webapi/tab'

interface Props {
  pageError: AccountAdderController['pageError']
  page: AccountAdderController['page']
  setPage: (page: number) => void
}

const AccountsRetrieveError: React.FC<Props> = ({ pageError, page, setPage }) => {
  const { addToast } = useToast()

  const handleRetrySetPage = useCallback(() => setPage(page), [setPage, page])

  const handleContactSupport = useCallback(async () => {
    try {
      await createTab('https://help.ambire.com/hc/en-us/requests/new')
    } catch {
      addToast("Couldn't open link", { type: 'error' })
    }
  }, [addToast])

  const fallbackMessage = useMemo(
    () => (
      <Trans style={[spacings.mt, spacings.mbTy]}>
        <Text appearance="errorText">
          The process of retrieving accounts was cancelled or it failed.
          {'\n\n'}
          Please go back and start the account-adding process again. If the problem persists, please{' '}
          <Pressable onPress={handleContactSupport}>
            <Text appearance="errorText" underline>
              contact our support team
            </Text>
          </Pressable>
          .
        </Text>
      </Trans>
    ),
    [handleContactSupport]
  )

  return (
    <>
      {pageError ? (
        <Text appearance="errorText" style={[spacings.mt, spacings.mb]}>
          {pageError}
        </Text>
      ) : (
        fallbackMessage
      )}
      <Button
        style={[flexbox.alignSelfCenter, spacings.mtLg, spacings.mb2Xl]}
        size="small"
        text={t(`Retry Request (Page ${page})`)}
        onPress={handleRetrySetPage}
      />
    </>
  )
}

export default React.memo(AccountsRetrieveError)
