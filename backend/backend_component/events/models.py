from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Categories(models.Model):
    owner_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('owner_id', 'name')

class Events(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_for = models.DateTimeField()
    creator_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    category_id = models.ForeignKey(Categories, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    status = models.CharField(max_length=20)
    group_id = models.IntegerField(null=True, blank=True)

class EventParticipants(models.Model):
    event_id = models.ForeignKey(Events, on_delete=models.CASCADE, related_name='participants')
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_participations')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event_id', 'user_id')