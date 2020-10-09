from django import forms
from .models import User


# class FollowListForm(forms.ModelForm):
#     # here we only need to define the field we want to be editable
#     following = forms.ModelMultipleChoiceField(
#         queryset=User.objects.all(), required=False)

class NewPostForm(forms.Form):
    # user_id = forms(queryset=User)
    contents =forms.CharField(label="",required= False, widget= forms.Textarea
    (attrs={'placeholder':'Starting writing here...','class':'col-sm','style':'top:1rem,margin:10rem'}))