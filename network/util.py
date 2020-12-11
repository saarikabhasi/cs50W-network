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

def get_follower_ids(username):
    userobj = get_user_obj(username)
    followers = Follow.objects.values('following').filter(following = userobj.id).values_list("follower_id",flat=True)

    return followers


def get_user_networks(username):
    """
    1. return user follow and following list 
    """
    userobj = get_user_obj(username)
    current_following = Follow.objects.filter(follower = userobj.id)
    if len(current_following) == 0:
        #user follows no one.
        user_can_follow =  User.objects.all().exclude(username = userobj).values('id','username')
        
        user_currently_follows  = 0

    elif len(current_following) == len(User.objects.all().exclude(username = userobj)):
        # user follows all (except itself)

        user_can_follow = 0

        ids = Follow.objects.values_list('following',flat= True).filter(follower = userobj.id)
        user_currently_follows = User.objects.filter(id__in = set(ids)).values('id','username')

    else :
        # user follows some
    
        user_currently_follow_ids = Follow.objects.values_list('following',flat= True).filter(follower = userobj.id)
        
        user_currently_follows = User.objects.filter(id__in = set(user_currently_follow_ids)).values('id','username')
        user_can_follow = User.objects.all().exclude(username = userobj).exclude(id__in = set(user_currently_follow_ids)).values('id','username')
    return user_currently_follows,user_can_follow

    