const everyDayDao = require("../dao/EveryDayDao");
const url = require("url");
const { getNow } = require("../utils/TimeUtil");
const { writeResult } = require("../utils/RespUtil");

const path = new Map();


function editEveryDay(request, response) {
    request.on("data", function(data) {
        everyDayDao.insertEveryDay(data.toString(), getNow(), function(result) {
            response.writeHead(200);
            response.write(writeResult("success", "添加成功", null));
            response.end();
        })
    })
}

path.set("/editEveryDay", editEveryDay);

function queryEveryDay(request, response) {
    everyDayDao.queryEveryDay(function(result) {
        if (result && result.length > 0) {
            response.writeHead(200);
            response.write(writeResult("success", "查找成功", result[0].content));
            response.end();
        } else {
            response.writeHead(200);
            response.write(writeResult("fail", "未查找到数据", null));
            response.end();
        }
    })
}

path.set("/queryEveryDay", queryEveryDay)

module.exports.path = path;