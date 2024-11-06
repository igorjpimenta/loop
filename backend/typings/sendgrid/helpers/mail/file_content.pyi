from typing import Optional


class FileContent:
    def __init__(self, file_content: Optional[str] = None) -> None: ...

    @property
    def file_content(self) -> str: ...

    @file_content.setter
    def file_content(self, value: str) -> None: ...

    def get(self) -> str: ...
