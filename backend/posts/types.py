from typing import TypedDict
from uuid import UUID
from posts.models import Topic


class TopicData(TypedDict):
    id: str
    name: str


class PostData(TypedDict, total=False):
    id: UUID
    username: str
    content: str
    image: str | None
    topics: list[TopicData]
    topics_ids: list[Topic]
