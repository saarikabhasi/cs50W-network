from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,Http404,JsonResponse
from django.core import serializers
from django.forms.models import model_to_dict
import json  
from django.shortcuts import render
from django.template import loader
from django.urls import reverse
from . import forms
from .models import Post,User,Follow
from datetime import datetime



def index(request):
    print("INDEX: Show all posts")

    all_posts = Post.objects.all().order_by('-date_and_time')
    return render(request,"network/index.html",{
        "allposts":all_posts,
    })
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
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def newpost(request):
    print("NEW POST")

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

def profile(request,user):

    print("PROFILE for ",user)
    print("Mrthod",request.method)
    if request.method == "GET":

        update_follow_form= forms.updatefollowForm(request.GET)
        
    else:
        update_follow_form= forms.updatefollowForm(request.POST)

    return render(request,'network/current_user_profile.html',
    {
        "username":request.user.username,
        "update_follow_form":update_follow_form,
    })


def section(request,user,category):

    print("SECTION function")
    print("request method:",request.method)

    user = User.objects.get(username = request.user.username)
    follow = follow_counts(request,user)

    print("Category is:",category)
    if request.method == 'GET':

        if category == "myposts":

            print("in",category,"loop")

            myposts = list(get_all_by_posts(request,user))

            result= dict({"myposts":myposts})
            result.update(follow)

            # print("after append",len(myposts),myposts[len(myposts)-1])
            # print("myposts",myposts,"\n","type",type(myposts))

            response = json.dumps(result,default=str)

        elif category == "networks":
            '''
            We have three options:
            1. user follows no one. in that case current_following is empty
            2. user follows some. 
            3. user follows all. 
            '''
            print("in ",category," loop")

            current_following = Follow.objects.filter(follower = user.id)

            if len(current_following) == 0:
                # user follow none

                print(user, "follow none ")
                
                user_can_follow =  list(User.objects.all().exclude(username = user).values('id','username'))
                user_currently_follows  = 0

            elif len(current_following) == len(User.objects.all().exclude(username = user)):
                #follow all (except itself)

                print(user, "follow all (except itself) ")

                user_can_follow = 0

                ids = Follow.objects.values_list('following',flat= True).filter(follower = user.id)
                user_currently_follows = list(User.objects.filter(id__in = set(ids)).values('id','username'))

                
                
            else :
                # user follows some
                print(user, "follow some ")
            
                user_currently_follow_ids = Follow.objects.values_list('following',flat= True).filter(follower = user.id)
                
                user_currently_follows = list(User.objects.filter(id__in = set(user_currently_follow_ids)).values('id','username'))
                user_can_follow = list(User.objects.all().exclude(username = user).exclude(id__in = set(user_currently_follow_ids)).values('id','username'))

            result = dict({"user_currently_follows":user_currently_follows,"user_can_follow":user_can_follow})
            result.update(follow)
            response = json.dumps(result,default=str) 
            print("Response:",response)
            
            
        elif category == "likes":
            pass
        else:
            raise Http404("No such section")  

        print("response:",response)
        print("type of response:",type(response))

    return HttpResponse(response,content_type = "application/json")

def connect(request,user):
    print("connect")
    #userobj = User.objects.values('id').filter(username = request.user.username)
    userobj = User.objects.get(username = request.user.username)
    
    form = forms.updatefollowForm(request.POST)
    print(form)

    print(form.cleaned_data)
    print("FE",form.errors)
    print("FEAS",form.errors.as_data())

    if form.cleaned_data["change"]:
        id = form.cleaned_data.get("change")
    else:
        print("form not valid",form.errors)    

    if form.cleaned_data["btn"]:
        changeTo = form.cleaned_data.get("btn")
    else:

        print("form not valid",form.errors)    
    print("id",id,"changeTo",changeTo)

    if changeTo == "unfollow":
        Follow.objects.filter(follower = userobj.id).filter(following = id).delete()
        #print("After del",Follow.objects.filter(follower = user.id))
        
    if changeTo == "follow":
        userTobe = User.objects.filter(id = id)
        print("user",userTobe)
        instance = Follow.objects.create(follower = userobj)
        print("instance 1",instance)
        instance.following.set(userTobe)
        print("instance 2",instance)
        print("user",user,"userobj",userobj,"userTobe",userTobe)
        
        #e = Follow(following = user.id).set()
        #u.add(e)
        
        #print("follow",u)
    
    
    #return HttpResponseRedirect(reverse('network:section',kwargs={'user':user,'category':'networks'}))
    #return reverse('network:section',kwargs={'user':str(userobj.username),'category':"networks"})
    return HttpResponseRedirect(reverse('network:profile',kwargs={'user':user}))
   # return HttpResponseRedirect(reverse('network:index'))
