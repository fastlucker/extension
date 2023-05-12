import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { View } from 'react-native'

import JsonIcon from '@common/assets/svg/JsonIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { Trans, useTranslation } from '@common/config/localization'
import useJsonLogin from '@common/modules/auth/hooks/useJsonLogin'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import text from '@common/styles/utils/text'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import styles from '@web/components/AuthLayoutWrapper/styles'

import s from './styles'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { handleLogin, error, inProgress } = useJsonLogin()
  const [file, setFile] = useState<any>(null)
  const onDrop = useCallback((res: any) => {
    setFile(res)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  useEffect(() => {
    return () => {
      setFile(null)
    }
  }, [])

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View style={styles.mainContentWrapper}>
          {/* @ts-ignore */}
          <View {...getRootProps()} style={s.dropAreaContainer}>
            <View style={s.dropArea}>
              <input {...getInputProps()} />
              <JsonIcon />
              {isDragActive ? (
                <Text weight="regular" style={text.center}>
                  {t('Drop the files here...')}
                </Text>
              ) : (
                <Trans>
                  <Text weight="regular" style={text.center}>
                    {'Drop your JSON file here,\nor '}
                    <Text color={colors.violet} weight="regular">
                      upload
                    </Text>
                    <Text weight="regular">{' from your computer.'}</Text>
                  </Text>
                </Trans>
              )}
            </View>
          </View>
          {!!file && (
            <Button
              disabled={inProgress}
              text={inProgress ? t('Importing...') : t('Import Account')}
              onPress={() => handleLogin({ file })}
              hasBottomSpacing={!error || isWeb}
            />
          )}
          {!!error && (
            <View style={spacings.ptTy}>
              <Text appearance="danger" fontSize={12} style={spacings.ph}>
                {error}
              </Text>
            </View>
          )}
        </View>
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
        <Text weight="regular" fontSize={16} style={spacings.mb} color={colors.titan}>
          {t('Import JSON')}
        </Text>
        <Text weight="regular" color={colors.titan}>
          {t('Upload a JSON file to quickly and securely access your existing wallet.')}
        </Text>
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default JsonLoginScreen
