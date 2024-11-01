from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, TopicViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'topics', TopicViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
