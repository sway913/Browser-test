/* eslint-disable */
const {
  getConfig,
  applyEntries,
  getBaseConfig,
  dev,
} = require('./webpack.config.base');
const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
/* eslint-enable */

const PORT = 4444;

const appConfig = getConfig(getBaseConfig('app'), {
  target: 'web',

  devServer: {
    static: {
      directory: join(__dirname, 'build'),
    },
    port: PORT,
    hot: true,
    allowedHosts: ['localhost', '127.0.0.1'],
  },

  plugins: dev
    ? [
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
      ]
    : [],

  performance: {
    maxEntrypointSize: 3145728,
    maxAssetSize: 3145728,
  },
});

const extPopupConfig = getConfig({
  target: 'web',

  entry: {},
  output: {},
});

applyEntries(appConfig, [
  'app',
  'preview',
  'tabgroup',
  'settings',
  'newtab',
]);

module.exports = appConfig;

