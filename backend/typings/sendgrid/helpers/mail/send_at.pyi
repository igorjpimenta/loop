from .personalization import Personalization
from typing import Optional


class SendAt:
    def __init__(
        self,
        send_at: Optional[int] = None,
        p: Optional[Personalization] = None
    ) -> None: ...

    @property
    def send_at(self) -> int: ...

    @send_at.setter
    def send_at(self, value: int) -> None: ...

    @property
    def personalization(self) -> Personalization: ...

    @personalization.setter
    def personalization(self, value: Personalization) -> None: ...

    def __str__(self) -> str: ...

    def get(self) -> int: ...
