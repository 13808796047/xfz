function FrontBase() {

}

FrontBase.prototype.run = function () {
    var self = this;
    self.listenAuthBoxHover();
};
FrontBase.prototype.listenAuthBoxHover = function () {
    var authBox = $('.auth-box');
    var userMoreBox = $('.user-more-box');
    authBox.hover(function () {
        userMoreBox.show();
    }, function () {
        userMoreBox.hide();
    });
};
//点击登录，弹出模态对话框

//类
function Auth() {
    var self = this;
    self.maskWrapper = $('.mask-wrapper');
    self.scrollWrapper = $('.scroll-wrapper');
    self.smsCaptcha = $(".sms-captcha-btn");
}

//执行类
Auth.prototype.run = function () {
    var self = this;
    self.listenShowHideEvent();
    self.listenSwitchEvent();
    self.listenSigninEvent();
    self.listenImgCaptchaEvent();
    self.listenSmsCaptchaEvent();
};
Auth.prototype.showEvent = function () {
    var self = this;
    self.maskWrapper.show();
};
Auth.prototype.hideEvent = function () {
    var self = this;
    self.maskWrapper.hide();
};
Auth.prototype.listenShowHideEvent = function () {
    var self = this;
    var signinBtn = $('.signin-btn');
    var signupBtn = $('.signup-btn');
    var closeBtn = $('.close-btn');

    signinBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({'left': 0});
    });
    signupBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({'left': -400});
    });
    closeBtn.click(function () {
        self.hideEvent();
    });
};
Auth.prototype.listenSwitchEvent = function () {
    var self = this;
    var switcher = $('.switch');
    switcher.click(function () {

        var currentLeft = self.scrollWrapper.css('left')
        currentLeft = parseInt(currentLeft);
        if (currentLeft < 0) {
            self.scrollWrapper.animate({'left': 0})
        } else {
            self.scrollWrapper.animate({'left': -400})
        }
    });
};
Auth.prototype.listenImgCaptchaEvent = function () {
    var imgCaptcha = $('.img-captcha');
    imgCaptcha.click(function () {
        imgCaptcha.attr('src', '/account/img_captcha' + '?random=' + Math.random());
    });
};
Auth.prototype.smsSuccessEvent = function () {
    var self = this;

    messageBox.showSuccess('短信验证码发送成功!');
    self.smsCaptcha.addClass('disabled');
    var count = 60;
    self.smsCaptcha.unbind('click');
    var timer = setInterval(function () {
        self.smsCaptcha.text(count + 's');
        count--;
        if (count <= 0) {
            clearInterval(timer);
            self.smsCaptcha.removeClass('disabled');
            self.smsCaptcha.text('发送验证码');
            self.listenSmsCaptchaEvent();
        }
    }, 1000)
}
Auth.prototype.listenSmsCaptchaEvent = function () {
    var self = this;
    var telephoneInput = $(".signup-group input[name='telephone']")
    self.smsCaptcha.click(function () {
        var telephone = telephoneInput.val();
        if (!telephone) {
            messageBox.showInfo('请输入手机号码!');
            return;
        }
        xfzajax.get({
            'url': 'account/sms_captcha/',
            'data': {
                'telephone': telephone,
            },
            'success': function (result) {
                if (result.code == 200) {
                    self.smsSuccessEvent();
                }
            },
            'fail': function (error) {
                console.log(error);
            }
        });
    });
};
Auth.prototype.listenSigninEvent = function () {
    var self = this;
    var signinGroup = $('.signin-group');
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");
    var submitBtn = signinGroup.find('.submit-btn');

    submitBtn.click(function () {
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop('checked');
        xfzajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember ? 1 : 0
            },
            'success': function (result) {
                if (result.code == 200) {
                    self.hideEvent();
                    window.location.reload();
                } else {
                    var messageObject = result.message;
                    if (typeof messageObject == 'string' || messageObject.constructor == String) {
                        window.messageBox.show(messageObject);
                    } else {
                        for (var key in messageObject) {
                            var messages = messageObject[key];
                            var message = messages['message'];
                            window.messageBox.show(message)
                        }
                    }
                }
            },
            'fail': function (error) {
                console.log(error)
            }
        })
    });
};

$(function () {
    var frontBase = new FrontBase();
    var auth = new Auth();
    auth.run();
    frontBase.run();
});