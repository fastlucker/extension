/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const RawSource = require('webpack-sources').RawSource

class AssetReplacePlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('additional-assets', (callback) => {
        const replaceArr = Object.entries(this.options)
          .map(([k, v]) => {
            let assetName
            for (const chunk of compilation.chunks) {
              if (chunk.name === v) {
                assetName = Array.from(chunk.files)[0]
                break
              }
            }
            return [k, assetName]
          })
          .filter(([, assetName]) => assetName)

        const replaceFn = replaceArr
          .map(([k, assetName]) => {
            const content = compilation.assets[assetName].source()

            return (source) => {
              return source.split(new RegExp(`['"]?${k}['"]?`)).join(JSON.stringify(content))
            }
          })
          .reduce((m, n) => (content) => n(m(content)))

        for (const chunk of compilation.chunks) {
          const fileName = Array.from(chunk.files)[0]
          if (!replaceArr.some(([, assetName]) => assetName === fileName)) {
            compilation.assets[fileName] = new RawSource(
              replaceFn(compilation.assets[fileName].source())
            )
          }
        }

        callback()
      })
    })
  }
}

module.exports = AssetReplacePlugin
