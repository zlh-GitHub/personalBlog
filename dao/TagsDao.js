const dbUtil = require("./dbUtil");

function insertTag(tag, ctime, utime, success) {
    const query = "insert into tags (tag, ctime, utime) values (?, ?, ?)";
    const connection = dbUtil.createConnection();
    const params = [tag, ctime, utime];
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

function queryTagByName(tagName, success) {
    const query = "select * from tags where tag = ?";
    const connection = dbUtil.createConnection();
    const params = [tagName];
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

function queryAllTags(success) {
    const query = "select * from tags";
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
    insertTag,
    queryTagByName,
    queryAllTags
}