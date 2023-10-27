module.exports = {
    chainWebpack: config => {
      if(config.plugins.has('extract-css')) {
        const extractCSSPlugin = config.plugin('extract-css')
        extractCSSPlugin && extractCSSPlugin.tap(() => [{
          filename: 'css/[name].[hash:8].css',
          chunkFilename: 'css/[name].[hash:8].css'
        }])
      }
    config.module
    .rule('yaml')
      .test(/\.ya?ml?$/)
      .use('yaml-loader')
        .loader('yaml-loader')
    },
    configureWebpack: {
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js'
      }
    }
  }
