import React, { useEffect, useState } from 'react'

import BackButton from '@common/components/BackButton'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import Stepper from '@web/modules/router/components/Stepper'

const SmartAccountImportScreen = () => {
  const { updateStepperState } = useStepper()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('updating stepper to import-json')
    updateStepperState(WEB_ROUTES.importSmartAccountJson, 'import-json')
  }, [updateStepperState])

  // TODO: navigate to account personalize

  const handleFileUpload = (event: any) => {
    setError('')

    // TODO: handle bad case + validation
    const file = event.target.files[0]
    if (file.type !== 'application/json') {
      setError('Please upload a valid json file')
    }

    file.text().then((contents: string) => {
      try {
        const saJson = JSON.parse(contents)
        console.log(saJson)
      } catch (e) {
        setError('Could not parse file. Please upload a valid json file')
      }
    })
  }

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="md"
      header={
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper />
        </Header>
      }
      footer={<BackButton fallbackBackRoute={ROUTES.dashboard} />}
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Import existing smart account json')}>
          <input type="file" name="smartAccountJson" onChange={handleFileUpload} />
          {!!error && (
            <Text weight="regular" fontSize={10} appearance="errorText">
              {error}
            </Text>
          )}
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default SmartAccountImportScreen
