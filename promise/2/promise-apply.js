let Promise = require('./promise')

let p = new Promise(function (resolve, reject) {
    console.log("start")
    setTimeout(() => {
        reject('error')
        resolve('success')
    }, 3000)
})

p.then((value) => {
    console.log("success1", value)
}, (reason) => {
    console.log('error1', reason)
})

p.then((value) => {
    console.log("success2", value)
}, (reason) => {
    console.log('error2', reason)
})