from typing import TypedDict
from uuid import UUID
from posts.models import Topic
from accounts.types import UserData


class TopicData(TypedDict):
    id: UUID
    name: str


class PostData(TypedDict, total=False):
    id: UUID
    user: UserData
    user_id: UUID
    content: str
    image: str | None
    topics: list[TopicData]
    topics_ids: list[Topic]
