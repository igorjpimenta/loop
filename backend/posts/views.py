from rest_framework import viewsets, status
from rest_framework.authentication import (
    SessionAuthentication,
    TokenAuthentication
)
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import QuerySet
from accounts.permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly
from accounts.models import User
from .models import Post, Topic, PostComment
from .serializers import PostSerializer, TopicSerializer, PostCommentSerializer
from .mixins import PostActionsMixin


class TopicViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Topic objects.
    Provides CRUD operations for topics, with admin-only write permissions.
    """
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAdminOrReadOnly]


class PostViewSet(PostActionsMixin, viewsets.ModelViewSet):
    """
    ViewSet for managing Post objects.
    Provides CRUD operations and additional actions for post interactions.
    Includes functionality for voting and saving posts.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = (SessionAuthentication,)
    permission_classes = [IsOwnerOrReadOnly]
    prefetch_related_fields = {
        'comments',
        'upvoted_by',
        'downvoted_by',
        'topics'
    }

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[IsAuthenticated]
    )
    def upvote(self, request, pk=None) -> Response:
        """
        Handle upvoting of a post.
        If post was downvoted, removes the downvote.
        Toggles the upvote status for the authenticated user.

        Args:
            request: Request object containing user data
            pk: Primary key of the post

        Returns:
            Response: Empty response with success status
        """
        post: Post = self.get_object()
        user: User = request.user

        if user in post.downvoted_by.all():
            post.downvoted_by.remove(user)

        if user in post.upvoted_by.all():
            post.upvoted_by.remove(user)
        else:
            post.upvoted_by.add(user)

        return Response(status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[IsAuthenticated]
    )
    def downvote(self, request, pk=None) -> Response:
        """
        Handle downvoting of a post.
        If post was upvoted, removes the upvote.
        Toggles the downvote status for the authenticated user.

        Args:
            request: Request object containing user data
            pk: Primary key of the post

        Returns:
            Response: Empty response with success status
        """
        post: Post = self.get_object()
        user: User = request.user

        if user in post.upvoted_by.all():
            post.upvoted_by.remove(user)

        if user in post.downvoted_by.all():
            post.downvoted_by.remove(user)
        else:
            post.downvoted_by.add(user)

        return Response(status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['post', 'delete'],
        permission_classes=[IsAuthenticated]
    )
    def save(self, request, pk=None) -> Response:
        """
        Handle saving/unsaving of a post.
        POST: Saves the post for the authenticated user
        DELETE: Removes the post from user's saved posts

        Args:
            request: Request object containing user data
            pk: Primary key of the post

        Returns:
            Response: Empty response with success status
        """
        post: Post = self.get_object()
        user: User = request.user

        if request.method == 'POST':
            if user not in post.saved_by.all():
                post.saved_by.add(user)
            else:
                return Response(
                    {'details': 'Post already saved'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if request.method == 'DELETE':
            if user in post.saved_by.all():
                post.saved_by.remove(user)
            else:
                return Response(
                    {'details': 'Post not saved'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(status=status.HTTP_200_OK)


class PostCommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing PostComment objects.
    Provides CRUD operations for comments on specific posts.
    Comments are filtered by post_id from the URL.
    """
    serializer_class = PostCommentSerializer
    authentication_classes = (SessionAuthentication,)
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self) -> QuerySet[PostComment]:
        """
        Filter comments to only return those belonging to the specified post.

        Returns:
            QuerySet: Filtered comments for the specified post
        """
        return PostComment.objects.filter(post_id=self.kwargs['post_pk'])

    def perform_create(self, serializer) -> None:
        """
        Set the authenticated user and post_id when creating a new comment.

        Args:
            serializer: Validated serializer instance
        """
        serializer.save(
            user=self.request.user,
            post_id=self.kwargs['post_pk']
        )
