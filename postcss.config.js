const path = require("path");

const resolve = dir => {
  return path.join(__dirname, dir)
};

const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/';

module.exports = {
  baseUrl: BASE_URL,
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
        .set('@', resolve('src'))
        .set('_c', resolve('src/components'))
  },
  productionSourceMap: true,
  devServer: {
    proxy: '192.168.18.250:80',
    //proxy: 'localhost:56789',
	changeOrigin: true
  }
};
