from rest_framework import serializers
from .models import Post, Topic
from .types import PostData


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name']


class PostSerializer(serializers.ModelSerializer):
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
            'id', 'username', 'created_at',
            'content', 'image', 'topics', 'topics_ids'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        topics_ids = validated_data.pop('topics_ids', [])

        post = Post.objects.create(**validated_data)

        if topics_ids:
            post.topics.set(topics_ids)

        return post

    def update(self, instance: Post, validated_data: PostData) -> Post:
        username = validated_data.pop('username', None)

        if username:
            raise serializers.ValidationError(
                "A post author's username cannot be changed."
            )

        topics_ids = validated_data.pop('topics_ids', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if topics_ids:
            instance.topics.set(topics_ids)

        return instance
