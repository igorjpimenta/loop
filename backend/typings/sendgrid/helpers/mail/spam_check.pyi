from typing import Optional, TypedDict


class SpamCheckObject(TypedDict, total=False):
    enable: bool
    threshold: int
    post_to_url: str


class SpamCheck:
    def __init__(
        self,
        enable: Optional[bool] = None,
        threshold: Optional[int] = None,
        post_to_url: Optional[str] = None
    ) -> None: ...

    @property
    def enable(self) -> bool: ...

    @enable.setter
    def enable(self, value: bool) -> None: ...

    @property
    def threshold(self) -> int: ...

    @threshold.setter
    def threshold(self, value: int) -> None: ...

    @property
    def post_to_url(self) -> str: ...

    @post_to_url.setter
    def post_to_url(self, value: str) -> None: ...

    def get(self) -> SpamCheckObject: ...
