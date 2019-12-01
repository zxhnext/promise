// 观察者模式
// ctrl+option+D

/**
 * 被观察者存放在观察者中
 * 提供一个更新方法，当被观察者数据发生变化时，需要执行观察者的update方法
 */
function Observer() {
    this.state = 'unhappy'
    this.arr = []
}

Observer.prototype.attach = function (fn) {
    this.arr.push(fn)
}
Observer.prototype.setState = function (newState) {
    this.state = newState
    this.arr.forEach(fn => fn.update(this.state))
}

/**
 * 观察者
 */
function Subject(name, target) {
    this.name = name
    this.target = target
}

Subject.prototype.update = function (newState) {
    console.log(`${this.name} is ${newState}`)
}

let o = new Observer()
let fn1 = new Subject('小明', o)
let fn2 = new Subject('小红', o)
o.attach(fn1)
o.attach(fn2)
o.setState('happy')
o.setState('bad')