from django.contrib import admin
from django.contrib.admin.views.main import ChangeList
# from .forms import FollowListForm
from .models import *
from django import forms
# Register your models here.


class FollowChangeList(ChangeList):
    
    fields=['follower','following']
    list_display = ('follower','get_following')
   

    list_display_links = ['follower','get_following']
    list_editable = ['get_following']

class FollowAdmin(admin.ModelAdmin):
    fields=['follower','following']

    def get_changelist(self, request, **kwargs):
      return FollowChangeList


    
  
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Follow,FollowAdmin)
admin.site.register(Like)