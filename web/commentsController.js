const url = require("url");
const svgCaptcha = require("svg-captcha");
const commentsDao = require("../dao/CommentsDao");
const { getNow } = require("../utils/TimeUtil");
const { writeResult } = require("../utils/RespUtil");

const path = new Map();

function addComment(request, response) {
    request.on("data", function(data) {
        data = JSON.parse(data.toString());
        console.log(data);
        commentsDao.addComment(parseInt(data.blogId), parseInt(data.rootId), data.parent, data.parentname, data.nickname, data.commentContent, data.email, getNow(), getNow(), function(result) {
            response.writeHead(200);
            response.write(writeResult("success", "添加成功", null));
            response.end();
        })
    })
}

path.set("/addComment", addComment);

function randomCaptcha(request, response) {
    //生成随机验证码
    const cap = svgCaptcha.create({
        size: 4,
        noise: 1,
        color: false,
    });
    response.writeHead(200);
    response.write(writeResult("success", "获取成功", cap));
    response.end();
}

path.set("/captcha", randomCaptcha)

function queryCommentsByBid(request, response) {
    let params = url.parse(request.url, true).query;
    let bid = params.bid;
    if (bid < -2 || !bid || isNaN(bid)) {
        response.writeHead(200);
        response.write(writeResult("success", "没有找到", null));
        response.end();
    } else {
        commentsDao.queryByBid(bid, function(result) {
            if (result && result.length > 0) {
                getCommentsCount(bid, function(res) {
                    response.writeHead(200);
                    response.write(writeResult("success", "查找成功", { commentList: result, total: res[0].total }));
                    response.end();
                })
            }
        })
    }
}

path.set("/queryCommentsByBid", queryCommentsByBid);

function getNewComments(request, response) {
    commentsDao.getNewComments(function(result) {
        response.writeHead(200);
        response.write(writeResult("success", "查找成功", result));
        response.end();
    })
}

path.set("/getNewComments", getNewComments)

function getCommentsCount(bid, cb) {
    commentsDao.getCommentsCount(bid, cb)
}

module.exports.path = path;