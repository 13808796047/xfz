from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm
from django.shortcuts import redirect, reverse
from utils import restful
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from django.http import HttpResponse
from utils.aliyunsdk import aliyunsms
from utils import restful

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
    return response


def sms_captcha(request):
    telephone = request.GET.get('telephone')
    code = Captcha.gene_text()
    result = aliyunsms.send_sms(telephone, code)
    print(result)
    return restful.ok()
