from typing import TypedDict


class ClickTrackingObject(TypedDict, total=False):
    enable: bool
    enable_text: bool


class ClickTracking:
    def __init__(self, enable: bool, enable_text: bool) -> None: ...

    @property
    def enable(self) -> bool: ...

    @enable.setter
    def enable(self, value: bool) -> None: ...

    @property
    def enable_text(self) -> bool: ...

    @enable_text.setter
    def enable_text(self, value: bool) -> None: ...

    def get(self) -> ClickTrackingObject: ...
