from django.core.management.base import BaseCommand
from django.core.files.uploadedfile import SimpleUploadedFile
from faker import Faker
from accounts.models import User
from posts.models import Topic, Post, PostComment
import random
import requests
from typing import List
from tqdm import tqdm


class Command(BaseCommand):
    help = 'Generates fake data for testing'

    def __init__(self):
        super().__init__()
        self.faker = Faker()

    def get_random_image(self) -> SimpleUploadedFile | None:
        """Get a random image from picsum.photos"""
        width = random.randint(400, 800)
        height = random.randint(400, 800)
        url = f"https://picsum.photos/{width}/{height}"
        response = requests.get(url)
        if response.status_code == 200:
            return SimpleUploadedFile(
                name=f"random_image_{random.randint(1, 1000)}.jpg",
                content=response.content,
                content_type='image/jpeg'
            )
        return None

    def create_users(self, count: int) -> List[User]:
        """Create fake users"""
        users = []
        for _ in tqdm(range(count), desc="Creating users", unit="user"):
            username = self.faker.user_name()
            while User.objects.filter(username=username).exists():
                username = self.faker.user_name()

            email = self.faker.email()
            while User.objects.filter(email=email).exists():
                email = self.faker.email()

            user = User.objects.create(
                username=username,
                email=email,
                password='testpass123'
            )
            users.append(user)
        return users

    def create_topics(self) -> List[Topic]:
        """Create fake topics"""
        topics = []
        topic_names = [
            "📚 Education", "🎬 Entertainment", "👗 Fashion",
            "💰 Finance & Investing", "🍽️ Food & Cooking",
            "🏥 Health & Wellness", "🌿 Lifestyle", "⚽ Sports",
            "💻 Technology", "✈️ Travel"
        ]
        for topic_name in tqdm(
            topic_names,
            desc="Creating topics",
            unit="topic"
        ):
            topic, _ = Topic.objects.get_or_create(name=topic_name)
            topics.append(topic)
        return topics

    def create_posts(
        self,
        users: List[User],
        topics: List[Topic],
        count: int
    ) -> List[Post]:
        """Create fake posts"""
        posts = []
        for _ in tqdm(range(count), desc="Creating posts", unit="post"):
            # 30% chance of having an image
            image = self.get_random_image() if random.random() < 0.3 else None

            post = Post.objects.create(
                user=random.choice(users),
                content=self.faker.text(max_nb_chars=500),
                image=image
            )

            # Add 1-3 random topics
            post_topics = random.sample(topics, random.randint(1, 3))
            post.topics.set(post_topics)

            # Add random votes
            voters = random.sample(users, random.randint(0, len(users)//2))
            for voter in voters:
                if random.random() < 0.7:  # 70% chance of upvote
                    post.upvoted_by.add(voter)
                else:
                    post.downvoted_by.add(voter)

            # Add random saves
            savers = random.sample(users, random.randint(0, len(users)//4))
            post.saved_by.set(savers)

            posts.append(post)
        return posts

    def create_comments(
        self,
        users: List[User],
        posts: List[Post],
        count: int
    ):
        """Create fake comments"""
        for _ in tqdm(range(count), desc="Creating comments", unit="comment"):
            # 20% chance of having an image
            image = self.get_random_image() if random.random() < 0.2 else None

            PostComment.objects.create(
                user=random.choice(users),
                post=random.choice(posts),
                content=self.faker.text(max_nb_chars=500),
                image=image
            )

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting seed data generation...\n')

        # Create base data
        users = self.create_users(count=50)
        topics = self.create_topics()
        posts = self.create_posts(users, topics, count=100)
        self.create_comments(users, posts, count=200)

        self.stdout.write('\n' + self.style.SUCCESS(
            f'Successfully created:'
            f'\n- {len(users)} users'
            f'\n- {len(topics)} topics'
            f'\n- {len(posts)} posts'
            f'\n- 200 comments'
        ))
