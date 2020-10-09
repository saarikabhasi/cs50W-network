from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from . import forms
from .models import Post,User,Follow
from datetime import datetime



def index(request):
    print("Show all posts")
    all_posts = Post.objects.all()
    print("All posts",Post)
    return render(request,"network/index.html",{
        "allposts":all_posts,


    })
    # return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
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
    print("new post")
    if request.method == "GET":
        print("new post GET")
        newpost_form= forms.NewPostForm()

        return render(request, "network/newpost.html",{
            # "form":form,
            "newpost_form":newpost_form

        })
    else:
        print("new post POST")
        newpost_form = forms.NewPostForm(request.POST)
        print("post",request.POST.get)
        username = request.user.username

        date_time = datetime.now()
        
        print(date_time,type(date_time))
        if newpost_form.is_valid():
            content = newpost_form.cleaned_data["contents"]
            if len(content)>0:
                username = User.objects.get(username =username)
                post = Post(contents = content,user_id=username,date_and_time=date_time,num_of_likes=0)
                print("Got content",content)
                post.save()
                return index(request)
            else:
                return render (request,"network/newpost.html",{
                    # "form":form,
                    "newpost_form":newpost_form,
                })
        else:
            return render (request,"network/newpost.html",{
                    # "form":form,
                    "newpost_form":newpost_form,
            })
