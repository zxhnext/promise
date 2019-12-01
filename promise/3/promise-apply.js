let Promise = require('./promise')
// let fs = require('fs')
let p = new Promise(function (resolve, reject) {
    // setTimeout(function () {
    resolve('success')
    // }, 1000)
})
// p.then((data) => {
//     return data
// }).then(data => {
//     console.log(data)
// })

// let promise2 = p.then((data) => {
//     return data
// })

let promise2 = p.then((data) => { // 如果自己等待自己完成，那么当前就走向失败
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(1000)
        }, 1000)
    })
})

promise2.then(data => {
    console.log(data)
}, err => {
    console.log(err)
})

// function readFile(url) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(url, 'utf8', function (err, data) {
//             if (err) reject(err)
//             resolve(data)
//         })
//     })
// }

// 链式调用特点
// 1) 如果一个then方法 返回一个普通值这个值会传递给下一次then中作为成功的结果
// 2)不是普通值 (promise 或者报错了)
// 3)如果返回的是一个promise 会根据返回的promise是成功还是失败决定下一个then是成功还是失败
// 4)捕获错误机制 (1.默认会找离自己最近的then的失败) 找不到就向下找
// 5) jquery链式调用返回this promise调用then后 会返回一个新的promise
// readFile('name.txt').then(data => {
//     return readFile(data)
// }).then(data => {
//     return 100
// }).then(data => {
//     console.log(data)
// }).catch(err => {
//     console.log(err)
// })