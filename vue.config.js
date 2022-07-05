module.exports = {
    chainWebpack: config => {
      if(config.plugins.has('extract-css')) {
        const extractCSSPlugin = config.plugin('extract-css')
        extractCSSPlugin && extractCSSPlugin.tap(() => [{
          filename: 'css/[name].css'
        }])
      }
    },
    configureWebpack: {
      output: {
        filename: 'js/[name].js'
      }
    }
  }
