from typing import Optional


class IpPoolName:
    def __init__(self, ip_pool_name: Optional[str] = None) -> None: ...

    @property
    def ip_pool_name(self) -> str: ...

    @ip_pool_name.setter
    def ip_pool_name(self, value: str) -> None: ...

    def get(self) -> str: ...
