//面向对象
//Banner类
function Banner() {
    this.bannerGroup = $('.banner-group');
    this.index = 0;
    this.leftArrow = $('.left-arrow');
    this.rightArrow = $('.right-arrow');
    this.banner_ul = $('#banner-ul');
    this.liList = this.banner_ul.children('li');
    this.bannerCount = this.liList.length;
    this.listenBannerHover()
}

Banner.prototype.toggleArrow = function (isShow) {
    var self = this;
    if (isShow) {

        self.leftArrow.show();
        self.rightArrow.show();
    } else {
        self.leftArrow.hide();
        self.rightArrow.hide();
    }
};
Banner.prototype.listenBannerHover = function () {
    var self = this;
    this.bannerGroup.hover(function () {
        //鼠标移动到上面
        clearInterval(self.timer)
        self.toggleArrow(true)
    }, function () {
        //鼠标移出
        self.loop();
        self.toggleArrow(false)
    })
};
Banner.prototype.animate = function () {
    var self = this
    self.banner_ul.animate({'left': -798 * self.index}, 500);
};
Banner.prototype.loop = function () {
    // var banner_ul = $('#banner-ul');
    var self = this;
    this.timer = setInterval(function () {
        if (self.index >= 2) {
            self.index = 0
        } else {
            self.index++;
        }

        self.animate()
    }, 2000);
};
Banner.prototype.listenArrowClick = function () {
    var self = this;
    self.leftArrow.click(function () {
        if (self.index === 0) {
            self.index = self.bannerCount - 1;
        } else {
            self.index--;
        }
        self.animate()
    });
    self.rightArrow.click(function () {
        if (self.index === self.bannerCount - 1) {
            self.index = 0;
        } else {
            self.index++;
        }
        self.animate()
    })
};
//类方法
Banner.prototype.run = function () {
    this.loop();
    this.listenArrowClick()

};
//运行方法
$(function () {
    var banner = new Banner();
    banner.run()
});

