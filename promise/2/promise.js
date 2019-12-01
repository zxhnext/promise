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
    excutor(resolve, reject) // 立即执行
}

Promise.prototype.then = function (onFulfilled, onRejected) {

    const _self = this
    if (_self.status == 'resolved') {
        onFulfilled(_self.value)
    }
    if (_self.status == 'rejected') {
        onRejected(_self.reason)
    }
    if (_self.status == 'pending') {
        // 订阅
        _self.onFulfilledCallbacks.push(function () {
            onFulfilled(_self.value)
        })
        _self.onRejectedCallbacks.push(function () {
            onRejected(_self.reason)
        })
    }
}

module.exports = Promise