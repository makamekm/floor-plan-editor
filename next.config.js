const withImages = require('next-images');
const withWorkers = require('@zeit/next-workers');
const withCSS = require('@zeit/next-css');
const withOffline = require('next-offline')
module.exports = withOffline(
  withWorkers(
    withCSS(
      withImages(),
    ),
  ),
);