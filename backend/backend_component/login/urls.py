from django.urls import path
from .views import UserDetailView, LoginView, LogoutView, CookieTokenRefreshView

urlpatterns = [
    path('user-info/', UserDetailView.as_view(), name='user-info'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
]