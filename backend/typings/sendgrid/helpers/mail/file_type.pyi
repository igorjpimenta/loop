from typing import Optional


class FileType:
    def __init__(self, file_type: Optional[str] = None) -> None: ...

    @property
    def file_type(self) -> str: ...

    @file_type.setter
    def file_type(self, value: str) -> None: ...

    def get(self) -> str: ...
