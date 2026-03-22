from . import views
from django.urls import path

urlpatterns = [
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('', views.EventListCreateView.as_view(), name='event-list-create'),
    path('participants/', views.EventParticipantListCreateView.as_view(), name='event-participant-list-create'),
    path('<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),
]