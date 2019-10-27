// 这里的js是从index.js拷贝过来稍作修改的，只是bid为-1
var send_comment = new Vue({
    el: "#comment",
    data: {
        bid: -1,
        nickname: "",
        email: "",
        commentContent: "",
        salt: "",
        captchaData: "",
        captchaText: "",
        replyFlag: false,
        replyTarget: "",
        replyTargetId: -1,
        rootId: -1
    },
    created() {
        this.getCaptcha();
    },
    methods: {
        commitComment: function() {
            let self = this;
            if (self.salt !== self.captchaText) {
                alert("验证码输入错误，请重新输入");
                self.getCaptcha();
                return;
            }
            if (self.nickname.trim() && self.email.trim() && self.commentContent.trim()) {
                let data = {
                    blogId: self.bid,
                    rootId: self.rootId,
                    parent: self.replyTargetId,
                    parentname: self.replyTarget.slice(1),
                    nickname: self.nickname,
                    email: self.email,
                    commentContent: self.commentContent
                }
                axios({
                    method: "post",
                    url: "./addComment",
                    data: data
                }).then(function(resp) {
                    if (resp.data.status === "success") {
                        alert("评论成功");
                        location.reload();
                        self.reset();
                    }
                }).catch(function(error) {
                    console.log(error);
                })
            } else {
                alert("请填写完整");
            }

        },
        reset: function() {
            //重置评论输入框
            this.nickname = "";
            this.email = "";
            this.commentContent = "";
            this.salt = "";
        },
        getCaptcha: function() {
            //获取验证码
            let self = this;
            axios({
                method: "get",
                url: "/captcha"
            }).then(function(resp) {
                self.captchaData = resp.data.data.data;
                self.captchaText = resp.data.data.text;
            }).catch(function(error) {
                console.log(error);
            })
        },
        cancelReply: function() {
            this.replyFlag = false;
            this.replyTargetId = -1;
            let textarea = document.getElementById("comment_content");
            textarea.setAttribute("placeholder", "无意义的内容我可能不会回复你");
        }
    }
})

var blog_comments = new Vue({
    el: "#blog_about_comments",
    data: {
        totalComments: 0,
        commentsList: []
    },
    created: function() {
        this.getComments();
    },
    methods: {
        getComments() {
            let self = this;
            axios({
                method: "get",
                url: "/queryCommentsByBid?bid=-1"
            }).then(function(resp) {
                let data = resp.data.data;
                self.totalComments = data.total;
                self.commentsList = self.commentListProcess(data.commentList);
            }).catch(function(error) {
                console.log(error);
            })
        },
        formatTime(time) {
            if (!time) {
                return "";
            }
            //格式化时间
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            hour = hour > 9 ? hour : "0" + hour; //补零
            let minute = date.getMinutes();
            minute = minute > 9 ? minute : "0" + minute;
            return `${year}/${month}/${day} ${hour}:${minute}`;
        },
        reply: function(id, name, rootId) {
            let textarea = document.getElementById("comment_content");
            textarea.setAttribute("placeholder", `回复 ${name}: `);
            send_comment.replyFlag = true;
            send_comment.replyTarget = "@" + name;
            send_comment.replyTargetId = id;
            send_comment.rootId = rootId ? rootId : -1;
        },
        commentListProcess: function(data) {
            //对评论数据data进行分类归组
            let finallyCommentList = []; //最终处理的结果
            let anotherArr = []; //回复的集合
            data.forEach(function(item) {
                if (item.parent === -1) {
                    let obj = {
                        ...item,
                        reply: []
                    }
                    finallyCommentList.push(obj);
                } else {
                    anotherArr.push(item);
                }
            });

            for (let i = 0; i < finallyCommentList.length; i++) {
                for (let j = 0; j < anotherArr.length; j++) {
                    if (finallyCommentList[i].id == anotherArr[j].root_id) {
                        finallyCommentList[i].reply.unshift(anotherArr[j]); //回复别人的评论应该倒叙插入显示
                    }
                }
            }

            return finallyCommentList;
        }
    },
    computed: {}
})