from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    UserRegistrationViewSet,
    UserLoginView,
    UserLogoutView,
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'register', UserRegistrationViewSet, basename='user-register')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
