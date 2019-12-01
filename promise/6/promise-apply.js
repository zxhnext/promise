let Promise = require("./promise");
let fs = require("fs");
// let fs = require("mz/fs");
// let bluebird = require("bluebird");

function promisify(fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });
    };
}

let readFile = promisify(fs.readFile);

Promise.all([
    1,
    readFile("./name.txt", "utf8"),
    readFile("./age.txt", "utf8")
]).then(
    data => {
        console.log(data);
    },
    err => {
        console.log(err);
    }
);