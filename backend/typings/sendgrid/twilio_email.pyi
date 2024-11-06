from .base_interface import BaseInterface
from typing import Optional


class TwilioEmailAPIClient(BaseInterface):
    def __init__(
        self,
        username: Optional[str] = None,
        password: Optional[str] = None,
        host: str = "https://email.twilio.com",
        impersonate_subuser: Optional[str] = None
    ) -> None: ...
