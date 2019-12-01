function Promise(excutor) {

    const _self = this
    _self.status = 'pending'
    _self.value = undefined
    _self.reason = undefined

    function resolve(value) {
        if (_self.status == 'pending') {
            _self.status = 'resolved'
            _self.value = value
        }
    }

    function reject(reason) {
        if (_self.status == 'pending') {
            _self.status = 'rejected'
            _self.reason = reason
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
}

module.exports = Promise