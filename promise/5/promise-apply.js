let Promise = require("./promise");
let fs = require("fs");

function readFile(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, "utf8", function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}

Promise.race([1, readFile("./name.txt"), readFile("./age.txt")]).then(
    data => {
        console.log(data);
    },
    err => {
        console.log(err);
    }
);

Promise.resolve(1).then(res => {
    console.log(res);
});

Promise.reject("err").then(
    res => {},
    err => {
        console.log(err);
    }
);