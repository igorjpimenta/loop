from typing import Literal
from .helpers.mail.header import Header
from .helpers.mail.mail import Mail
import python_http_client  # type: ignore


class BaseInterface:
    auth: str
    impersonate_subuser: str
    host: Literal["https://api.eu.sendgrid.com", "https://api.sendgrid.com"]
    version: str
    useragent: str
    client: python_http_client.Client

    def __init__(
        self,
        auth: str,
        host: str,
        impersonate_subuser: str,
    ) -> None: ...

    def reset_request_headers(self) -> None: ...

    def send(self, message: Mail) -> python_http_client.client.Response: ...

    def set_sendgrid_data_residency(
        self,
        region: Literal["eu", "global"]
    ) -> None: ...

    @property
    def _default_headers(self) -> Header: ...
