from django.contrib.auth import get_user_model
from django.test import TestCase, TransactionTestCase
from rest_framework.test import APITestCase, APIClient
import abc
from posts.models import Post, Topic, PostComment

User = get_user_model()


class BaseTestSetup(abc.ABC):
    """Base test setup for posts app tests."""

    def setUp(self):
        self.client = APIClient()

        # Create test users
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='TestPass123!'
        )
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='test1@example.com',
            password='TestPass123!'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='TestPass123!'
        )

        # Create test topics
        self.topic1 = Topic.objects.create(name='Python')
        self.topic2 = Topic.objects.create(name='Django')

        # Create test post
        self.post1 = Post.objects.create(
            content='Test Post 1',
            user=self.user1
        )
        self.post1.topics.add(self.topic1)

        self.post2 = Post.objects.create(
            content='Test Post 2',
            user=self.user2
        )
        self.post2.topics.add(self.topic2)

        # Create test comment
        self.comment1 = PostComment.objects.create(
            post=self.post1,
            user=self.user2,
            content='Test comment'
        )

        # Test data
        self.post_data = {
            'content': 'New test content',
            'topics': [self.topic1.id],
        }

        self.comment_data = {
            'content': 'New test comment'
        }

    def tearDown(self):
        PostComment.objects.all().delete()
        Post.objects.all().delete()
        User.objects.all().delete()
        Topic.objects.all().delete()


class TestSetup(BaseTestSetup, TestCase):
    """Test setup for posts app tests."""


class APITestSetup(BaseTestSetup, APITestCase):
    """Test setup for posts app API tests."""


class TransactionTestSetup(BaseTestSetup, TransactionTestCase):
    """Test setup for posts app transaction tests."""
