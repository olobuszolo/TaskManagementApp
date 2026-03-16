from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserGroups(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class GroupMemberships(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_memberships')
    group_id = models.ForeignKey(UserGroups, on_delete=models.CASCADE, related_name='group_memberships')
    joined_at = models.DateTimeField(auto_now_add=True)