from .personalization import Personalization
from typing import Optional, Dict


class CustomArg:
    def __init__(
        self,
        key: Optional[str] = None,
        value: Optional[str] = None,
        p: Optional[Personalization] = None
    ) -> None: ...

    @property
    def key(self) -> str: ...

    @key.setter
    def key(self, value: str) -> None: ...

    @property
    def value(self) -> str: ...

    @value.setter
    def value(self, value: str) -> None: ...

    @property
    def personalization(self) -> Personalization: ...

    @personalization.setter
    def personalization(self, value: Personalization) -> None: ...

    def get(self) -> Dict[str, str]: ...
