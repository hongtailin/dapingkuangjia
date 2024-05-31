const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    //publicPath: process.env.NODE_ENV === 'production' ? '/yanji_show' : '/yanji_show',
    transpileDependencies: true,
    outputDir: 'dist',
    devServer: {
        host: '0.0.0.0',
        port: 8081,
        proxy: {
            '/api': {
                target: process.env.VUE_APP_TARGET,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
})
