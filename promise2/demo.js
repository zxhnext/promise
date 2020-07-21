/*
 * @Author: your name
 * @Date: 2020-07-20 16:12:14
 * @LastEditTime: 2020-07-21 20:31:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /promise/promise2/demo.js
 */ 
const MyPromise = require('./promise')
new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(new Promise((resolve, reject) => {
            resolve(5)
        }))
    }, 1000)
}).then(res => {
    console.log('000', res)
}).then(res => {
    console.log('111', res)
})

// 返回值
// let promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve()
//     }, 1000)
// })
// promise2 = promise1.then(res => {
//     // 返回一个普通值
//     return '这里返回一个普通值'
// })
// promise2.then(res => {
//     console.log(res) //1秒后打印出：这里返回一个普通值
// })

// 返回promise
// let promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve()
//     }, 1000)
// })
// promise2 = promise1.then(res => {
//     // 返回一个Promise对象
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//        resolve('这里返回一个Promise')
//       }, 2000)
//     })
// })
// promise2.then(res => {
//     console.log(res) //3秒后打印出：这里返回一个Promise
// })

// 抛出异常
// let promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('success')
//     }, 1000)
// })
// promise2 = promise1.then(res => {
//     throw new Error('这里抛出一个异常e')
// })
// promise2.then(res => {
//     console.log(res)
// }, err => {
//     console.log(err) //1秒后打印出：这里抛出一个异常e
// })

// 如果onFulfilled 不是函数且 promise1 状态为成功（Fulfilled）， promise2 必须变为成功（Fulfilled）并返回 promise1 成功的值
// let promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('success')
//     }, 1000)
// })
// promise2 = promise1.then('这里的onFulfilled本来是一个函数，但现在不是')
// promise2.then(res => {
//     console.log(res) // 1秒后打印出：success
// }, err => {
//     console.log(err)
// })
 
// 如果 onRejected 不是函数且 promise1 状态为失败（Rejected），promise2必须变为失败（Rejected） 并返回 promise1 失败的值
// let promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject('fail')
//     }, 1000)
// })
// promise2 = promise1.then(res => res, '这里的onRejected本来是一个函数，但现在不是')
// promise2.then(res => {
//     console.log(res)
// }, err => {
//     console.log(err)  // 1秒后打印出：fail
// })
  