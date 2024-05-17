import fs from 'fs'
import path from 'path'

describe("Extension's content script", () => {
  it('Should fit in the file size quota (1mb)', async () => {
    const rootDir = process.cwd()
    const filePath = path.resolve(rootDir, 'webkit-prod/content-script.js')
    const stats = fs.statSync(filePath)
    const fileSizeInBytes = stats.size

    const oneMBInBytes = 1048576
    expect(fileSizeInBytes).toBeLessThan(oneMBInBytes)
  })
})
