from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,Http404,JsonResponse
from django.core import serializers
from django.forms.models import model_to_dict
import json  
from django.shortcuts import render
from django.template import loader,Context
from django.urls import reverse
from . import forms
from .models import *
from datetime import datetime
from django.db.models import F
from . import util
import time
from django.utils import timezone

import inspect; 

def index(request,edit_post_form = ""):
    print("INDEX: Show all posts")
    print("index",datetime.now())
    if request.user.is_authenticated:

        all_posts = Post.objects.all().order_by('-date_and_time')
        
        post_liked_ids = get_myliked_post(request).values_list("id",flat= True)
  
        return render(request,"network/index.html",{
            "allposts":all_posts,
            "post_liked_ids":post_liked_ids,
            "edit_post_form":edit_post_form,
        })
    else:
        return HttpResponseRedirect(reverse("network:login"))

        
    # return render(request, "network/index.html")


def login_view(request):
    print("LOGIN")
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("network:index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    print("LOGOUT")
    logout(request)
    return HttpResponseRedirect(reverse("network:index"))


def register(request):
    print("REGISTER")
    print("request.method",request.method)
    
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            print("Attempting to register")
            print("Get all users:",User.objects.all())
            user = User.objects.create_user(username, email, password)
            print("Register Success")
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("network:index"))
    else:
        return render(request, "network/register.html")

def newpost(request):
    print("NEW POST")
    if request.user.is_authenticated:
        if request.method == "GET":

            newpost_form= forms.NewPostForm()
            return render(request, "network/newpost.html",{
                "newpost_form":newpost_form

            })
        else:
            newpost_form = forms.NewPostForm(request.POST)
            username = request.user.username

            if newpost_form.is_valid():

                content = newpost_form.cleaned_data["contents"]

                if len(content)>0:

                    username = User.objects.get(username = username)
                    date_time = datetime.now()
                    post = Post(contents = content,user_id=username,date_and_time=date_time,num_of_likes=0)
                    post.save()
                    return HttpResponseRedirect(reverse("network:index"))

                else:
                    return render (request,"network/newpost.html",{
                        "newpost_form":newpost_form,
                    })
            else:
                return render (request,"network/newpost.html",{
                        "newpost_form":newpost_form,
                })
    else:
        return HttpResponseRedirect(reverse("network:login"))

def profile(request,user):

    print("PROFILE for ",user)
    print("Mrthod",request.method)
    if request.user.is_authenticated:
        if request.method == "GET":

            update_follow_form= forms.updatefollowForm(request.GET)
            
        else:
            update_follow_form= forms.updatefollowForm(request.POST)
        
        if request.user.username == user:
            return render(request,'network/current_user_profile.html',
                {
                "page_info":"current user",
                "username":request.user.username,
                "update_follow_form":update_follow_form,
                })
        else:  
            if User.objects.filter(username = user):
                
                userobj = util.get_user_obj(user)
                posts = get_all_post_by_user(request,user)
                post_liked_ids = get_myliked_post(request).values_list("id",flat= True)
                following_count,follower_count = follow_counts(request,userobj)
                connect = follow_check(request,userobj)
                print("connect?",connect)
                return render(request,'network/current_user_profile.html',
                {
                "page_info":"other user",
                "username":user,
                "posts":posts,
                "following_count":following_count,
                "follower_count":follower_count,
                "connect":connect,
                "post_liked_ids":post_liked_ids,
                })
            else:
                raise Http404("User Not Found")
    else:
        return HttpResponseRedirect(reverse("network:login"))   


def follow_check(request,userobj):
    if request.user.is_authenticated:
        if request.user.username == userobj.username:
            return "ERROR"
        else:
            print("id",request.user.id)
            check = len(Follow.objects.filter(follower = request.user.id).filter(following = userobj.id))
            print(check)
            if check > 0:
                return "unfollow"
            return "follow"
    else:
        return HttpResponseRedirect(reverse("network:login"))   


