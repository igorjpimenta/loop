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
    content: str
    image: str | None
    topics: list[Topic]
