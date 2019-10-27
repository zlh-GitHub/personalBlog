//读取配置文件到对象然后导出
const fs = require("fs");
let globalConf = {};

let confArr = fs.readFileSync("./server.conf").toString().split("\r\n");

confArr.forEach(function(item) {
    let tempArr = item.split("=");
    if (tempArr && tempArr.length === 2) {
        globalConf[tempArr[0].trim()] = tempArr[1].trim();
    }
})


module.exports = globalConf;