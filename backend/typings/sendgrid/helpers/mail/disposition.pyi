from typing import Literal, Optional


class Disposition:
    def __init__(
        self,
        disposition: Optional[Literal["inline", "attachment"]] = None
    ) -> None: ...

    @property
    def disposition(self) -> Literal["inline", "attachment"]: ...

    @disposition.setter
    def disposition(self, value: Literal["inline", "attachment"]) -> None: ...

    def get(self) -> Literal["inline", "attachment"]: ...
