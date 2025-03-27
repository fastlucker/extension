import fs from 'fs'

const getRecordingName = (windowType) => {
  const testPath = expect.getState().testPath.split('/tests/')[1]
  const testName = expect.getState().currentTestName

  const name = `./recorder/${testPath}/${testName}/${windowType}.mp4`

  // Check for duplicate names
  if (fs.existsSync(name)) {
    // Match (number) and increment it
    const match = name.match(/\((\d+)\)/)
    if (match) {
      const number = parseInt(match[1], 10) + 1
      return name.replace(/\(\d+\)/, `(${number})`)
    }
    // Add (1) to the name
    return name.replace(/\.mp4$/, '(1).mp4')
  }

  return name
}

export { getRecordingName }
