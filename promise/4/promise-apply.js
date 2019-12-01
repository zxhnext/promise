let Promise = require('./promise')
// let fs = require('fs')
let p = new Promise(function (resolve, reject) {
    reject('success')
})

// 值的穿透传递
p.then().then().then(data => {
    // console.log(data)
}, err => {
    console.log(err)
})