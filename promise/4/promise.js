function Promise(excutor) {

    const _self = this
    _self.status = 'pending'
    _self.value = undefined
    _self.reason = undefined
    _self.onFulfilledCallbacks = [] // 存放所有成功回调
    _self.onRejectedCallbacks = [] // 存放所有失败回调

    function resolve(value) {
        if (_self.status == 'pending') {
            _self.status = 'resolved'
            _self.value = value
            // 发布
            _self.onFulfilledCallbacks.forEach(fn => fn())
        }
    }

    function reject(reason) {
        if (_self.status == 'pending') {
            _self.status = 'rejected'
            _self.reason = reason
            // 发布
            _self.onRejectedCallbacks.forEach(fn => fn())
        }
    }
    try {
        excutor(resolve, reject) // 立即执行
    } catch (e) {
        reject(e)
    }

}

function resolvePromise(promise2, x, resolve, reject) { // 判断x是否是promise
    if (promise2 === x) { // 防止自己等待自己
        return reject(new TypeError('循环引用'))
    }
    let called; // 表示当前是否被调用过,防止多次调用成功或失败
    if ((x !== null && typeof x === 'object') || typeof x === 'function') { // 保证当前x为引用类型
        // 很有可能是一个promise
        try {
            let then = x.then // 如果then具有getter属性，此时获取会发生异常
            if (typeof then === 'function') { // 认为是promise
                then.call(x, y => { // y有可能是个promise
                    if (called) return
                    called = true
                    // 一直解析，直到结果为常量为止
                    resolvePromise(promise2, y, resolve, reject)
                    // resolve(y) // 成功拿到结果，使promise2变为成功态
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else { // 是一个普通对象
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }

    } else { // 普通值，直接返回即可
        resolve(x)
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {

    // 值的穿透传递
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
        throw err
    }

    const _self = this
    // 调用then后再返回一个新的promise
    // 拿到当前then方法成功或失败执行的结果
    let promise2 = new Promise(function (resolve, reject) {
        if (_self.status == 'resolved') {
            setTimeout(() => { // 因为new过程中还未拿到promise2，所以这里走异步，以拿到promise2
                try {
                    let x = onFulfilled(_self.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e) // 如果执行函数时抛出失败，那么会走向下一个失败状态
                }
            }, 0)
        }
        if (_self.status == 'rejected') {
            setTimeout(() => {
                try {
                    let x = onRejected(_self.reason)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0)
        }
        if (_self.status == 'pending') {
            // 订阅
            _self.onFulfilledCallbacks.push(function () {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(_self.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)

            })
            _self.onRejectedCallbacks.push(function () {
                setTimeout(() => {
                    try {
                        let x = onRejected(_self.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            })
        }
    })
    return promise2
}

// 实现一个promise延迟对象 defer
Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

module.exports = Promise

// promises-aplus-tests
// promises-aplus-tests promise.js