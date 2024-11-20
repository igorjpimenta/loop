from django.urls import reverse
from rest_framework import status
from posts.tests.test_setup import APITestSetup
from posts.models import Topic, Post


class PostViewSetTests(APITestSetup):
    """Test suite for PostViewSet."""

    def setUp(self):
        super().setUp()
        self.post_list_url = reverse('post-list')
        self.post_detail_url = reverse(
            'post-detail',
            kwargs={'pk': self.post1.pk}
        )
        self.post_upvote_url = reverse(
            'post-upvote',
            kwargs={'pk': self.post1.pk}
        )
        self.post_downvote_url = reverse(
            'post-downvote',
            kwargs={'pk': self.post1.pk}
        )
        self.post_save_url = reverse(
            'post-save',
            kwargs={'pk': self.post1.pk}
        )

    def test_list_posts(self):
        """Test listing posts."""
        response = self.client.get(self.post_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # We created 2 posts in setup

    def test_create_post(self):
        """Test creating a new post."""
        self.client.force_login(user=self.user1)
        response = self.client.post(
            self.post_list_url,
            {
                **self.post_data,
                'user_id': self.user1.pk,
                'topics_ids': [self.topic1.pk]
            }
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], self.post_data['content'])
        self.assertEqual(
            response.data['topics'][0]['id'],
            str(self.topic1.pk)
        )
        self.assertEqual(response.data['user']['id'], str(self.user1.pk))

    def test_create_post_with_invalid_data(self):
        """Test creating a post with invalid data."""
        self.client.force_login(user=self.user1)
        response = self.client.post(self.post_list_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upvote_post(self):
        """Test post voting functionality."""
        self.client.force_login(user=self.user2)

        # Test upvote
        response = self.client.post(self.post_upvote_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.post1.votes, 1)

        # Test double upvote (should remove vote)
        response = self.client.post(self.post_upvote_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.post1.votes, 0)

    def test_downvote_post(self):
        """Test post downvoting functionality."""
        self.client.force_login(user=self.user2)

        # Test downvote
        response = self.client.post(self.post_downvote_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.post1.votes, -1)

        # Test double downvote (should remove vote)
        response = self.client.post(self.post_downvote_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.post1.votes, 0)

    def test_save_post(self):
        """Test post saving functionality."""
        self.client.force_login(user=self.user2)

        # Test save
        response = self.client.post(self.post_save_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(
            self.user2,
            self.post1.saved_by.all()
        )

        # Test save when already saved
        response = self.client.post(self.post_save_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unsave_post(self):
        """Test post unsaving functionality."""
        self.client.force_login(user=self.user2)
        self.post1.saved_by.add(self.user2)

        # Test unsave
        response = self.client.delete(self.post_save_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn(
            self.user2,
            self.post1.saved_by.all()
        )

        # Test unsave when not saved
        response = self.client.delete(self.post_save_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthorized_post_modification(self):
        """Test unauthorized post modification."""
        self.client.force_login(user=self.user2)
        response = self.client.put(self.post_detail_url, self.post_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_owner_permission(self):
        """Test IsOwnerOrReadOnly permission."""
        # Create a post for testing ownership
        topic = Topic.objects.create(name='Test topic')
        post = Post.objects.create(
            content='Test Content',
            user=self.user1
        )
        post.topics.add(topic)
        post_detail_url = reverse('post-detail', kwargs={'pk': post.pk})

        # Unauthenticated user should get read-only access
        response = self.client.get(post_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Non-owner should not be able to modify
        self.client.force_login(user=self.user2)
        response = self.client.patch(
            post_detail_url,
            {'content': 'New Content'},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Owner should be able to modify
        self.client.force_login(user=self.user1)
        response = self.client.patch(
            post_detail_url,
            {'content': 'New Content'},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            Post.objects.get(pk=post.pk).content,
            'New Content'
        )


class TopicViewSetTests(APITestSetup):
    """Test suite for TopicViewSet."""

    def setUp(self):
        super().setUp()
        self.topic_list_url = reverse('topic-list')
        self.topic_detail_url = reverse(
            'topic-detail',
            kwargs={'pk': self.topic1.pk}
        )

    def test_list_topics(self):
        """Test listing topics."""
        response = self.client.get(self.topic_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # We created 2 topics in setup

    def test_create_topic(self):
        """Test creating a new topic."""

        # Test standard user
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(self.topic_list_url, {'name': 'React'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Test admin user
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.topic_list_url, {'name': 'React'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'React')
