# flake8: noqa: E501

from typing import Optional, Literal, overload
from .base_interface import BaseInterface


class SendGridAPIClient(BaseInterface):
    api_key: str
    host: Literal["https://api.eu.sendgrid.com", "https://api.sendgrid.com"]

    @overload
    def __init__(
        self,
        api_key: str,
        impersonate_subuser: Optional[str] = None,
        host: str = "https://api.sendgrid.com",
        version: str = "v3",
        timeout: Optional[int] = None
    ) -> None: ...

    @overload
    def __init__(
        self,
        api_key: None = None,
        impersonate_subuser: Optional[str] = None,
        host: str = "https://api.sendgrid.com",
        version: str = "v3",
        timeout: Optional[int] = None
    ) -> None: ...
