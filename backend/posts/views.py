from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from accounts.permissions import IsAdminUserOrReadOnly, IsOwnerOrReadOnly
from .models import Post, Topic
from .serializers import PostSerializer, TopicSerializer


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    authentication_classes = (SessionAuthentication,)
    permission_classes = [IsAdminUserOrReadOnly]


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = (SessionAuthentication,)
    permission_classes = [IsOwnerOrReadOnly]
