import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { View } from 'react-native'

import JsonIcon from '@common/assets/svg/JsonIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { Trans, useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import text from '@common/styles/utils/text'
import getStyles from '@web/components/TabLayoutWrapper/styles'
import {
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'

import s from './styles'

const JsonLoginScreen = () => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  const [file, setFile] = useState<any>(null)
  const onDrop = useCallback(async (res: any) => {
    const fileReaderPromise = new Promise((resolve, reject) => {
      const reader: any = new FileReader()
      reader.onload = () => {
        resolve(JSON.parse(reader.result))
      }
      reader.onerror = reject
      reader.readAsText(res[0])
    })

    const json = await fileReaderPromise
    setFile(json)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  useEffect(() => {
    return () => {
      setFile(null)
    }
  }, [])

  return (
    <>
      <TabLayoutWrapperMainContent>
        <div
          {...getRootProps()}
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column'
          }}
        >
          <View style={styles.mainContentWrapper}>
            {/* @ts-ignore */}
            <View style={s.dropAreaContainer}>
              <View style={s.dropArea}>
                <input {...getInputProps()} />
                <JsonIcon />
                {isDragActive ? (
                  <Text weight="regular" style={text.center}>
                    {t('Drop your file here...')}
                  </Text>
                ) : (
                  <Trans>
                    <Text weight="regular" style={text.center}>
                      {'Drop your JSON file here,\nor '}
                      <Text appearance="primary" weight="regular">
                        upload
                      </Text>
                      <Text weight="regular">{' from your computer.'}</Text>
                    </Text>
                  </Trans>
                )}
              </View>
            </View>

            {!!file && (
              <>
                <View style={spacings.mbLg}>
                  <Text weight="regular" style={[text.center, spacings.mb]} color={colors.husk}>
                    {t('Legacy Account found:')}
                    <Text weight="semiBold" style={spacings.phTy} color={colors.husk}>
                      {`${file?.id?.slice(0, 5)}...${file?.id?.slice(-5)}`}
                    </Text>
                  </Text>
                </View>
                <Button text={t('Import Account')} onPress={() => null} hasBottomSpacing={isWeb} />
              </>
            )}
          </View>
        </div>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent backgroundType="beta">
        <Text weight="regular" fontSize={16} style={spacings.mb} color={colors.titan}>
          {t('Import JSON')}
        </Text>
        <Text weight="regular" color={colors.titan}>
          {t('Upload a JSON file to quickly and securely access your existing wallet.')}
        </Text>
      </TabLayoutWrapperSideContent>
    </>
  )
}

export default JsonLoginScreen