def follow_counts(request,user):

    print("FOLLOW COUNT function")

    following_count = Follow.objects.filter(follower = user).count()
    follower_count = Follow.objects.filter(following = user).count()

    follow_count = {"following_count":following_count,"follower_count":follower_count}

    print("follow information:",follow_count,"\n",type(follow_count))

    return follow_count

# display profile of other user
def other_user_profile(request,section):
    '''
    shows other user's name, # of followers and following(links for each), posts (in reverse order) and likes.
    '''
    print("Other user profile")
    if request.method == "GET":
        user = User.objects.get(username = request.user.username)
        if user:

            following_count = Follow.objects.filter(follower = user).count()
            follower_count = Follow.objects.filter(following = user).count()
            
            print("F counts", following_count,type(following_count))
        

            return render(request,"network/other_user_profile.html",{
                "username":request.user.username,
                "following_count":following_count,
                "follower_count":follower_count,
                # "response":response,

                
            })

# display profile of current user
def current_user_profile(request,section):
    '''
    By default the profile page shows user's name, posts (in reverse order) and following and follower count.
    '''
    print("CURRENT USER PROFILE")
    print("Section is:",section)

    if request.method == "GET":
        user = User.objects.get(username = request.user.username)
        if user:
            response = HttpResponse(content_type= "dict/json")
            # get follower and following count
            following_count = Follow.objects.filter(follower = user).count()
            follower_count = Follow.objects.filter(following = user).count()
            follow_counts = {"following_count":following_count,
                            "follower_count":follower_count}

            print("follow_counts:",follow_counts,"type:",type(follow_counts))
            print("User:", user, "Following:", following_count,"has", follower_count, "Followers")

            # 
            if section == "myposts":

                
                myposts = get_all_posts(request,user)
                print("type of myposts",type(myposts))
                
                # objects = model_to_dict(myposts)
                # print("type of objects:",type(objects),objects)
                #response = serializers.serialize('json', myposts)+json.dumps(follow_counts, indent = 0)
                response = serializers.serialize('json', myposts)
                # print("type of posts:",type(myposts),myposts)

                # response = json.dumps(myposts, indent = 4)
                # follow_counts = json.dumps(follow_counts, indent = 4)   

                # response+=str(follow_counts)
                print("response:", response)
               # IMPO print("\nserialize",serializers.serialize('json', myposts,fields=('contents','user_id','date_and_time','num_of_likes')),"\n")
                #print(user,"has :","\n",response,"posts")
            # if section == "myposts":

                
            #     myposts = get_all_posts(request,user)
            #     print("type of myposts",type(myposts))
                
                
            #     #response = serializers.serialize('json', myposts)+json.dumps(follow_counts, indent = 0)
            #     myposts = serializers.serialize('json', myposts)
            #     response.write(json.dumps(myposts, indent = 4) )  
            #     # follow_counts = json.dumps(follow_counts, indent = 4)   

            #     response.write(follow_counts)
            #     print("response:", response)
            #    # IMPO print("\nserialize",serializers.serialize('json', myposts,fields=('contents','user_id','date_and_time','num_of_likes')),"\n")
            #     #print(user,"has :","\n",response,"posts")

                
            elif section == "networks":

                #all_other_users_list = User.objects.exclude(username = user)
                #all_other_users_count = all_other_users_list.count()

                current_following = Follow.objects.filter(follower = users.id)
                print(user,"is currently following:",current_following)

                current_not_following = User.objects.filter(current_following.values('id'))
                print(user,"currently does not follow:",current_not_following)

                response = serializers.serialize('json', current_following)

            elif section == "likes":
                #need to add likes in models.py
                pass
            else:
                raise Http404("Page Not Found")
                
                #try doing all these stuffs in js
                # if len(current_following) == 0:
                #     # user follows none
                #     follow = User.objects.all().exclude(username = user)
                #     response = serializers.serialize('json', follow)

                # elif len(current_following) == all_other_users_count:
                #     # user is follow all other user
                #     response = serializers.serialize('json', all_other_users_list)
                
                
            #check if response works
            # return render(request,"network/current_user_profile.html",{
            #     "response":response,
            # })
 

            # return render(request, 'network/current_user_profile.html', {
            #     "response":response
            # })
            
            return HttpResponse(response,content_type = "application/json")

            
        #     return render(request,"network/current_user_profile.html",{
        #         "username":request.user.username,
        #         "following_count":following_count,
        #         "follower_count":follower_count,
        #         "response":response,

                
        # },content_type="dict/json")     
    #      return render(request, 'myapp/index.html', {
    #     'foo': 'bar',
    # }, content_type='application/xhtml+xml')          

