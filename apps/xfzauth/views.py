from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm, RegisterForm
from django.shortcuts import redirect, reverse
from utils import restful
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from django.http import HttpResponse
from utils.aliyunsdk import aliyunsms
from utils import restful
from django.core.cache import cache
from django.contrib.auth import get_user_model


@require_POST
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request, username=telephone, password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
            else:
                return restful.unauth('您的账号已经被冻结了!')
        else:
            return restful.params_error('手机号或密码错误!')
    else:
        errors = form.get_errors()
        return restful.params_error(message=errors)


def logout_view(request):
    logout(request)
    return redirect(reverse('index'))


def img_captcha(request):
    text, image = Captcha.gene_code()
    # BytesIO：相当于一个管道，用来存储图片的流数据
    out = BytesIO()
    # 调用image的save方法，将这个image对象保存到ByteIO中
    image.save(out, 'png')
    # 将ByteIO的文件指针移动到最开始的位置
    out.seek(0)
    response = HttpResponse(content_type='image/png')
    # 从ByteIO的管道中，读取出图片数据，保存到response对象上
    response.write(out.read())
    response['Content-length'] = out.tell()
    cache.set(text.lower(), text.lower(), 5 * 60)
    return response


@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = get_user_model().objects.create_user(telephone=telephone, username=username, password=password)
        login(request, user)
        return restful.ok()
    else:
        return restful.params_error(message=form.get_errors())


def sms_captcha(request):
    telephone = request.GET.get('telephone')
    code = Captcha.gene_text()
    cache.set(telephone, code, 5 * 60)
    print(code)
    # aliyunsms.send_sms(telephone, code)
    return restful.ok()


def cache_test(request):
    cache.set('username', 'zhiao', 60)
    result = cache.get('username')
    print(result)
    return HttpResponse('success')
