from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, TopicViewSet, PostCommentViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'topics', TopicViewSet)
router.register(
    r'posts/(?P<post_pk>[^/.]+)/comments',
    PostCommentViewSet,
    basename='post-comments'
)

urlpatterns = [
    path('', include(router.urls)),
]
