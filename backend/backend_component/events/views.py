from django.shortcuts import render
from .serializers import CategorySerializer, EventSerializer, EventParticipantSerializer
from rest_framework import generics
from .models import Categories, Events, EventParticipants
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Categories.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated] 
    def get_queryset(self):
        return Categories.objects.filter(owner_id=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner_id=self.request.user)

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Events.objects.filter(creator_id=self.request.user)
    
    def perform_create(self, serializer):
        event = serializer.save(creator_id=self.request.user)
        EventParticipants.objects.create(event_id=event, user_id=self.request.user)
        

class EventParticipantListCreateView(generics.ListCreateAPIView):
    queryset = EventParticipants.objects.all()
    serializer_class = EventParticipantSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return EventParticipants.objects.filter(user_id=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user)