from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import View
from django.views.decorators.http import require_GET, require_POST
from apps.news.models import NewsCategory
from utils import restful

# 公司员工才能进入
@staff_member_required(login_url='index')
def index(request):
    return render(request, 'cms/index.html')


class CreateNewsView(View):
    def get(self, request):
        return render(request, 'cms/create_news.html')


@require_GET
def news_category(request):
    categories = NewsCategory.objects.all()
    return render(request, 'cms/news_category.html',{'categories':categories})


@require_POST
def add_news_category(request):
    name = request.POST.get('name')
    exists = NewsCategory.objects.filter(name=name).exists()
    if not exists:
        NewsCategory.objects.create(name=name)
        return restful.ok()
    else:
        return restful.params_error(message='该分类已经存在！')