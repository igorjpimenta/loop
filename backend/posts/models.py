from django.db import models
from .storage import MediaStorage
import uuid
import os


class Topic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        db_table = 'topics'


def post_image_path(_, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'

    return os.path.join('posts', filename)


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=100)
    content = models.CharField(max_length=500)
    image = models.ImageField(
        upload_to=post_image_path,
        storage=MediaStorage(),
        blank=True,
        null=True,
    )
    topics = models.ManyToManyField(Topic)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'posts'

    def delete(self, *args, **kwargs):
        if self.image:
            self.image.delete(save=False)

        super().delete(*args, **kwargs)
