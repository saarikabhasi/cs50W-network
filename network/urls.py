
from django.urls import path

from . import views
app_name = 'network'

urlpatterns = [
    path("", views.index, name="index"),
    path("like/<int:post_id>", views.update_like, name="update_like"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("newpost", views.newpost, name="newpost"),

    #path("profile/<int:num>",views.profile_tab,name="profile_tab"),
    path("<str:user>",views.profile,name="profile"),

    path("<str:user>/profile/<str:category>",views.section,name="section"),
    #path("<int:id>/<str:user>",views.updatefollow,name="updatefollow"),
    
    path("connect",views.connect,name="connect"),

    path("following",views.following_posts,name="following_posts"),
    #path("connect",views.connect,name="connect"),

    # path("profile",views.profile,name="profile"),
    #path("profile_tab/<int:num>",views.profile_tab,name="profile_tab"),
]
