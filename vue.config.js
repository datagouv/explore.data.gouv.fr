const  ManifestPlugin = require('webpack-manifest-plugin');
const baseUrl = './';

module.exports = {
  baseUrl,
  configureWebpack: {
    plugins: [
      new ManifestPlugin({
        // Filter out chunks and source maps
        filter: ({name, isInitial, isChunk}) => !name.endsWith('.map') && (isInitial || !isChunk),
        publicPath: '',
      }),
    ]
  }
}
