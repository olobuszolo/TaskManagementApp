from rest_framework import serializers
from .models import Categories, Events, EventParticipants, RecurringEvents, Status
from django.utils.text import slugify

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ['id', 'owner_id', 'name', 'color', 'created_at']
        extra_kwargs = {
            'owner_id': {'read_only': True}
        }

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'name', 'created_at']
        extra_kwargs = {
            'created_at': {'read_only': True}
        }

    def create(self, validated_data):
        name = validated_data['name']
        base_code = slugify(name).replace('-', '_') or 'status'
        code = base_code[:50]
        suffix = 2

        while Status.objects.filter(code=code).exists():
            suffix_text = f"_{suffix}"
            code = f"{base_code[:50 - len(suffix_text)]}{suffix_text}"
            suffix += 1

        return Status.objects.create(
            code=code,
            name=name,
            color=None,
        )

class RecurringEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringEvents
        fields = ['id', 'creator_id', 'frequency', 'interval', 'end_date', 'created_at']
        extra_kwargs = {
            'creator_id': {'read_only': True}
        }

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = [
            'id',
            'title',
            'description',
            'created_at',
            'scheduled_for',
            'creator_id',
            'category_id',
            'status_id',
            'group_id',
            'recurrence_series_id',
            'is_recurring',
            'recurrence_frequency',
            'recurrence_interval',
            'recurrence_end_date',
        ]
        extra_kwargs = {
            'creator_id': {'read_only': True},
            'recurrence_series_id': {'read_only': True},
        }

    def validate(self, attrs):
        is_recurring = attrs.get(
            'is_recurring',
            getattr(self.instance, 'is_recurring', False),
        )

        if not is_recurring:
            attrs['recurrence_frequency'] = None
            attrs['recurrence_interval'] = 1
            attrs['recurrence_end_date'] = None
            return attrs

        frequency = attrs.get(
            'recurrence_frequency',
            getattr(self.instance, 'recurrence_frequency', None),
        )
        interval = attrs.get(
            'recurrence_interval',
            getattr(self.instance, 'recurrence_interval', 1),
        )
        end_date = attrs.get(
            'recurrence_end_date',
            getattr(self.instance, 'recurrence_end_date', None),
        )
        scheduled_for = attrs.get(
            'scheduled_for',
            getattr(self.instance, 'scheduled_for', None),
        )

        if not frequency:
            raise serializers.ValidationError({'recurrence_frequency': 'Select how often this event repeats.'})
        if interval < 1:
            raise serializers.ValidationError({'recurrence_interval': 'Repeat interval must be at least 1.'})
        if not end_date:
            raise serializers.ValidationError({'recurrence_end_date': 'Select a recurrence deadline date.'})
        if scheduled_for and end_date < scheduled_for.date():
            raise serializers.ValidationError({'recurrence_end_date': 'Deadline cannot be before the event date.'})

        return attrs

class EventParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventParticipants
        fields = ['id', 'event_id', 'user_id', 'added_at']
