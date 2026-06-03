const path = require('path');

module.exports = function override(config) {
  // Fix: @mui/system/RtlProvider can't be resolved by webpack because ra-ui-materialui
  // uses strict ESM "fully specified" module resolution. We alias the bare path to the
  // actual index.js file so webpack knows exactly where to look.
  config.resolve.alias = {
    ...config.resolve.alias,
    '@mui/system/RtlProvider': path.resolve(
      __dirname,
      'node_modules/@mui/system/RtlProvider/index.js'
    ),
  };
  return config;
};
