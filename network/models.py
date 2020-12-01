from django.contrib.auth.models import AbstractUser
from django.db import models

# user 
class User(AbstractUser):
    pass

# follow
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE,related_name="Follower")
    following = models.ManyToManyField(User,blank =True,related_name="Following") 
    #follower follows many users

    # def get_following(self):
    #     print("follow class GET_FOLLOWING")
    #     return "\n".join([[p.username, p.id] for p in User.objects.all()])

    def __str__ (self):  
        return f" {self.id}: {self.follower} follows {self.following.all().values('id','username')}"



# post
class Post(models.Model):
    contents = models.CharField(max_length=500)
    user_id = models.ForeignKey(User,on_delete=models.CASCADE,related_name="userID")
    date_and_time = models.DateTimeField()
    num_of_likes = models.IntegerField(default = '0')

    def __str__ (self):
        return f" {self.id}: {self.contents} by {self.user_id} on {self.date_and_time} has {self.num_of_likes}"

# likes
class Like(models.Model):
    # likedUser = models.ForeignKey(User, on_delete= models.CASCADE, related_name="likeuserID")
    # post = models.ManyToManyField(Post, blank =True, related_name="Post")
   
    
    post = models.ForeignKey(Post,on_delete= models.CASCADE,related_name="Post")
    user = models.ManyToManyField(User,blank =True,related_name="user_info")

    def __str__(self):
        return f"{self.user} liked {self.post}"