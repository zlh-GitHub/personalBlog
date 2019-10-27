const tagsDao = require("../dao/TagsDao");
const url = require("url");
const { getNow } = require("../utils/TimeUtil");
const { writeResult } = require("../utils/RespUtil");

const path = new Map();


function getTags(request, response) {
    tagsDao.queryAllTags(function(result) {
        response.writeHead(200);
        response.write(writeResult("success", "查找成功", result));
        response.end();
    })
}

path.set("/getTags", getTags);


module.exports.path = path;