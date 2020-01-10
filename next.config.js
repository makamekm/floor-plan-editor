const withImages = require('next-images');
const withWorkers = require('@zeit/next-workers');
const withCSS = require('@zeit/next-css');
const withOffline = require('next-offline');
const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')

module.exports = withWorkers(
  withCSS(
    withImages({
      webpack(config) {
        config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
        return config
      }
    })
  )
);
