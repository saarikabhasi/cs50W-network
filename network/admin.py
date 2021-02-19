from django.contrib import admin
from django.contrib.admin.views.main import ChangeList
# from .forms import FollowListForm
from .models import *
from django import forms
# Register your models here.


  
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Follow)
admin.site.register(Like)