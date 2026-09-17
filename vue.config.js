module.exports = {
    chainWebpack: config => {
      if(config.plugins.has('extract-css')) {
        const extractCSSPlugin = config.plugin('extract-css')
        extractCSSPlugin && extractCSSPlugin.tap(() => [{
          filename: 'css/[name].[hash:8].css',
          chunkFilename: 'css/[name].[hash:8].css'
        }])
      }
      // maplibre v6 loads its tile worker from a real URL (see src/main.js) —
      // serve the worker chunks straight from node_modules so they always
      // match the installed maplibre-gl version
      config.plugin('copy').tap(args => {
        args[0].patterns.push(
          ...['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'].flatMap(f => [
            { from: `node_modules/maplibre-gl/dist/${f}`, to: f },
            { from: `node_modules/maplibre-gl/dist/${f}.map`, to: `${f}.map` },
          ])
        )
        return args
      })
    config.module
    .rule('yaml')
      .test(/\.ya?ml?$/)
      .use('yaml-loader')
        .loader('yaml-loader')
    },
    transpileDependencies: [
      'chartjs-chart-treemap'
    ],
    css: {
      loaderOptions: {
        sass: {
          sassOptions: {
            silenceDeprecations: ['legacy-js-api']
          }
        },
        scss: {
          sassOptions: {
            silenceDeprecations: ['legacy-js-api']
          }
        }
      }
    },
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