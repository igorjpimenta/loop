from rest_framework import serializers
from .models import Post, Topic, PostComment
from .types import PostData
from accounts.serializers import UserSerializer
from accounts.models import User


class TopicSerializer(serializers.ModelSerializer):
    """
    Serializer for Topic model.
    Provides basic topic information.
    """
    class Meta:
        model = Topic
        fields = ['id', 'name']


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for Post model.
    Handles post creation, update, and provides nested serialization
    for related fields.
    Includes post actions summary through a nested serializer.
    """
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
    )
    topics = TopicSerializer(many=True, read_only=True)
    topics_ids = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all(),
        many=True,
        required=False,
        write_only=True,
    )
    actions = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'user_id', 'created_at',
            'content', 'image', 'topics', 'topics_ids', 'actions'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data) -> Post:
        """
        Create a new Post instance.
        Handles the creation of related topics.

        Args:
            validated_data: Dictionary of validated data for post creation

        Returns:
            Post: Created post instance
        """
        user = validated_data.pop('user_id', None)
        topics = validated_data.pop('topics_ids', [])

        post = Post.objects.create(**validated_data, user=user)

        if topics:
            post.topics.set(topics)

        return post

    def update(self, instance: Post, validated_data: PostData) -> Post:
        """
        Update an existing Post instance.
        Prevents changing the post author and handles topic updates.

        Args:
            instance: Existing post instance to update
            validated_data: Dictionary of validated data for post update

        Returns:
            Post: Updated post instance

        Raises:
            ValidationError: If attempting to change post author
        """
        user = validated_data.pop('user_id', None)

        if user:
            raise serializers.ValidationError(
                "A post author's cannot be changed."
            )

        topics = validated_data.pop('topics_ids', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if topics:
            instance.topics.set(topics)

        return instance

    def get_actions(self, obj: Post):
        """
        Get post actions summary.

        Args:
            obj: Post instance to get actions for

        Returns:
            dict: Actions summary including votes, comments, and user actions
        """
        return PostActionsSummarySerializer(obj, context=self.context).data


class PostCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for PostComment model.
    Handles comment creation and provides nested user information.
    """
    user = UserSerializer(read_only=True)
    post_id = serializers.SerializerMethodField()

    class Meta:
        model = PostComment
        fields = [
            'id',
            'user',
            'post_id',
            'content',
            'image',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_post_id(self, obj: PostComment) -> str:
        """
        Get the associated post's ID.

        Args:
            obj: PostComment instance

        Returns:
            str: UUID of the associated post
        """
        return str(obj.post.id)


class PostActionsSummarySerializer(serializers.ModelSerializer):
    """
    Serializer for Post actions summary.
    Provides information about post interactions
    (votes, comments, user actions).
    """
    comments = serializers.SerializerMethodField()
    is_upvoted = serializers.BooleanField(default=False)
    is_downvoted = serializers.BooleanField(default=False)
    is_saved = serializers.BooleanField(default=False)

    class Meta:
        model = Post
        fields = [
            'votes',
            'comments',
            'is_upvoted',
            'is_downvoted',
            'is_saved',
        ]

    def get_comments(self, obj) -> int:
        """
        Get the count of comments for the post.

        Args:
            obj: Post instance

        Returns:
            int: Number of comments on the post
        """
        return obj.comments.count()
