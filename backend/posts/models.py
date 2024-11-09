from django.db import models
from accounts.models import User
from .storage import MediaStorage
import uuid
import os


class Topic(models.Model):
    """
    Topic model for categorizing posts.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        db_table = 'topics'


def post_image_path(_, filename: str) -> str:
    """
    Generate unique path for post images.

    Args:
        instance: Model instance the file is attached to
        filename: Original filename

    Returns:
        str: Generated file path
    """
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'

    return os.path.join('posts', filename)


class Post(models.Model):
    """
    Post model representing user posts.
    Includes relationships for user interactions and content categorization.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=500)
    image = models.ImageField(
        upload_to=post_image_path,
        storage=MediaStorage,
        blank=True,
        null=True,
    )
    topics = models.ManyToManyField(Topic)
    upvoted_by = models.ManyToManyField(
        User,
        related_name='upvoted_posts',
        blank=True
    )
    downvoted_by = models.ManyToManyField(
        User,
        related_name='downvoted_posts',
        blank=True
    )
    saved_by = models.ManyToManyField(
        User,
        related_name='saved_posts',
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def votes(self) -> int:
        """
        Calculate net votes (upvotes - downvotes).

        Returns:
            int: Net vote count
        """
        return self.upvoted_by.count() - self.downvoted_by.count()

    class Meta:
        ordering = ['-created_at']
        db_table = 'posts'

    def delete(self, *args, **kwargs):
        """Override delete to ensure image is deleted from storage."""
        if self.image:
            self.image.delete(save=False)

        super().delete(*args, **kwargs)


def post_comment_image_path(_, filename: str) -> str:
    """
    Generate unique path for comment images.

    Args:
        instance: Model instance the file is attached to
        filename: Original filename

    Returns:
        str: Generated file path
    """
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'

    return os.path.join('posts', 'comments', filename)


class PostComment(models.Model):
    """
    PostComment model for user comments on posts.
    Includes support for text content and optional images.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(
        Post,
        related_name='comments',
        on_delete=models.CASCADE
    )
    content = models.TextField(max_length=500)
    image = models.ImageField(
        upload_to=post_comment_image_path,
        storage=MediaStorage,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'post_comments'
