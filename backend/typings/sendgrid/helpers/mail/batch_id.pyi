from typing import Optional


class BatchId:
    def __init__(self, batch_id: Optional[str] = None) -> None: ...

    @property
    def batch_id(self) -> str: ...

    @batch_id.setter
    def batch_id(self, value: str) -> None: ...

    def __str__(self) -> str: ...

    def get(self) -> str: ...