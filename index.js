//主入口文件
const express = require("express");
const globalConf = require("./config"); //加载配置文件
const loader = require("./loader"); //加载controller

const app = new express();
app.use(express.static("./page"));


app.post("/editEveryDay", loader.get("/editEveryDay"));

app.get("/queryEveryDay", loader.get("/queryEveryDay"));

app.post("/editBlog", loader.get("/editBlog"));

app.get("/queryBlogByPage", loader.get("/queryBlogByPage"));

app.get("/queryAllBlog", loader.get("/queryAllBlog"));

app.get("/queryBlogById", loader.get("/queryBlogById"));

app.post("/addComment", loader.get("/addComment"));

app.get("/captcha", loader.get("/captcha"));

app.get("/queryCommentsByBid", loader.get("/queryCommentsByBid"));

app.get("/getNewBlog", loader.get("/getNewBlog"))

app.get("/getTags", loader.get("/getTags"));

app.get("/getNewComments", loader.get("/getNewComments"));

app.get("/getRecentBlog", loader.get("/getRecentBlog"));

app.listen(globalConf.port, function() {
    console.log("server running 12306");
})