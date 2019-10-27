var every = new Vue({
    el: "#every-day",
    data: {
        contentC: "这是每日一句",
        contentE: "this is every day",
        author: "Nicholas Sparks"
    },
    computed: {
        getContentC() {
            return this.contentC;
        },
        getContentE() {
            return this.contentE;
        },
        getAuthor() {
            return `————${this.author}`;
        }
    },
    created() {
        let self = this;
        axios.get("/queryEveryDay").then(function(result) {
            if (result.data.status === "success") {
                let content = JSON.parse(result.data.data);
                self.contentC = content.everyC;
                self.contentE = content.everyE;
                self.author = content.everyA;
            } else if (result.data.status === "fail") {
                alert(result.data.msg);
            }
        }).catch(function(error) {
            alert("每日一句获取失败");
            console.log(error);
        })
    }
});


var articleList = new Vue({
    el: "#article_list",
    data: {
        page: 1,
        pageSize: 0,
        count: 0,
        articleList: [],
        pageNumList: [],
        searchValue: "",
        haveArticle: true
    },
    computed: {
        jumpTo() {
            let self = this;
            return function(page) {
                if (self.searchValue) {
                    self.getPage(page, self.searchValue);
                } else {
                    self.getPage(page);
                }
            }
        },
        getPage() {
            let self = this;
            return function(page, searchValue) {
                let url = "";
                if (searchValue) {
                    url = "/queryBlogByPage?page=" + page + "&searchValue=" + searchValue;
                } else {
                    url = "/queryBlogByPage?page=" + page;
                }

                axios({
                    method: "get",
                    url: url
                }).then(function(resp) {
                    let data = resp.data.data;
                    if (data.length === 0) {
                        self.haveArticle = false;
                    } else {
                        self.haveArticle = true;
                    }
                    self.articleList = resp.data.data;
                    self.page = page;
                }).catch(function(error) {
                    console.log(error);
                });

                self.getAllBlog();
            }
        },
        getAllBlog() {
            //获取博客的数量和分页的pagesize后调用generatePageTool生成分页数组
            let self = this;
            let url = "";
            if (self.searchValue) {
                url = "/queryAllBlog?searchValue=" + self.searchValue;
            } else {
                url = "/queryAllBlog";
            }
            return function() {
                axios({
                    method: "get",
                    url: url
                }).then(function(resp) {
                    self.pageSize = parseInt(resp.data.data.pageSize);
                    self.count = resp.data.data.total;
                    self.generatePageTool;
                }).catch(function(error) {
                    console.log(error);
                });

            }
        },
        generatePageTool() {
            //生成分页数组
            let nowPage = this.page;
            let pageSize = this.pageSize;
            let totalCount = this.count;
            let result = [];
            // result.push({ text: "<<", page: 1 });
            if (nowPage > 1) {
                result.push({ text: "<", page: nowPage - 1 });
            }
            if (nowPage > 2) {
                result.push({ text: nowPage - 2, page: nowPage - 2 });
            }
            if (nowPage > 1) {
                result.push({ text: nowPage - 1, page: nowPage - 1 });
            }
            result.push({ text: nowPage, page: nowPage })
            if (nowPage + 1 <= (totalCount + pageSize - 1) / pageSize) {
                result.push({ text: nowPage + 1, page: nowPage + 1 });
            }
            if (nowPage + 2 <= (totalCount + pageSize - 1) / pageSize) {
                result.push({ text: nowPage + 2, page: nowPage + 2 });
            }
            if (nowPage + 1 <= (totalCount + pageSize - 1) / pageSize) {
                result.push({ text: ">", page: nowPage + 1 });
            }
            // result.push({ text: ">>", page: parseInt((totalCount + pageSize - 1) / pageSize) });

            this.pageNumList = result;
            return result;
        }
    },
    methods: {
        getInfo(item) {
            return `发布于${this.formatTime(item.date)} | 浏览(${item.views}) | Tags: ${item.tags.replace(/,/g, " | ")}`
        },
        formatTime(time) {
            //格式化时间
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return `${year}/${month}/${day}`;
        }
    },
    created() {
        this.getPage(this.page, this.searchValue);
        this.getAllBlog();
    }
})

var top_bar = new Vue({
    el: "#header",
    data: {
        searchValue: ""
    },
    methods: {
        search: function() {
            articleList.searchValue = this.searchValue.trim();
            articleList.getPage(articleList.page, this.searchValue.trim());
        }
    }
})