def section(request,user,category):

    if request.user.is_authenticated:
        print("SECTION function")
        print("request method:",request.method)

       
        userobj = util.get_user_obj(request.user.username)
        follow = follow_counts(request,userobj)

        print("Category is:",category)
        if request.method == 'GET':

            if category == "myposts":

                myposts = list(get_all_post_by_user(request))
                result= dict({"myposts":myposts})


            elif category == "networks":
                '''
                We have three options:
                1. user follows no one. in that case current_following is empty
                2. user follows some. 
                3. user follows all. 
                '''
    

                current_following = Follow.objects.filter(follower = userobj.id)

                if len(current_following) == 0:
        
                    user_can_follow =  list(User.objects.all().exclude(username = userobj).values('id','username'))
                    user_currently_follows  = 0

                elif len(current_following) == len(User.objects.all().exclude(username = userobj)):
                    #follow all (except itself)

                    user_can_follow = 0

                    ids = Follow.objects.values_list('following',flat= True).filter(follower = userobj.id)
                    user_currently_follows = list(User.objects.filter(id__in = set(ids)).values('id','username'))

                    
                    
                else :
                    # user follows some
                
                    user_currently_follow_ids = Follow.objects.values_list('following',flat= True).filter(follower = userobj.id)
                    user_currently_follows = list(User.objects.filter(id__in = set(user_currently_follow_ids)).values('id','username'))
                    user_can_follow = list(User.objects.all().exclude(username = userobj).exclude(id__in = set(user_currently_follow_ids)).values('id','username'))

                result = dict({"user_currently_follows":user_currently_follows,"user_can_follow":user_can_follow})

                
                
            elif category == "likes":

                post_liked = list(get_myliked_post(request))
                result = dict({"post_liked": post_liked})
                print("result",result)

            else:
                raise Http404("No such section")  

            
        result.update(follow)
        response = json.dumps(result,default=str)
        return HttpResponse(response,content_type = "application/json")
    else:
        return HttpResponseRedirect(reverse("network:login"))   

def connect(request):
    print("connect")
    if request.user.is_authenticated:

        userobj = util.get_user_obj(request.user.username)
     
    
        form = forms.updatefollowForm(request.POST)
        if form.is_valid():
            if form.cleaned_data["change"]:
                id = form.cleaned_data.get("change")
            else:
                print("form not valid",form.errors)    

            if form.cleaned_data["btn"]:
                changeTo = form.cleaned_data.get("btn")
            else:
                print("form not valid",form.errors)    

            if changeTo == "unfollow":
                Follow.objects.filter(follower = userobj.id).filter(following = id).delete()

            
            if changeTo == "follow":
                userTobe = User.objects.filter(id = id)
                instance = Follow.objects.create(follower = userobj)
                instance.following.set(userTobe)
      
      
        return HttpResponseRedirect(reverse('network:profile',kwargs={'user':request.user.username,'optional_section':"networks"}))
        
    else:
        return HttpResponseRedirect(reverse("network:login")) 
  
def follow_counts(request,userobj):

    print("FOLLOW COUNT function")

    following_count = Follow.objects.filter(follower = userobj).count()
    follower_count = Follow.objects.filter(following = userobj).count()


    if request.user.username == userobj.username:
        
        follow_count = {"following_count":following_count,"follower_count":follower_count}
        return follow_count
    
    return follower_count,following_count
    

def get_all_post_by_user(request,required_user = ""):
    '''
    get all the post by user in reverse chronological order

    '''
    if request.user.is_authenticated:
        if required_user:
            username = required_user
        else:
            username = request.user.username
        
       
        userobj = util.get_user_obj(username)
        posts = Post.objects.filter(user_id = userobj.id).order_by('-date_and_time').values()
        # print("GET All post",posts,"\n","type of posts",type(posts))
        
        return posts
    else:
        return HttpResponseRedirect(reverse("network:login")) 

def get_all_posts_of_user_network(request,userobj):
    print("get_all_posts_of_user_network")
    
    if request.user.is_authenticated:
        
        if request.user.username == userobj.username:

            following_ids = Follow.objects.values_list('following',flat= True).filter(follower = request.user.id)
            posts = Post.objects.filter(user_id__in = set(following_ids)).order_by('-date_and_time')
            
            return posts
    else:
        return HttpResponseRedirect(reverse("network:login")) 
def get_myliked_post(request):
    '''
    show all the posts liked by user

    '''
    print("get_myliked_post")

    if request.user.is_authenticated:


        userobj = util.get_user_obj(request.user.username)

        likeobj = Like.objects.values_list('post',flat=True).filter(user = userobj.id)
        #print("like obj",likeobj)
        postObj = Post.objects.filter(id__in = set(likeobj)).values()
        # print("post obj",postObj)
        return postObj
    else:
        return HttpResponseRedirect(reverse("network:login"))
        
