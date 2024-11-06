from typing import TypedDict


class ContentObject(TypedDict, total=False):
    type: str
    value: str


class Content:
    def __init__(self, mime_type: str, content: str) -> None: ...

    @property
    def mime_type(self) -> str: ...

    @mime_type.setter
    def mime_type(self, value: str) -> None: ...

    @property
    def content(self) -> str: ...

    @content.setter
    def content(self, value: str) -> None: ...

    def get(self) -> ContentObject: ...
