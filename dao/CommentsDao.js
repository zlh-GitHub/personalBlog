const dbUtil = require("./dbUtil");


function addComment(blog_id, root_id, parent, parentname, username, comments, email, ctime, utime, success) {
    const query = "insert into comments (blog_id, root_id, parent, parentname, username, comments, email, ctime, utime) values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const connection = dbUtil.createConnection();
    const params = [blog_id, root_id, parent, parentname, username, comments, email, ctime, utime];
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

function queryByBid(bid, success) {
    const query = "select * from comments where blog_id = ? order by utime desc";
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

function getCommentsCount(bid, success) {
    const query = "select count(*) as total from comments where blog_id = ?";
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

function getNewComments(success) {
    const query = "select * from comments order by ctime desc limit 6";
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

module.exports = {
    addComment,
    queryByBid,
    getCommentsCount,
    getNewComments
}