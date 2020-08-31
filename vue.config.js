'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    publicPath: '/domain/static',

    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    }
}
