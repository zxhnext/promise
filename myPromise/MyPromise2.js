/*
 * @Author: your name
 * @Date: 2020-07-21 21:08:59
 * @LastEditTime: 2020-07-21 21:48:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /promise/myPromise/MyPromise2.js
 */
const { resolve } = require("../promise2/promise")

 

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function MyPromise(fn) {
    const _self = this
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallbacks = [] // 存放所有成功回调
    this.onRejectedCallbacks = [] // 存放所有失败回调

    function resolve(value) {
        if(_self.status === PENDING) {
            _self.status = FULFILLED
            _self.value = value
            _self.onFulfilledCallbacks.forEach(cb => cb(_self.value))
        }
    }

    function reject(reason) {
        if(_self.status === PENDING) {
            _self.status = REJECTED
            _self.reason = reason
            _self.onRejectedCallbacks.forEach(cb => cb(_self.reason))
        }
    }

    try{
        fn(resolve, reject)
    }catch(error) {
        reject(error)
    }
}

function resolvePromise(bridgepromise, x, resolve, reject) {
    if(bridgepromise === x) {
        reject(new TypeError('循环引用'))
    }

    let called = false
    if((x !== null && typeof x === 'object') || (typeof x === 'function')) {
        try {
            let then = x.then
            if(typeof then === 'function') {
                then.call(x, y => {
                    if(called) return
                    called = true
                    resolvePromise(bridgepromise, y, resolve, reject)
                }, error => {
                    if(called) return
                    called = true
                    reject(error)
                })
            } else {
                resolve(x)
            }
        } catch (error) {
            if(called) return
            called = true
            reject(error)
        }
    } else {
        resolve(x)
    }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    const _self = this
    let bridgepromise;

    return bridgepromise = new MyPromise((resolve, reject) => {
        if(_self.status === PENDING) {
            _self.onFulfilledCallbacks.push((value) => {
                setTimeout(() => {
                    try{
                        let x = onFulfilled(value)
                        resolvePromise(bridgepromise, x, resolve, reject)
                    }catch(error){
                        reject(error)
                    }
                }, 0)
            })
            _self.onRejectedCallbacks.push((reason) => {
                setTimeout(() => {
                    try{
                        let x = onRejected(reason)
                        resolvePromise(bridgepromise, x, resolve, reject)
                    }catch(error){
                        reject(error)
                    }
                }, 0)
            })
        }
        if(_self.status === FULFILLED) {
            setTimeout(() => {
                try{
                    let x = onFulfilled(_self.value)
                    resolvePromise(bridgepromise, x, resolve, reject)
                }catch(error){
                    reject(error)
                }
            }, 0)
        }
        if(_self.status === REJECTED) {
            setTimeout(() => {
                try{
                    let x = onRejected(_self.reason)
                    resolvePromise(bridgepromise, x, resolve, reject)
                }catch(error){
                    reject(error)
                }
            }, 0)
        }
    })
}

MyPromise.prototype.catch = function(onRejected) {
    this.then(null, onRejected)
}

MyPromise.prototype.all = function(promises) {
    return new MyPromise(function(resolve, reject) {
        const result = []
        let count = 0
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function(data) {
                result[i] = data
                if(++count === result.length) {
                    resolve(result)
                }
            }, function(error) {
                reject(error);
            })
        }
        // promises.forEach(promise => {
        //     promise.then(data => {
        //         result.push(data)
        //         count++
        //         if(result.length === count) {
        //             resolve(result)
        //         }
        //     }, function(error) {
        //         reject(error);
        //     })
        // })
    })
}

MyPromise.prototype.race = function(promises) {
    return new MyPromise(function(resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function(data) {
                resolve(data);
            }, function(error) {
                reject(error);
            });
        }
    });
}

MyPromise.prototype.resolve = function(value) {
    return new MyPromise(resolve => {
        resolve(value);
    });
}

MyPromise.prototype.reject = function(error) {
    return new MyPromise((resolve, reject) => {
        reject(error);
    });
}

MyPromise.prototype.promisify = function(fn) {
    return function() {
        var args = Array.from(arguments);
        return new MyPromise(function(resolve, reject) {
            fn.apply(null, args.concat(function(err) {
                err ? reject(err) : resolve(arguments[1])
            }));
        })
    }
}

MyPromise.prototype.finally = function (cb) {
    return this.then((value) => {
        return Promise.resolve(cb()).then(() => {
            return value;
        });
    }, (err) => {
        return Promise.resolve(cb()).then(() => {
            throw err;
        });
    });

    // return this.then(
    //   value  => MyPromise.resolve(cb()).then(() => value),
    //   reason => MyPromise.resolve(cb()).then(() => { throw reason })
    // );
}


MyPromise.deferred = function() {
    let defer = {};
    defer.promise = new MyPromise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}

module.exports = MyPromise
