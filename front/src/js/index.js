//面向对象
//Banner类
function Banner() {
    this.bannerWidth = 798;
    this.bannerGroup = $('.banner-group');
    this.index = 1;
    this.leftArrow = $('.left-arrow');
    this.rightArrow = $('.right-arrow');
    this.banner_ul = $('#banner-ul');
    this.liList = this.banner_ul.children('li');
    this.bannerCount = this.liList.length;
    this.pageControl = $('.page-control')
}

Banner.prototype.initBanner = function () {
    var self = this;

    var firstBanner = self.liList.eq(0).clone()
    var lastBanner = self.liList.eq(self.bannerCount - 1).clone()
    self.banner_ul.append(firstBanner);
    self.banner_ul.prepend(lastBanner);
    self.banner_ul.css({'width': self.bannerWidth * (self.bannerCount + 2),'left':-self.bannerWidth});
};
Banner.prototype.initPageControl = function () {

    var self = this

    for (var i = 0; i < self.bannerCount; i++) {
        var circle = $("<li></li>");
        self.pageControl.append(circle);
        if (i === 0) {
            circle.addClass('active')
        }
    }
    self.pageControl.css({'width': self.bannerCount * 12 + 8 * 2 + 16 * self.bannerCount - 1})
};
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
    var index = self.index
    if(index===0){
        index = self.bannerCount-1;
    }else if(index===self.bannerCount+1){
        index = 0;
    }else{
        index = self.index-1;
    }
    self.pageControl.children('li').eq(index).addClass('active').siblings().removeClass('active')
};
Banner.prototype.loop = function () {
    // var banner_ul = $('#banner-ul');
    var self = this;
    this.timer = setInterval(function () {
        if (self.index >= self.bannerCount+1) {
            self.banner_ul.css({'left':-self.bannerWidth})
            self.index = 2
        } else {
            self.index++;
        }

        self.animate()
    }, 2000);
};
Banner.prototype.listenPageControl = function () {
    var self = this;
    self.pageControl.children('li').each(function (index, obj) {
        $(obj).click(function () {
            self.index = index;
            self.animate()

        });
    })
}
Banner.prototype.listenArrowClick = function () {
    var self = this;
    self.leftArrow.click(function () {
        if (self.index === 0) {
            self.banner_ul.css({'left':-self.bannerCount*self.bannerWidth})
            self.index = self.bannerCount - 1;
        } else {
            self.index--;
        }
        self.animate()
    });
    self.rightArrow.click(function () {
        if (self.index === self.bannerCount +1) {
            self.banner_ul.css({'left':-self.bannerWidth})
            self.index = 2;
        } else {
            self.index++;
        }
        self.animate()
    })
};
//类方法
Banner.prototype.run = function () {
    this.initBanner()
    this.loop();
    this.listenArrowClick()
    this.initPageControl()
    this.listenPageControl()
    this.listenBannerHover()

};
//运行方法
$(function () {
    var banner = new Banner();
    banner.run()
});

