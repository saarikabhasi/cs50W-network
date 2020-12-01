from django.contrib import admin
from django.contrib.admin.views.main import ChangeList
# from .forms import FollowListForm
from .models import *
from django import forms
# Register your models here.


# class FollowListForm(forms.ModelForm):
#     # here we only need to define the field we want to be editable
#     following = forms.ModelMultipleChoiceField(
#         queryset=User.objects.all(), required=False)
class FollowChangeList(ChangeList):
    print("Coming here FollowChangeList ")
    fields=['follower','following']
    list_display = ('follower','get_following')
   
    # def get_following(self,obj):
    #   return "\n".join([p.username for p in User.objects.all()])
    list_display_links = ['follower','get_following']
    list_editable = ['get_following']

class FollowAdmin(admin.ModelAdmin):
    fields=['follower','following']

    def get_changelist(self, request, **kwargs):
      print("Coming here 1")
      return FollowChangeList

    # def get_changelist_form(self, request, **kwargs):
    #     print("Coming here 2")
    #     return FollowListForm
    # list_display = ('follower','get_following')
   
    # def get_following(self,obj):
    #   return "\n".join([p.username for p in User.objects.all()])
    # list_display_links = ['follower','get_following']
    # list_editable = ['get_following']
    
    

    


admin.site.register(User)
admin.site.register(Post)
admin.site.register(Follow,FollowAdmin)
admin.site.register(Like)