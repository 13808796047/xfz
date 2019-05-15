function NewsCategory() {

};
NewsCategory.prototype.run = function () {
    var self = this;
    self.listenAddCategoryEvent();
};
NewsCategory.prototype.listenAddCategoryEvent = function () {
    var addBtn = $('#add-btn');
    addBtn.click(function () {
        xfzalert.alertOneInput({
            'title': '添加新闻分类',
            'placeholder': '请输入新闻分类',
            'confirmCallback': function (inputValue) {
                xfzajax.post({
                    'url': '/cms/add_news_category/',
                    'data': {
                        'name': inputValue
                    },
                    'success': function (result) {
                        if (result.code === 200) {
                            window.location.reload();
                        }
                    }
                })
            }
        });
    });
};
$(function () {
    var category = new NewsCategory();
    category.run();
});