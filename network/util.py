from .models import *
from django.db.models import F
from datetime import datetime
from django.utils import timezone
# get - one element (unique obj)
# filter - 0 to many element (queryset)
# all - 0 to many
def get_user_obj(username):
    """
    Returns user object
    """
    userobj = User.objects.get(username = username)
    return userobj

def queryset_post_content(post_id):
    """
    Returns post content
    """
    contents = queryset_post_object(post_id).values_list("contents",flat =True)
    return contents

def queryset_post_object(post_id):
    """
    Returns post queryset object

    """
    postobj= Post.objects.filter(id = post_id)
    return postobj

def update_post(post_id,contents):
    
    """
    save the post after edit
    """
    date_time =timezone.now()
    postobj = Post.objects.filter(id = post_id)
    postobj.update(contents = contents, date_and_time =date_time)
    
    return postobj

def delete_post(post_id):
    """
    delete the post
    """
    postobj = Post.objects.filter(id = post_id)
    if postobj:
        postobj.delete()
        return 1
    return 0

