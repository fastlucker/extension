const fs = require('fs')
const path = require('path')

const filePath = path.resolve('node_modules/gridplus-sdk/dist/index.js')

const fileContent = fs.readFileSync(filePath, 'utf-8')

// gridplus-sdk uses async import for the dotenv config and because
// this is the only package for now that gives us an error because of the async imports
// a hack is applied in the dist file to replace it with a standard/sync import

const updatedContent = fileContent
  .replace(/\s+/g, ' ')
  .trim()
  .replace(
    "switch (_a.label) { case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('dotenv')); })]; case 1: dotenv = _a.sent(); dotenv.config(); return [2 /*return*/]; }",
    'dotenv.config();'
  )

fs.writeFileSync(filePath, updatedContent, 'utf-8')
