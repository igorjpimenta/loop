from typing import Optional, TypedDict


class FooterSettingsObject(TypedDict, total=False):
    enable: bool
    text: str
    html: str


class FooterSettings:
    def __init__(self, enable: Optional[bool] = None) -> None: ...

    @property
    def enable(self) -> bool: ...

    @enable.setter
    def enable(self, value: bool) -> None: ...

    @property
    def text(self) -> str: ...

    @text.setter
    def text(self, value: str) -> None: ...

    @property
    def html(self) -> str: ...

    @html.setter
    def html(self, value: str) -> None: ...

    def get(self) -> FooterSettingsObject: ...
