from posts.tests.test_setup import TestSetup
from posts.serializers import (
    PostSerializer,
    TopicSerializer,
    PostCommentSerializer
)


class PostSerializerTests(TestSetup):
    """Test suite for PostSerializer."""

    serializer = PostSerializer

    def test_valid_post_serialization(self):
        """Test serializing a valid post."""
        serializer = self.serializer(self.post1)
        data = serializer.data

        self.assertEqual(data['content'], self.post1.content)
        self.assertEqual(data['user']['username'], self.user1.username)
        self.assertIn(
            str(self.topic1.id),
            [str(topic['id']) for topic in data['topics']]
        )

    def test_post_creation_validation(self):
        """Test post creation validation."""
        invalid_data = {
            'content': '',
            'topics': [self.topic1.id]
        }
        serializer = self.serializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('content', serializer.errors)


class TopicSerializerTests(TestSetup):
    """Test suite for TopicSerializer."""

    serializer = TopicSerializer

    def test_topic_serialization(self):
        """Test serializing a topic."""
        serializer = self.serializer(self.topic1)
        data = serializer.data

        self.assertEqual(data['name'], self.topic1.name)
        self.assertEqual(data['id'], str(self.topic1.id))

    def test_topic_creation_validation(self):
        """Test topic creation validation."""
        # Test duplicate topic name
        invalid_data = {'name': self.topic1.name}
        serializer = self.serializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())


class PostCommentSerializerTests(TestSetup):
    """Test suite for PostCommentSerializer."""

    serializer = PostCommentSerializer

    def test_comment_serialization(self):
        """Test serializing a comment."""
        serializer = self.serializer(self.comment1)
        data = serializer.data

        self.assertEqual(data['content'], self.comment1.content)
        self.assertEqual(data['user']['username'], self.user2.username)
        self.assertEqual(data['post_id'], str(self.comment1.post.pk))

    def test_comment_creation_validation(self):
        """Test comment creation validation."""
        invalid_data = {'content': ''}  # Empty content should fail
        serializer = self.serializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('content', serializer.errors)
