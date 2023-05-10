module.exports = {
    chainWebpack: config => {
      if(config.plugins.has('extract-css')) {
        const extractCSSPlugin = config.plugin('extract-css')
        extractCSSPlugin && extractCSSPlugin.tap(() => [{
          filename: 'css/[name].[hash:8].css',
          chunkFilename: 'css/[name].[hash:8].css'
        }])
      }
    },
    configureWebpack: {
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js'
      }
    }
  }