def get_all_by_posts(request,user):
    '''
    get all the post by user in reverse chronological order

    '''
    #user = User.objects.get(username = request.user.username)
    posts = Post.objects.filter(user_id = user).order_by('-date_and_time').values()
    print("GET All post",posts,"\n","type of posts",type(posts))
    return posts

# def who_to_follow(request,user):
#     '''
#     display a option to “Follow” or “Unfollow” other users
    
#     '''
#     users = User.objects.get(username = user)
#     print("current user id:",users.id, "user's name:", users.username)
#     followinglist = Follow.objects.filter(follower = users.id)

#     print("followinglist",followinglist,type(followinglist))
#     if len(followinglist) == 0:
#         print("user follows no one",followinglist)
#         whotofollow = User.objects.all().exclude(username = user)
#         print("user to be followed",whotofollow)
#         return whotofollow
#     elif len(followinglist) == User.objects.exclude(username = user).count():
#         return followinglist
#     else:
#         print("user follows some",followinglist)
#         id_list =[]
#         for i in followinglist:
#             print("parts of list",i)
#             print("again",i.following.all())
#             for e in i.following.all():
#                 id_list.append(e)
#             #print(User.objects.filter(username=i.following.get(username)))
#         print(id_list)
#         whotofollow = User.objects.exclude(username = user).exclude(username__in = id_list)
#         print("user to be followed",whotofollow)
#         return whotofollow
    
#     return users 

def get_myliked_post(request):
    '''
    show all the posts liked by user

    '''
    pass

#profile_tab_function = [get_all_posts(request=None),who_to_follow,get_myliked_post]

# def profile_tab(request,num):
#     print("profile_tab")
#     if 1<=num<=3:
        
#         # print(profile_tab_function[num-1],type(profile_tab_function[num-1]))
#         # print(get_all_posts)
#         user =request.user.username
#         # print(user)
#         if num ==1 :
#             posts = get_all_posts(request)
#             # print(type(posts),posts)
#             posts_json = serializers.serialize('json', posts)
#             # posts=list(posts)

#             return HttpResponse(posts_json,content_type = "dict/json")
#             #return HttpResponse(qs_json,content_type = "text/json-comment-filtered")
#             #return HttpResponse (profile_tab_function[num-1])
#         if num == 2:
#             whotofollow = who_to_follow(request,user)
#             whotofollow_json = serializers.serialize('json', whotofollow)
#             print("whotofollow",whotofollow)
#             return HttpResponse(whotofollow_json,content_type = "dict/json")

#     else:
#         raise Http404("No such tab")


def following(request):
    print("following")
    pass

def editpost(request):
    print("edit post")
    pass