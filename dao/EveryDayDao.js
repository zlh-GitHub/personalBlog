const dbUtil = require("./dbUtil");

function insertEveryDay(content, ctime, success) {
    const query = "insert into every_day (content, ctime) values (?, ?)";
    const connection = dbUtil.createConnection();
    const params = [content, ctime];
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

function queryEveryDay(success) {
    const query = "select * from every_day order by id desc limit 1";
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
    insertEveryDay,
    queryEveryDay
}