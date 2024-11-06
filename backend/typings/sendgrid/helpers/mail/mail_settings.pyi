# flake8: noqa: E501

from .bcc_settings import BccSettings
from .bypass_bounce_management import BypassBounceManagement
from .bypass_list_management import BypassListManagement
from .bypass_spam_management import BypassSpamManagement
from .bypass_unsubscribe_management import BypassUnsubscribeManagement
from .footer_settings import FooterSettings
from .sandbox_mode import SandBoxMode
from .spam_check import SpamCheck
from typing import Optional, TypedDict


class MailSettingsObject(TypedDict, total=False):
    bcc: BccSettings
    bypass_bounce_management: BypassBounceManagement
    bypass_list_management: BypassListManagement
    bypass_spam_management: BypassSpamManagement
    bypass_unsubscribe_management: BypassUnsubscribeManagement
    footer: FooterSettings
    sandbox_mode: SandBoxMode
    spam_check: SpamCheck


class MailSettings:
    def __init__(
        self,
        bcc_settings: Optional[BccSettings] = None,
        bypass_bounce_management: Optional[BypassBounceManagement] = None,
        bypass_list_management: Optional[BypassListManagement] = None,
        bypass_spam_management: Optional[BypassSpamManagement] = None,
        bypass_unsubscribe_management: Optional[BypassUnsubscribeManagement] = None,
        footer_settings: Optional[FooterSettings] = None,
        sandbox_mode: Optional[SandBoxMode] = None,
        spam_check: Optional[SpamCheck] = None
    ) -> None: ...

    @property
    def bcc_settings(self) -> BccSettings: ...

    @bcc_settings.setter
    def bcc_settings(self, value: BccSettings) -> None: ...

    @property
    def bypass_bounce_management(self) -> BypassBounceManagement: ...

    @bypass_bounce_management.setter
    def bypass_bounce_management(
        self,
        value: BypassBounceManagement
    ) -> None: ...

    @property
    def bypass_list_management(self) -> BypassListManagement: ...

    @bypass_list_management.setter
    def bypass_list_management(self, value: BypassListManagement) -> None: ...

    @property
    def bypass_spam_management(self) -> BypassSpamManagement: ...

    @bypass_spam_management.setter
    def bypass_spam_management(self, value: BypassSpamManagement) -> None: ...

    @property
    def bypass_unsubscribe_management(self) -> BypassUnsubscribeManagement: ...

    @bypass_unsubscribe_management.setter
    def bypass_unsubscribe_management(
        self,
        value: BypassUnsubscribeManagement
    ) -> None: ...

    @property
    def footer_settings(self) -> FooterSettings: ...

    @footer_settings.setter
    def footer_settings(self, value: FooterSettings) -> None: ...

    @property
    def sandbox_mode(self) -> SandBoxMode: ...

    @sandbox_mode.setter
    def sandbox_mode(self, value: SandBoxMode) -> None: ...

    @property
    def spam_check(self) -> SpamCheck: ...

    @spam_check.setter
    def spam_check(self, value: SpamCheck) -> None: ...

    def get(self) -> MailSettingsObject: ...
