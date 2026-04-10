from .serializers import CategorySerializer, EventSerializer, EventParticipantSerializer, StatusSerializer
from rest_framework import generics
from .models import Categories, Events, EventParticipants, Status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.utils import timezone

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Categories.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated] 
    def get_queryset(self):
        return Categories.objects.filter(owner_id=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner_id=self.request.user)

class CategoryDetailView(generics.RetrieveUpdateAPIView):
    queryset = Categories.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Categories.objects.filter(owner_id=self.request.user)

class StatusListView(generics.ListAPIView):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    permission_classes = [IsAuthenticated]

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        today = timezone.localdate()
        year_param = self.request.query_params.get("year")
        month_param = self.request.query_params.get("month")

        try:
            year = int(year_param) if year_param is not None else today.year
            month = int(month_param) if month_param is not None else today.month
        except (TypeError, ValueError):
            raise ValidationError("Query params 'year' and 'month' must be integers.")

        if month < 1 or month > 12:
            raise ValidationError("Query param 'month' must be between 1 and 12.")

        return (
            Events.objects
            .filter(
                participants__user_id=user,
                scheduled_for__year=year,
                scheduled_for__month=month,
            )
            .distinct()
            .order_by("scheduled_for")
        )
    
    def perform_create(self, serializer):
        event = serializer.save(creator_id=self.request.user)
        EventParticipants.objects.create(event_id=event, user_id=self.request.user)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Events.objects.filter(participants__user_id=user)
    
    def perform_destroy(self, instance):
        EventParticipants.objects.filter(event_id=instance).delete()
        instance.delete()
    

class EventParticipantListCreateView(generics.ListCreateAPIView):
    queryset = EventParticipants.objects.all()
    serializer_class = EventParticipantSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return EventParticipants.objects.filter(user_id=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user)
