let Promise = require('./promise')

let p = new Promise(function (resolve, reject) {
    console.log("start")
    reject('error')
    resolve('success')
})

p.then((value) => {
    console.log("success1", value)
}, (reason) => {
    console.log('error1', reason)
})