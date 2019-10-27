const url = require("url");
const globalConf = require("../config");
const blogDao = require("../dao/BlogDao");
const tagsDao = require("../dao/TagsDao");
const tagBlogMappingDao = require("../dao/TagBlodMappingDao");
const { getNow } = require("../utils/TimeUtil");
const { writeResult } = require("../utils/RespUtil");

const path = new Map();

function editBlog(request, response) {
    request.on("data", function(data) {
        // data = JSON.parse(data.toString());
        data = data.toString();
        data = JSON.parse(data);
        let tags = data.tags.replace(/ /g, "").replace(/，/g, ",").split(",");
        let tagList = tags.filter(function(item) {
            return item != "";
        })
        tags = tags.join(",");
        blogDao.insertBlog(data.title, data.content, 0, tags, getNow(), getNow(), function(result) {
            response.writeHead(200);
            response.write(writeResult("success", "添加成功", null));
            response.end();
            const blogId = result.insertId;
            for (let i = 0; i < tagList.length; i++) {
                queryTagByName(tagList[i], blogId);
            }
        })
    })
}

path.set("/editBlog", editBlog);

function queryBlogByPage(request, response) {
    let params = url.parse(request.url, true).query;
    let page = params.page;
    let searchValue = params.searchValue ? params.searchValue : null;
    blogDao.queryBlogByPage(page, searchValue, function(result) {
        let resp = [];
        for (let i = 0; i < result.length; i++) {
            let temp = {};
            let decript = result[i].content.replace(/<\/?.+?\/?>/g, " ");
            decript = decript.replace(/\s+/g, "  ");
            decript = decript.substr(0, 300);
            temp.decript = decript;
            temp.id = result[i].id;
            temp.title = result[i].title;
            temp.date = result[i].utime * 1000;
            temp.views = result[i].views;
            temp.tags = result[i].tags;
            resp.push(temp);
        }
        response.writeHead(200);
        response.write(writeResult("success", "查找成功", resp));
        response.end();
    })
}

path.set("/queryBlogByPage", queryBlogByPage);

function queryAllBlog(request, response) {
    let params = url.parse(request.url, true).query;
    let searchValue = params.searchValue ? params.searchValue : null;
    blogDao.queryAllBlog(searchValue, function(result) {
        let resp = {
            total: result[0].total,
            pageSize: globalConf.page_size
        }
        response.writeHead(200);
        response.write(writeResult("success", "查找成功", resp));
        response.end();
    })
}

path.set("/queryAllBlog", queryAllBlog);


function queryBlogById(request, response) {
    let params = url.parse(request.url, true).query;
    let bid = params.bid;
    if (bid <= -1 || !bid || isNaN(bid)) {
        response.writeHead(200);
        response.write(writeResult("success", "没有找到", null));
        response.end();
    } else {
        blogDao.queryBlogById(bid, function(result) {
            if (result && result.length > 0) {
                response.writeHead(200);
                result[0].utime = result[0].utime * 1000;
                result[0].ctime = result[0].ctime * 1000;
                response.write(writeResult("success", "查找成功", result[0]));
                response.end();
                blogDao.setViews(bid, function() {});
            } else {
                let resp = {
                    content: "找不到指定的文章",
                    title: "",
                    utime: 0,
                    views: ""
                }
                response.writeHead(200);
                response.write(writeResult("fail", "没有找到", resp));
                response.end();
            }
        })
    }
}

path.set("/queryBlogById", queryBlogById);

function queryNewBlog(request, response) {
    blogDao.queryNewBlog(function(result) {
        response.writeHead(200);
        response.write(writeResult("success", "查找成功", result));
        response.end();
    })
}

path.set("/getNewBlog", queryNewBlog);

function queryRecentBlog(request, response) {
    blogDao.queryRecentBlog(function(result) {
        response.writeHead(200);
        response.write(writeResult("success", "查找成功", result));
        response.end();
    })
}

path.set("/getRecentBlog", queryRecentBlog);


function queryTagByName(tag, blogId) {
    tagsDao.queryTagByName(tag, function(result) {
        if (result && result.length == 0) {
            insertTag(tag, blogId);
        } else if (result && result.length != 0) {
            appendTagBlog(result[0].id, blogId, getNow());
        }
    })
}

function insertTag(tag, blogId) {
    tagsDao.insertTag(tag, getNow(), getNow(), function(result) {
        insertTagBlogMapping(result.insertId, blogId);
    })
}

function insertTagBlogMapping(tagId, blogId) {
    tagBlogMappingDao.insertTagBlogMapping(tagId, blogId, getNow(), getNow(), function(result) {

    })
}

function appendTagBlog(tagId, blogId, utime) {
    tagBlogMappingDao.appendTagBlog(tagId, blogId, utime, function(result) {

    })
}

module.exports.path = path;