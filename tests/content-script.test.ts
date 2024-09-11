import fs from 'fs'
import path from 'path'

const quotaInBytes = 350000 // 0.35mb
describe("Extension's content script", () => {
  it(`Should fit in the file size quota of ${quotaInBytes / (1024 * 1024)}mb`, async () => {
    if (process.env.WEBPACK_BUILD_OUTPUT_PATH?.includes('webkit-dev')) {
      return 'This test should check the production build script size only!'
    }
    const rootDir = process.cwd()
    const filePath = path.resolve(rootDir, 'build/webkit-prod/content-script.js')
    const stats = fs.statSync(filePath)
    const fileSizeInBytes = stats.size

    expect(fileSizeInBytes).toBeLessThan(quotaInBytes)
  })
})
