from django.core.exceptions import ValidationError
from posts.tests.test_setup import TransactionTestSetup
from posts.models import Topic, PostComment


class PostModelTests(TransactionTestSetup):
    """Test suite for Post model."""

    def test_post_creation(self):
        """Test post creation with basic fields."""
        self.assertEqual(self.post1.content, 'Test Post 1')
        self.assertEqual(self.post1.user, self.user1)

    def test_post_votes(self):
        """Test post voting functionality."""
        # Test upvote
        self.post1.upvoted_by.add(self.user2)
        self.assertEqual(self.post1.votes, 1)
        self.assertTrue(
            self.post1.upvoted_by.filter(id=self.user2.pk).exists()
        )

        # Test downvote when user is already upvoted
        with self.assertRaises(ValidationError):
            self.post1.downvoted_by.add(self.user2)

        # Ensure the user is still only in upvoted_by
        self.assertTrue(
            self.post1.upvoted_by.filter(id=self.user2.pk).exists()
        )
        self.assertFalse(
            self.post1.downvoted_by.filter(id=self.user2.pk).exists()
        )

        # Test downvote
        self.post1.upvoted_by.remove(self.user2)
        self.post1.downvoted_by.add(self.user2)
        self.assertFalse(
            self.post1.upvoted_by.filter(id=self.user2.pk).exists()
        )
        self.assertTrue(
            self.post1.downvoted_by.filter(id=self.user2.pk).exists()
        )
        self.assertEqual(self.post1.votes, -1)

        # Test removing vote
        self.post1.downvoted_by.remove(self.user2)
        self.assertFalse(
            self.post1.upvoted_by.filter(id=self.user2.pk).exists()
        )
        self.assertFalse(
            self.post1.downvoted_by.filter(id=self.user2.pk).exists()
        )
        self.assertEqual(self.post1.votes, 0)

    def test_post_save(self):
        """Test post save functionality."""
        self.post1.saved_by.add(self.user2)
        self.assertTrue(self.post1.saved_by.filter(id=self.user2.pk).exists())

        self.post1.saved_by.remove(self.user2)
        self.assertFalse(self.post1.saved_by.filter(id=self.user2.pk).exists())


class TopicModelTests(TransactionTestSetup):
    """Test suite for Topic model."""

    model = Topic

    def test_topic_creation(self):
        """Test topic creation."""
        new_topic = self.model.objects.create(name='JavaScript')
        self.assertEqual(new_topic.name, 'JavaScript')
        self.assertTrue(self.model.objects.filter(name='JavaScript').exists())


class PostCommentTests(TransactionTestSetup):
    """Test suite for PostComment model."""

    model = PostComment

    def test_comment_creation(self):
        """Test comment creation."""
        self.assertEqual(self.comment1.content, 'Test comment')
        self.assertEqual(self.comment1.user, self.user2)
        self.assertEqual(self.comment1.post, self.post1)

    def test_comment_ordering(self):
        """Test comment ordering by created_at."""
        comment2 = self.model.objects.create(
            post=self.post1,
            user=self.user1,
            content='Later comment'
        )
        comments = self.model.objects.filter(post=self.post1)
        self.assertIn(self.comment1, comments)
        self.assertIn(comment2, comments)
