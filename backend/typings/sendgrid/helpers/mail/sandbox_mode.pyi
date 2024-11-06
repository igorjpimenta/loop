from typing import Optional, TypedDict


class SandBoxModeObject(TypedDict, total=False):
    enable: bool


class SandBoxMode:
    def __init__(self, enable: Optional[bool] = None) -> None: ...

    @property
    def enable(self) -> bool: ...

    @enable.setter
    def enable(self, value: bool) -> None: ...

    def get(self) -> SandBoxModeObject: ...