def update_like(request,post_id):
    print("update like")
    # print("args",username,post_id)
    if request.user.is_authenticated:

        userobj = util.get_user_obj(request.user.username)
        postobj = Post.objects.get(id = post_id)

        # value = int(num_of_likes[0])

        #check if post is liked by user
        user_liked_post_ids = get_myliked_post(request).values_list("id",flat=True)
        # print("user liked posts ids",user_liked_post_ids,"Len",len(user_liked_post_ids))
        # print( "check if id exists",user_liked_post_ids.filter(id = post_id),len(user_liked_post_ids.filter(id = post_id)))
        if len(user_liked_post_ids) > 0 and len(user_liked_post_ids.filter(id = post_id))>0:

            print("remove like")
            # val = int(num_of_likes[0]) - 1
            #print("new val",val)
            #delete  like info in table:Like

            likeobj = Like.objects.filter(user = userobj.id).filter(post=post_id)
            # print("Before delete likeobj",likeobj)
            likeobj = likeobj.delete()
            # print("After delete",Like.objects.filter(user = userobj.id).filter(post=post_id))
            # update num of likes in table : POST


            #num_of_likes.update(num_of_likes=val)
            #like_save_obj= Post.objects.filter(id = post_id).update(num_of_likes=F('num_of_likes')-1)
            postobj.num_of_likes = F('num_of_likes')-1
            postobj.save()
            # print("num of likes",Post.objects.filter(id = post_id).values_list("num_of_likes",flat=True))
            result = {"type":"remove"}

        else:
            # val = int(num_of_likes[0]) + 1
            #add_LIKE(val,userobj)
            print("add like")
            #update new like info in DB

            # print("B4 LIKE",Like.objects.values_list('post',flat=True).filter(user = userobj.id))
            user_to_be = User.objects.filter(id = userobj.id)
            instance = Like.objects.create(post = postobj)
            instance.user.set(user_to_be)
            # print("Inst and to be",instance,user_to_be)
            # print("After LIKE",Like.objects.values_list('post',flat=True).filter(user = userobj.id))


            # update num of likes in table : POST
            # print("Before update of table:POST",Post.objects.filter(id = post_id).values_list("num_of_likes",flat=True) )
            
            
            # Post.objects.filter(id = post_id).update(num_of_likes=val)
            #Post.objects.filter(id = post_id).update(num_of_likes=F('num_of_likes')+1)
            postobj.num_of_likes = F('num_of_likes')+1
            postobj.save()
            # print("AFter update of table:POST",Post.objects.filter(id = post_id).values_list("num_of_likes",flat=True) )
            result = {"type":"add"}

        num_of_likes = Post.objects.filter(id = post_id).values_list("num_of_likes",flat=True)
        result["num_of_likes"]=num_of_likes[0]
        response = json.dumps(result,default=str) 
        #return reverse('network:index')
        return HttpResponse(response,content_type = "application/json")
    else:

        return HttpResponseRedirect(reverse("network:login"))


def following_posts(request):
    print("following")
    if request.user.is_authenticated:

        userobj = util.get_user_obj(request.user.username)
        posts = get_all_posts_of_user_network(request,userobj)

        return render (request, "network/following.html",{
            "posts": posts},

        )
    else:

        return HttpResponseRedirect(reverse("network:login"))

def edit_post(request,post_id):
    print("edit post")
    print(request.method)
    

    if request.user.is_authenticated:
        content = util.queryset_post_content(post_id)
        
        if content:
            content = str(content[0])
        print("content")
        response = {"contents":content}
        response = json.dumps(response,default=str)
        
        print("response",response)

        return HttpResponse(response,content_type = "application/json")
       
    else:

        return HttpResponseRedirect(reverse("network:login"))

def save_post(request,post_id,content):
    print("save post")
    print(request.method)
    print("args",post_id,content)
    # print("1",inspect.stack()[1].function)
    # print("2",inspect.stack()[2].function)
    #if request.user.is_authenticated:
        
        
        #update_post = util.update_post(request.user.username,post_id,content)
    print("LOG 0")
    date_time =timezone.now()
    print("LOG 1")
    postobj = Post.objects.filter(id = post_id)
    print("LOG 2")
    postobj.update(contents = content, date_and_time =date_time)
    print("LOG 3")
    postobj = Post.objects.all().filter(id = post_id).values()

    result = {"result":list(postobj)}
    response = json.dumps(result,default=str)
    print("LOG 4",datetime.now())
    return HttpResponse(response,content_type = "application/json")
    print("LOG 5")
    # else:

    #     return HttpResponseRedirect(reverse("network:login"))

