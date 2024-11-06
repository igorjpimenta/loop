from typing import Optional, Dict, Any


class Section:
    def __init__(
        self,
        key: Optional[str] = None,
        value: Optional[str] = None
    ) -> None: ...

    @property
    def key(self) -> str: ...

    @key.setter
    def key(self, value: str) -> None: ...

    @property
    def value(self) -> str: ...

    @value.setter
    def value(self, value: str) -> None: ...

    def get(self) -> Dict[str, Any]: ...
