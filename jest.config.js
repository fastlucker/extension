require('dotenv').config();

module.exports = {
  preset: 'jest-puppeteer',
  roots: ['tests'],
  testTimeout: 300000
};
