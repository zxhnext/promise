/*
 * @Author: your name
 * @Date: 2020-07-20 16:12:01
 * @LastEditTime: 2020-07-20 20:43:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /promise/promise2/promise.js
 */ 

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
    const _self = this;
    this.value = undefined;
    this.reason = undefined;
    this.status = PENDING;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    function resolve(value) {
        // if (value instanceof MyPromise) {
        //     return value.then(resolve, reject);
        // }
        if (_self.status === PENDING) {
            setTimeout(() => {
                _self.status = FULFILLED;
                _self.value = value;
                _self.onFulfilledCallbacks.forEach(callback => callback(_self.value));
            }, 0)
        }
    }

    function reject(reason) {
        if (_self.status === PENDING) {
            setTimeout(function() {
                _self.status = REJECTED;
                _self.reason = reason;
                _self.onRejectedCallbacks.forEach(callback => callback(_self.reason));
            }, 0)
        }
    }
    try {
        fn(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

// 用来解析回调函数的返回值x，x可能是普通值也可能是个promise对象
function resolvePromise(bridgepromise, x, resolve, reject) {
    // 2.3.1规范，避免循环引用
    if (bridgepromise === x) {
        return reject(new TypeError('Circular reference'));
    }

    let called = false; // 只允许调用一次resolve/reject,以第一次为准
    // 2.3.3规范，如果 x 为对象或者函数
    if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
        try {
            // 是否是thenable对象（具有then方法的对象/函数）
            //2.3.3.1 将 then 赋为 x.then
            let then = x.then; // 如果then具有getter属性，此时获取会发生异常
            if (typeof then === 'function') {
                // 2.3.3.3 如果 then 是一个函数，以x为this调用then函数，且第一个参数是resolvePromise，第二个参数是rejectPromise
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    // 一直解析，直到结果为常量为止
                    resolvePromise(bridgepromise, y, resolve, reject);
                }, error => {
                    if (called) return;
                    called = true;
                    reject(error);
                })
            } else { // 是一个普通对象
                // 2.3.3.4 如果 then不是一个函数，则 以x为值fulfill promise。
                resolve(x);
            }
        } catch (e) {
            // 2.3.3.2 如果在取x.then值时抛出了异常，则以这个异常做为原因将promise拒绝。
            if (called) return;
            called = true;
            reject(e);
        }
    } else { // 普通值，直接返回即可
        // 如果x是一个普通值，就让bridgePromise的状态fulfilled，并把这个值传递下去
        resolve(x);
    }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
    const _self = this;
    let bridgePromise;
    //防止使用者不传成功或失败回调函数，所以成功失败回调都给了默认回调函数
    // 值的穿透传递
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };
    if (this.status === FULFILLED) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            setTimeout(() => { // 因为new过程中还未拿到bridgePromise，所以这里走异步，以拿到promise2
                try {
                    // 函数返回值
                    let x = onFulfilled(_self.value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e); // 如果执行函数时抛出失败，那么会走向下一个失败状态
                }
            }, 0);
        })
    }
    if (this.status === REJECTED) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(_self.reason);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            }, 0);
        });
    }
    if (this.status === PENDING) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            _self.onFulfilledCallbacks.push((value) => {
                try {
                    let x = onFulfilled(value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            _self.onRejectedCallbacks.push((reason) => {
                try {
                    let x = onRejected(reason);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}

//catch方法其实是个语法糖，就是只传onRejected不传onFulfilled的then方法
MyPromise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
}

MyPromise.all = function(promises) {
    return new MyPromise(function(resolve, reject) {
        let result = [];
        let count = 0;
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function(data) {
                result[i] = data;
                if (++count == promises.length) {
                    resolve(result);
                }
            }, function(error) {
                reject(error);
            });
        }
    });
}

MyPromise.race = function(promises) {
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

MyPromise.resolve = function(value) {
    return new MyPromise(resolve => {
        resolve(value);
    });
}

MyPromise.reject = function(error) {
    return new MyPromise((resolve, reject) => {
        reject(error);
    });
}

MyPromise.promisify = function(fn) {
    return function() {
        var args = Array.from(arguments);
        return new MyPromise(function(resolve, reject) {
            fn.apply(null, args.concat(function(err) {
                err ? reject(err) : resolve(arguments[1])
            }));
        })
    }
}

// 执行测试用例需要用到的代码
MyPromise.deferred = function() {
    let defer = {};
    defer.promise = new MyPromise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}
try {
    module.exports = MyPromise
} catch (e) {}
