const dbUtil = require("./dbUtil");

function insertTagBlogMapping(tag_id, blog_Id, ctime, utime, success) {
    const query = "insert into tag_blog_mapping (tag_id, blog_Id, ctime, utime) values (?, ?, ?, ?)";
    const connection = dbUtil.createConnection();
    const params = [tag_id, blog_Id, ctime, utime];
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

function appendTagBlog(tagId, blogId, utime, success) {
    const query = "UPDATE tag_blog_mapping u SET u.blog_id = CONCAT(u.blog_id, ?) , u.utime = ? WHERE tag_id = ?";
    blogId = "," + blogId;
    const params = [blogId, utime, tagId];
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

module.exports = {
    insertTagBlogMapping,
    appendTagBlog
}