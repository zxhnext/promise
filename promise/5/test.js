let fs = require('fs')
let Promise = require('./promise')

function read(url) {
    let defer = Promise.defer()
    fs.readFile(url, 'utf8', (err, data) => {
        if (err) defer.reject(err)
        defer.resolve(data)
    })
    return defer.promise;
}

read('./name.txt').then(res => {
    console.log(res)
})