import fs from 'fs'
import path from 'path'

const quotaInBytes = 1048576 // 1mb
describe("Extension's content script", () => {
  it(`Should fit in the file size quota of ${quotaInBytes / (1024 * 1024)}mb`, async () => {
    const rootDir = process.cwd()
    const filePath = path.resolve(rootDir, 'webkit-prod/content-script.js')
    const stats = fs.statSync(filePath)
    const fileSizeInBytes = stats.size

    expect(fileSizeInBytes).toBeLessThan(quotaInBytes)
  })
})
