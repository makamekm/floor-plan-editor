const withImages = require('next-images');
const withWorkers = require('@zeit/next-workers');
const withCSS = require('@zeit/next-css');
module.exports = withWorkers(
  withCSS(
    withImages(),
  ),
);