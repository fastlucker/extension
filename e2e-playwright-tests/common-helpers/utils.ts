// ToDo Migration: clean up with sorting out Playwright style recording
import { expect } from '@playwright/test'
import fs from 'fs'

const getRecordingName = (windowType) => {
  const state = expect.getState() as { testPath: string; currentTestName: string }

  const testPath = state.testPath.split('/tests/')[1]
  const testName = state.currentTestName
  const sanitizedTestName = testName.replace(/[":<>|*?\r\n]/g, '')

  const name = `./recorder/${testPath}/${sanitizedTestName}/${windowType}.mp4`

  if (fs.existsSync(name)) {
    const match = name.match(/\((\d+)\)/)
    if (match) {
      const number = parseInt(match[1], 10) + 1
      return name.replace(/\(\d+\)/, `(${number})`)
    }
    return name.replace(/\.mp4$/, '(1).mp4')
  }

  return name
}

export { getRecordingName }
