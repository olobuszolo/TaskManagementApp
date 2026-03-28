from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Categories(models.Model):
    owner_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('owner_id', 'name')

class Status(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#000000', null=True, blank=True)  

class Events(models.Model):

    class EventStatus(models.TextChoices):
        NOT_APPLICABLE = 'not_applicable', 'Not Applicable'
        TODO = 'todo', 'To Do'
        IN_PROGRESS = 'in_progress', 'In Progress'
        DONE = 'done', 'Done'

    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_for = models.DateTimeField()
    creator_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    category_id = models.ForeignKey(Categories, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    status_id = models.ForeignKey(Status, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    group_id = models.IntegerField(null=True, blank=True)

class EventParticipants(models.Model):
    event_id = models.ForeignKey(Events, on_delete=models.CASCADE, related_name='participants')
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_participations')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event_id', 'user_id')