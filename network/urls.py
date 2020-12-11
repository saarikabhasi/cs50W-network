
from django.urls import path

from . import views
app_name = 'network'

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
  
    path("newpost", views.newpost, name="newpost"),

    path("profile",views.profile,name="profile"),
    path("profile/<str:user>",views.profile,name="profile"),
    path("profile/<str:user>/<str:category>",views.section,name="section"),

    path("network/<str:request_type>",views.network,name="network"),
    path("network/section/<str:section>",views.network_section,name="network_section"),
    
    path("editpost/<int:post_id>",views.edit_post,name="editpost"),
    path("savepost/<int:post_id>/<str:content>",views.save_post,name="save_post"),
    # path("savepost/<int:post_id>/",views.save_post,name="save_post"),
    
    
    path("like/<int:post_id>", views.update_like, name="update_like"),
    path("deletepost/<int:post_id>", views.delete_post, name="delete_post"),
    
    path("connect/<str:user>",views.connect,name="connect"),
    path("connect",views.connect,name="connect"),
    path("following",views.following_posts,name="following_posts"),
    

]
