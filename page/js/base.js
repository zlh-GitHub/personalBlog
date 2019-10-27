var randomTags = new Vue({
    el: "#random_tags",
    data: {
        tags: []
    },
    computed: {
        randomColor() {
            //生成随机颜色
            return function() {
                var R = Math.random() * 255 + 50;
                var G = Math.random() * 255 + 50;
                var B = Math.random() * 255 + 50;
                return `rgb(${R}, ${G}, ${B})`;
            }
        },
        randomSize() {
            //生成随机字体大小
            return function() {
                return `${Math.random() * 18 + 10}px`;
            }
        }
    },
    methods: {
        getTags: function() {
            let self = this;
            axios({
                methos: "get",
                url: "/getTags"
            }).then(function(resp) {
                let data = resp.data.data;
                data.sort(function() {
                    return Math.random() - 0.5;
                })
                data.forEach(function(item) {
                    self.tags.push(item.tag);
                })
            }).catch(function(error) {
                console.log(error);
            })
        }
    },
    created: function() {
        this.getTags();
    }
})

var recent_hot = new Vue({
    el: "#recent_hot",
    data: {
        recentBlogList: []
    },
    methods: {
        getRecentBlog() {
            let self = this;
            axios({
                method: "get",
                url: "/getRecentBlog"
            }).then(function(resp) {
                let data = resp.data.data;
                data.forEach(function(item) {
                    self.recentBlogList.push({
                        title: item.title,
                        link: "../blog_detail.html?bid=" + item.id
                    })
                })
            }).catch(function(error) {
                console.log(error);
            })
        }
    },
    created: function() {
        this.getRecentBlog();
    }
})

var new_comments = new Vue({
    el: "#new_comments",
    data: {
        commentList: []
    },
    methods: {
        getNewComments: function() {
            let self = this;
            axios({
                method: "get",
                url: "/getNewComments"
            }).then(function(resp) {
                let data = resp.data.data;
                self.commentList = [];
                data.forEach(function(item) {
                    self.commentList.push({
                        name: item.username,
                        comment: item.comments,
                        date: self.formatTime(item.ctime * 1000),
                        link: "#"
                    })
                })
            }).catch(function(error) {
                console.log(error);
            })
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
    created: function() {
        this.getNewComments();
    }
})

var footer = new Vue({
    el: "#footer",
    data: {
        footerLink: ["html", "css", "javascript", "jQuery", "Bootstrap", "webpack", "git", "gulp", "axios", "vue", "mysql", "node", "redis", "mongodb", "ajax", "json", "promist", "jsonp", "npm"]
    }
})

var friendship_link = new Vue({
    el: "#friendship_link",
    data: {
        list: [
            [
                { name: "百度", href: "www.baidu.com" },
                { name: "url module", href: "https://www.jianshu.com/p/9100a5311a49" }
            ],
            [
                { name: "node", href: "http://nodejs.cn/api/" },
                { name: "vue", href: "https://vuejs.bootcss.com/" }
            ],
            [
                { name: "axios", href: "http://www.axios-js.com/zh-cn/" },
                { name: "富文本编辑器", href: "https://github.com/mindmup/bootstrap-wysiwyg" }
            ],
            [
                { name: "验证码", href: "http://www.ptbird.cn/node-js-svg-captcha.html" },
                { name: "express", href: "http://www.expressjs.com.cn/" }
            ],
            [
                { name: "mysql", href: "https://www.runoob.com/mysql/mysql-tutorial.html" },
                { name: "jQuery", href: "https://www.runoob.com/jquery/jquery-tutorial.html" }
            ]
        ]
    }
})