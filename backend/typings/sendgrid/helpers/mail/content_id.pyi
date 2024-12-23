from typing import Optional


class ContentId:
    def __init__(self, content_id: Optional[str] = None) -> None: ...

    @property
    def content_id(self) -> str: ...

    @content_id.setter
    def content_id(self, value: str) -> None: ...

    def get(self) -> str: ...
