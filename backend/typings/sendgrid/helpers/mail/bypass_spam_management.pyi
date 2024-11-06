from typing import Optional, TypedDict


class BypassSpamManagementObject(TypedDict, total=False):
    enable: bool


class BypassSpamManagement:
    def __init__(self, enable: Optional[bool] = None) -> None: ...

    @property
    def enable(self) -> bool: ...

    @enable.setter
    def enable(self, value: bool) -> None: ...

    def get(self) -> BypassSpamManagementObject: ...
