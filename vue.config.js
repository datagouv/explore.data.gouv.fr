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
    transpileDependencies: [
      'chartjs-chart-treemap'
    ],
    configureWebpack: {
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js'
      }
    },
    devServer: {
      proxy: {
        '/api/tabular': {
          target: 'https://tabular-api.data.gouv.fr',
          changeOrigin: true,
          pathRewrite: {
            '^/api/tabular': '/api'
          }
        }
      }
    },
    pluginOptions: {
      i18n: {
        locale: 'fr',
        fallbackLocale: 'fr',
        localeDir: 'locales',
        enableInSFC: false,
        enableBridge: false
      }
    }
  }