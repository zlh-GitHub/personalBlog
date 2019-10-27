const dbUtil = require("./dbUtil");
const globalConf = require("../config");

function insertBlog(title, content, views, tags, ctime, utime, success) {
    const query = "insert into blog (title, content, views, tags, ctime, utime) values (?, ?, ?, ?, ?, ?)";
    const connection = dbUtil.createConnection();
    const params = [title, content, views, tags, ctime, utime];
    connection.connect();
    connection.query(query, params, function(error, result) {
        if (!error) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryBlogByPage(page, searchValue, success) {

    const page_size = parseInt(globalConf.page_size);
    let params = [];
    let query = "";
    if (searchValue) {
        params = [(page - 1) * page_size, page_size];
        // query = "select * from blog where title like '%" + searchValue + "%' order by id desc limit ?, ?";
        query = `select * from blog where title like '%${searchValue}%' or content like '%${searchValue}%' or tags like '%${searchValue}%' order by id desc limit ?, ?`;
    } else {
        params = [(page - 1) * page_size, page_size];
        query = "select * from blog order by id desc limit ?, ?";
    }
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(query, params, function(error, result) {
        if (!error) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryAllBlog(searchValue, success) {
    let query = "";
    if (searchValue) {
        query = `select count(*) as total from blog where title like'%${searchValue}%' or content like '%${searchValue}%' or tags like '%${searchValue}%'`;
    } else {
        query = "select count(*) as total from blog";
    }
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(query, function(error, result) {
        if (!error) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryBlogById(id, success) {
    const query = "select * from blog where id = ?";
    const params = [id];
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(query, params, function(error, result) {
        if (!error) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryNewBlog(success) {
    const query = "select * from blog order by ctime desc limit 30";
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(query, function(error, result) {
        if (!error) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryRecentBlog(success) {
    const query = "select * from blog order by views desc limit 6";
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(query, function(error, result) {
        if (!error) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function setViews(bid, success) {
    const query = "update blog set views = views + 1 where id = ?";
    const connection = dbUtil.createConnection();
    const params = [bid];
    connection.connect();
    connection.query(query, params, function(error, result) {
        if (!error) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

module.exports = {
    insertBlog,
    queryBlogByPage,
    queryAllBlog,
    queryBlogById,
    queryNewBlog,
    queryRecentBlog,
    setViews
}