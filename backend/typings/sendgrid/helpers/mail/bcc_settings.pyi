from .bcc_settings_email import BccSettingsEmail
from typing import Optional, TypedDict


class BccSettingsObject(TypedDict, total=False):
    enable: bool
    email: BccSettingsEmail


class BccSettings:
    def __init__(
        self,
        enable: Optional[bool] = None,
        email: Optional[BccSettingsEmail] = None
    ) -> None: ...

    @property
    def enable(self) -> bool: ...

    @enable.setter
    def enable(self, value: bool) -> None: ...

    @property
    def email(self) -> BccSettingsEmail: ...

    @email.setter
    def email(self, value: BccSettingsEmail) -> None: ...

    def get(self) -> BccSettingsObject: ...
