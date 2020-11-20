
from django.urls import path

from . import views
app_name = 'network'

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("newpost", views.newpost, name="newpost"),

    #path("profile/<int:num>",views.profile_tab,name="profile_tab"),
    path("<str:user>",views.profile,name="profile"),

    path("<str:user>/<str:category>",views.section,name="section"),
    # path("profile",views.profile,name="profile"),
    #path("profile_tab/<int:num>",views.profile_tab,name="profile_tab"),
]
