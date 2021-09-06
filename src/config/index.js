const os = require('os')
// const boolean = require('boolean')
//
// function defaultBoolean(defaultValue, str) {
//     if (str === undefined || str === null) {
//         return defaultValue
//     }
//     return boolean(str)
// }

const config = {
    appDns: process.env.APP_DNS || 'http://localhost:3000/',
    serviceEndpoint:  process.env.SERVICE_ENDPOINT || 'http://localhost:8080',
}

module.exports = config
