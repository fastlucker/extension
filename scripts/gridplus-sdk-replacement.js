const fs = require('fs')
const path = require('path')

const filePath = path.resolve('node_modules/gridplus-sdk/dist/index.js')

const fileContent = fs.readFileSync(filePath, 'utf-8')

// This hack is needed for version 1.3.4 of gridplus-sdk to work with our proj and might break if another version of gridplus-sdk is installed

// version lower than v1.3.4 won't work for the current implementation of signRawTransaction with Lattice wallet
// because the sig response after sign doesn't contain the (v) component of the (r,s,v) components and sig hash can't be constructed

// gridplus-sdk uses async import for the dotenv config and because
// this is the only package for now that gives us an error because of the async imports
// a hack is applied on postinstall in the node_modules/gridplus-sdk/dist/index file to replace the async dotenv import with a standard/sync import

const updatedContent = fileContent
  .replace(/\s+/g, ' ')
  .trim()
  .replace(
    "switch (_a.label) { case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('dotenv')); })]; case 1: dotenv = _a.sent(); dotenv.config(); return [2 /*return*/]; }",
    'dotenv.config();'
  )

fs.writeFileSync(filePath, updatedContent, 'utf-8')
