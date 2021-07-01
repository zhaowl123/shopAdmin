const path = require('path')

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// 代码压缩
const TerserPlugin = require('terser-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const vueConfig = {
  publicPath: './',
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  productionSourceMap: process.env.NODE_ENV !== 'production',
  outputDir: `dist-${process.env.VUE_APP_CURENV}`,
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach((type) => addStyleResource(config.module.rule('less').oneOf(type)))

    // 防止多页面打包卡顿
    config.plugins.delete('named-chunks')

    // 修复HMR
    config.resolve.symlinks(true)

    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
      .set('_v', resolve('src/views'))

    // 设置svg-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // 图片压缩
    // config.module
    //   .rule('images')
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({
    //     bypassOnDebug: true
    //   })
    //   .end()

    // 生产环境
    config.when(process.env.NODE_ENV === 'production', config => {
      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugin('CompressionWebpackPlugin')
        .use(new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        }))

      config.plugin('TerserPlugin')
        .use(new TerserPlugin({
          terserOptions: {
            // 生产环境自动删除console
            compress: {
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        }))

      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after(`html`)
        .use('script-ext-html-webpack-plugin', [{
          inline: /runtime\..*\.js$/
        }])
        .end()

      config
        .optimization.splitChunks({
          chunks: 'all',
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial'
            },
            element: {
              name: 'chunk-element', // 拆分element
              priority: 20, // 权重
              test: /[\\/]node_modules[\\/]_?element-plus(.*)/
            },
            commons: {
              name: 'chunk-commons',
              test: resolve('src/components'),
              minChunks: 3, // 最小使用数
              priority: 5,
              reuseExistingChunk: true
            }
          }
        })

      config.optimization.runtimeChunk('single')

      // 预加载
      config.plugin('preload').tap(() => [{
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }])
      
      config.plugins.delete('prefetch')
    })
  },
  configureWebpack: {
    
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  // 跨域代理
  devServer: {
    proxy: {
      '/api': {
        target: 'http://220.160.52.164:8213',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/variables.less') // 需要全局导入的less
      ]
    })
}

module.exports = vueConfig
