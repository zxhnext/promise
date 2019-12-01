let fs = require('fs')

function fns() {
    //给类数组添加迭代方法
    let obj = {
        0: 1,
        1: 2,
        2: 3,
        length: 3,
        [Symbol.iterator]: function () {
            let index = 0;
            let that = this;
            //迭代器的概念
            return { //迭代器上拥有next方法
                next() {
                    return {
                        value: that[index++],
                        done: index == that.length
                    }
                }
            }
        }
    };
    let arr = [...obj];
    console.log(Array.isArray(arr), arr);
}

function fns() {
    //给类数组添加迭代方法
    let obj = {
        0: 1,
        1: 2,
        2: 3,
        length: 3,
        [Symbol.iterator]: function* () {
            let that = this;
            let index = 0;
            while (index !== that.length) {
                yield that[index++]
            }
        }
    }
    let arr = [...obj];
    console.log(Array.isArray(arr), arr);
}
fns(1, 2, 3, 4, 5);

function* readAge() {
    let content = yield fs.readFile('./name.txt', 'utf8')
    let age = yield fs.readFile(content, 'utf8')
}

function co(it) {
    // express + koa中间件原理
    return new Promise((resolve, reject) => {
        //如果是异步迭代
        function next(r) { //默认只要没有迭代完成就不能的调用next
            let {
                value,
                done
            } = it.next(r);
            if (!done) {
                value.then(r => {
                    next(r);

                }, reject)
            } else {
                resolve(r);
            }
        }
        next();
    });
}
co(readAge()).then(data => {
    console.log(data);
})