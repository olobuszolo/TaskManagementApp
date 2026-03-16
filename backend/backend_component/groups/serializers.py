from rest_framework import serializers
from .models import GroupMemberships, UserGroups

class UserGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroups
        fields = ['id', 'name', 'description', 'created_at']

class GroupMembershipsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMemberships
        fields = ['id', 'user_id', 'group_id', 'joined_at']