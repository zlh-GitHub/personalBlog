var site_map = new Vue({
    el: "#content",
    data: {
        blogList: []
    },
    methods: {
        getArticleList: function() {
            let self = this;
            axios({
                method: "get",
                url: "/getNewBlog"
            }).then(function(resp) {
                let data = resp.data.data;
                data.forEach(function(item) {
                    let temp = {};
                    temp.title = item.title;
                    temp.href = "../blog_detail.html?bid=" + item.id;
                    self.blogList.push(temp);
                })
            }).catch(function(error) {
                console.log(error);
            })
        }
    },
    created: function() {
        this.getArticleList();
    }
})