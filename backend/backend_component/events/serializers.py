from rest_framework import serializers
from .models import Categories, Events, EventParticipants, Status

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ['id', 'owner_id', 'name', 'created_at']
        extra_kwargs = {
            'owner_id': {'read_only': True}
        }

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'code', 'name', 'color']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = ['id', 'title', 'description', 'created_at', 'scheduled_for', 'creator_id', 'category_id', 'status_id', 'group_id']
        extra_kwargs = {
            'creator_id': {'read_only': True}
        }

class EventParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventParticipants
        fields = ['id', 'event_id', 'user_id', 'added_at']
