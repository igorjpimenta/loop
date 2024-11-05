from rest_framework import serializers
from .models import Post, Topic
from .types import PostData
from accounts.serializers import UserSerializer
from accounts.models import User


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name']


class PostSerializer(serializers.ModelSerializer):
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

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'user_id', 'created_at',
            'content', 'image', 'topics', 'topics_ids'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        user = validated_data.pop('user_id', None)
        topics = validated_data.pop('topics_ids', [])

        post = Post.objects.create(**validated_data, user=user)

        if topics:
            post.topics.set(topics)

        return post

    def update(self, instance: Post, validated_data: PostData) -> Post:
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
