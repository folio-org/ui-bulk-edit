const sharedConfig = require('@folio/stripes-acq-components/jest.config');

const esModules = [
  '@folio',
  '@json2csv',
  'decode-uri-component',
  'filter-obj',
  'find-up',
  'get-stdin',
  'global-dirs',
  'import-lazy',
  'inquirer',
  'is-path-inside',
  'jspdf',
  'keyboardjs',
  'ky',
  'query-string',
  'resolve-from',
  'resolve-pkg',
  'split-on-first',
  'uuid',
].join('|');

module.exports = {
  ...sharedConfig,
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};
