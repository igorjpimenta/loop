from typing import Optional, TypedDict


class BypassListManagementObject(TypedDict, total=False):
    enable: bool


class BypassListManagement:
    def __init__(self, enable: Optional[bool] = None) -> None: ...

    @property
    def enable(self) -> bool: ...

    @enable.setter
    def enable(self, value: bool) -> None: ...

    def get(self) -> BypassListManagementObject: ...
